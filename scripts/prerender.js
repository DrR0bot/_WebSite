#!/usr/bin/env node
/**
 * Post-build snapshot prerender for the Hyve Dynamics SPA.
 *
 * What it does:
 *   1. Spawns `vite preview` against the freshly built `dist/` directory.
 *   2. For each route in PRERENDER_ROUTES, opens the URL in headless Chrome,
 *      waits for the React app to mount and the page-specific
 *      `data-prerender-ready` flag (or a sensible network-idle fallback)
 *      to fire, then snapshots the fully rendered DOM.
 *   3. Writes the snapshot as `dist/<route>/index.html`, leaving the
 *      original `dist/index.html` (the SPA shell) in place as the fallback
 *      for any route NOT listed here.
 *
 * What it does NOT do:
 *   - Rewrite asset hashes — Vite already finalised those at build time.
 *   - Mutate React state, react-router, react-helmet-async, or any
 *     application code. The runtime app stays a pure SPA; this is purely
 *     a build-time HTML capture.
 *
 * Why this approach:
 *   - The codebase makes heavy use of Three.js, anime.js-style imperative
 *     animation, and direct DOM access at module load (see audit in
 *     docs/hyve-llm-visibility-progress.md). A true SSR/SSG migration
 *     (Vike, Next, etc.) would require restructuring routing and wrapping
 *     every visual component in <ClientOnly>. Snapshotting in headless
 *     Chrome avoids that entirely: the app boots in a real browser, then
 *     we capture the resulting HTML.
 *
 * Companion changes:
 *   - src/main.tsx detects pre-rendered HTML and uses hydrateRoot()
 *     instead of createRoot() to avoid double-render.
 *   - vercel.json keeps the SPA fallback rewrite for any route not in
 *     this prerender list (e.g. /deck, /investor/*).
 */

import { spawn, execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import puppeteer from 'puppeteer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')
const DIST_DIR = path.join(PROJECT_ROOT, 'dist')
const PREVIEW_PORT = Number(process.env.PRERENDER_PORT || 4322)
const PREVIEW_ORIGIN = `http://127.0.0.1:${PREVIEW_PORT}`

/**
 * Routes to capture. Mirrors src/App.tsx and public/sitemap.xml.
 * EXCLUDED on purpose:
 *   - /deck                                  (private pitch deck)
 *   - /investor/updates/*                    (confidential, NoIndex)
 *   - 404 / catch-all                        (SPA shell fallback is fine)
 */
const PRERENDER_ROUTES = [
  '/',
  '/about',
  '/haptic-matrix',
  '/industries/aerospace',
  '/industries/automotive',
  '/industries/digital-twinning-ihm',
  '/industries/robotics',
  '/insights/news',
  '/insights/newsletter',
  '/insights/white-papers',
  '/insights/newsletter/aerodynamic-innovation-2024',
  '/insights/newsletter/sensor-technology-trends',
]

/**
 * Per-route maximum wait time (ms). Heavier visual pages get a longer
 * budget because Three.js / anime.js settle slowly.
 */
const ROUTE_WAIT_MS = {
  '/': 6000,
  '/haptic-matrix': 6000,
}
const DEFAULT_WAIT_MS = 4000

function log(msg) {
  process.stdout.write(`[prerender] ${msg}\n`)
}

function err(msg) {
  process.stderr.write(`[prerender] ${msg}\n`)
}

function ensureDistExists() {
  if (!fs.existsSync(DIST_DIR) || !fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
    err(
      `dist/ not found or missing index.html. Run \`npm run build\` first.`,
    )
    process.exit(1)
  }
}

/**
 * Boot `vite preview` in a child process, return when it is listening.
 */
function startPreview() {
  return new Promise((resolve, reject) => {
    log(`starting vite preview on port ${PREVIEW_PORT}...`)
    // Run vite directly via node to avoid the npx -> shell -> vite chain.
    // On Windows that chain spawns grandchildren that don't die with the
    // parent, leaving zombie listeners on PREVIEW_PORT between runs.
    const viteEntry = path.join(PROJECT_ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
    const child = spawn(
      process.execPath,
      [viteEntry, 'preview', '--port', String(PREVIEW_PORT), '--strictPort', '--host', '127.0.0.1'],
      {
        cwd: PROJECT_ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, NODE_ENV: 'production' },
      },
    )

    let resolved = false
    const onLine = (chunk) => {
      const text = chunk.toString()
      if (process.env.PRERENDER_VERBOSE) process.stdout.write(text)
      if (!resolved && /Local:.*:\d+/.test(text)) {
        resolved = true
        resolve(child)
      }
    }
    child.stdout.on('data', onLine)
    child.stderr.on('data', onLine)

    child.on('exit', (code) => {
      if (!resolved) reject(new Error(`vite preview exited early with code ${code}`))
    })

    setTimeout(() => {
      if (!resolved) {
        resolved = true
        log('preview did not announce a port within 30s, attempting connect anyway')
        resolve(child)
      }
    }, 30000)
  })
}

function stopPreview(child) {
  if (!child) return
  try {
    if (process.platform === 'win32' && child.pid) {
      // Synchronous taskkill so we don't exit before the OS has actually
      // released the port (otherwise the next prerender run gets EADDRINUSE).
      try {
        execSync(`taskkill /F /T /PID ${child.pid}`, { stdio: 'ignore' })
      } catch {
        /* process may already be dead; ignore */
      }
    } else {
      child.kill('SIGTERM')
    }
  } catch {
    /* noop */
  }
}

// Make sure we never leave a zombie vite preview behind.
process.on('SIGINT', () => process.exit(130))
process.on('SIGTERM', () => process.exit(143))

/**
 * Visit a route, capture rendered HTML, save to dist/<route>/index.html.
 */
async function snapshotRoute(browser, route) {
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(30000)

  const consoleErrors = []
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`console.error: ${msg.text()}`)
  })

  const url = `${PREVIEW_ORIGIN}${route}`
  log(`capturing ${route}`)

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' })

    // Wait for React root to mount.
    try {
      await page.waitForFunction(
        () => {
          const root = document.getElementById('root')
          return root && root.children.length > 0
        },
        { timeout: 15000 },
      )
    } catch (waitErr) {
      // Surface in-page errors that explain why React never mounted.
      err(`  ! ${route} mount-wait failed; in-page diagnostics:`)
      for (const line of consoleErrors.slice(-10)) err(`     ${line}`)
      const rootHtml = await page.evaluate(() => {
        const r = document.getElementById('root')
        return r ? `root.innerHTML.length=${r.innerHTML.length}` : 'no root'
      }).catch(() => 'eval failed')
      err(`     ${rootHtml}`)
      throw waitErr
    }

    // Wait for either the per-route ready flag (set by app code on mount)
    // or a sensible time budget for animations / fonts / async chunks.
    const waitMs = ROUTE_WAIT_MS[route] ?? DEFAULT_WAIT_MS
    try {
      await page.waitForFunction(() => document.documentElement.dataset.prerenderReady === 'true', {
        timeout: waitMs,
      })
    } catch {
      // No flag set — fall back to time-based settle. Acceptable for static
      // marketing pages whose first-paint content is the meaningful payload.
    }

    // One more network-idle pass to let any deferred chunks land.
    await new Promise((r) => setTimeout(r, 250))

    const html = await page.content()

    // Sanity check: refuse to overwrite if we still see only the empty shell.
    const rootMatch = html.match(/<div id="root">([\s\S]*?)<\/div>\s*<script/)
    const rootContent = rootMatch ? rootMatch[1].trim() : ''
    if (!rootContent || rootContent.length < 50) {
      err(`  ! ${route} rendered only an empty root; skipping write`)
      return { route, ok: false, reason: 'empty-root', errors: consoleErrors }
    }

    // Write to dist/<route>/index.html, leaving dist/index.html alone for "/".
    let outPath
    if (route === '/') {
      outPath = path.join(DIST_DIR, 'index.html')
    } else {
      const dir = path.join(DIST_DIR, route.replace(/^\//, ''))
      fs.mkdirSync(dir, { recursive: true })
      outPath = path.join(dir, 'index.html')
    }
    fs.writeFileSync(outPath, html, 'utf8')
    log(`  -> ${path.relative(PROJECT_ROOT, outPath)} (${(html.length / 1024).toFixed(1)} KB)`)

    return { route, ok: true, bytes: html.length, errors: consoleErrors }
  } catch (e) {
    err(`  ! ${route} failed: ${e.message}`)
    return { route, ok: false, reason: e.message, errors: consoleErrors }
  } finally {
    await page.close()
  }
}

async function main() {
  ensureDistExists()

  const preview = await startPreview()
  let browser
  const results = []

  try {
    log('launching headless chrome...')
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    for (const route of PRERENDER_ROUTES) {
      // eslint-disable-next-line no-await-in-loop
      results.push(await snapshotRoute(browser, route))
    }
  } finally {
    if (browser) await browser.close()
    stopPreview(preview)
  }

  const ok = results.filter((r) => r.ok).length
  const fail = results.length - ok
  log(`done. ${ok} succeeded, ${fail} failed.`)

  if (fail > 0) {
    err('failures:')
    for (const r of results.filter((r) => !r.ok)) {
      err(`  ${r.route}: ${r.reason || 'unknown'}`)
    }
    if (!process.env.PRERENDER_ALLOW_PARTIAL) {
      process.exit(1)
    }
  }
}

main().catch((e) => {
  err(`fatal: ${e.stack || e.message}`)
  process.exit(1)
})
