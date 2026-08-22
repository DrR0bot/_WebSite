/**
 * Banner capture — renders the Home page mesh background at an exact pixel
 * size and screenshots horizontal bands out of it.
 *
 * Usage:
 *   npm run banner                       # default: LinkedIn company cover
 *   BANNER_OUT_DIR=./out npm run banner  # write somewhere else
 *
 * How it works:
 *   1. Boots `vite dev` (the /banner route is dev-only, so a production
 *      preview build won't have it).
 *   2. Opens /banner?w=<stage width>&h=<stage height>, which renders
 *      CustomMeshBackground on its own, pinned to the viewport origin.
 *   3. Waits out a settle period so the wave animation and the flowing
 *      streamlines land in a pleasing position.
 *   4. Screenshots the full stage as a reference, then clips one band per
 *      BAND_OFFSETS entry at the target banner size.
 *
 * Why screenshots rather than an in-page export: CustomMeshBackground
 * creates its WebGLRenderer without `preserveDrawingBuffer`, so the drawing
 * buffer is cleared after each frame and both html2canvas and
 * canvas.toDataURL() come back blank. Chrome's compositor-backed screenshot
 * captures WebGL correctly. Verified empirically — see the note in
 * src/pages/social/BannerPage.tsx.
 *
 * The mesh camera has a fixed 60° vertical FOV, so the STAGE aspect ratio
 * controls the perspective. Rendering straight into a ~6:1 banner would
 * blow the horizontal FOV out to ~147° and fisheye the grid, which is why
 * we render a natural aspect and clip a band instead.
 */

import { spawn, execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

const PORT = Number(process.env.BANNER_PORT || 4324)
const ORIGIN = `http://127.0.0.1:${PORT}`

/** LinkedIn company page cover. */
const BANNER_W = Number(process.env.BANNER_W || 1128)
const BANNER_H = Number(process.env.BANNER_H || 191)

/**
 * Stage the scene is rendered into. Wider/taller than the banner so the
 * perspective matches the Home page and we can choose which band to keep.
 */
const STAGE_W = Number(process.env.BANNER_STAGE_W || BANNER_W)
const STAGE_H = Number(process.env.BANNER_STAGE_H || 634)

/** Vertical offsets (CSS px from the top of the stage) to clip bands at. */
const BAND_OFFSETS = (process.env.BANNER_BANDS || '60,120,180,240')
  .split(',')
  .map((n) => Number(n.trim()))
  .filter((n) => Number.isFinite(n))

/** Milliseconds to let the wave + streamline animation settle. */
const SETTLE_MS = Number(process.env.BANNER_SETTLE_MS || 4000)

/** 1 = exact LinkedIn spec, 2 = retina. Both are written. */
const SCALES = (process.env.BANNER_SCALES || '1,2')
  .split(',')
  .map((n) => Number(n.trim()))
  .filter((n) => Number.isFinite(n))

const OUT_DIR = path.resolve(
  PROJECT_ROOT,
  process.env.BANNER_OUT_DIR ||
    'C:/Users/jtobo/OneDrive/Documents/04_Hyve_Dynamics/07_Brand_and_Web/Banners',
)

const log = (msg) => process.stdout.write(`[banner] ${msg}\n`)
const err = (msg) => process.stderr.write(`[banner] ${msg}\n`)

function startDevServer() {
  return new Promise((resolve, reject) => {
    log(`starting vite dev on port ${PORT}...`)
    // Invoke vite's entry directly rather than via npx: on Windows the
    // npx -> shell -> vite chain leaves grandchildren that outlive the
    // parent and hold the port. Same approach as scripts/prerender.js.
    const viteEntry = path.join(PROJECT_ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
    const child = spawn(
      process.execPath,
      [viteEntry, '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
      { cwd: PROJECT_ROOT, stdio: ['ignore', 'pipe', 'pipe'] },
    )

    let resolved = false
    const onLine = (chunk) => {
      const text = chunk.toString()
      if (process.env.BANNER_VERBOSE) process.stdout.write(text)
      if (!resolved && /Local:.*:\d+/.test(text)) {
        resolved = true
        resolve(child)
      }
    }
    child.stdout.on('data', onLine)
    child.stderr.on('data', onLine)
    child.on('exit', (code) => {
      if (!resolved) reject(new Error(`vite dev exited early with code ${code}`))
    })

    setTimeout(() => {
      if (!resolved) {
        resolved = true
        log('dev server did not announce a port within 30s, connecting anyway')
        resolve(child)
      }
    }, 30000)
  })
}

function stopDevServer(child) {
  if (!child) return
  try {
    if (process.platform === 'win32' && child.pid) {
      execSync(`taskkill /F /T /PID ${child.pid}`, { stdio: 'ignore' })
    } else {
      child.kill('SIGTERM')
    }
  } catch {
    /* already dead */
  }
}

process.on('SIGINT', () => process.exit(130))
process.on('SIGTERM', () => process.exit(143))

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const server = await startDevServer()
  let browser

  try {
    const puppeteer = (await import('puppeteer')).default
    log('launching headless chrome...')
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const stamp = new Date().toISOString().replace(/[:.]/g, '-')

    for (const scale of SCALES) {
      const page = await browser.newPage()
      await page.setViewport({
        width: STAGE_W,
        height: STAGE_H,
        deviceScaleFactor: scale,
      })

      const url = `${ORIGIN}/banner?w=${STAGE_W}&h=${STAGE_H}`
      log(`capturing at ${scale}x — ${url}`)
      await page.goto(url, { waitUntil: 'domcontentloaded' })

      await page.waitForFunction(
        () => document.documentElement.dataset.bannerReady === 'true',
        { timeout: 20000 },
      )
      // The mesh needs a WebGL canvas on the page before anything is worth
      // capturing; then let the animation settle.
      await page.waitForSelector('#banner-stage canvas', { timeout: 20000 })
      await new Promise((r) => setTimeout(r, SETTLE_MS))

      // Full stage, for choosing a band offset by eye.
      const refPath = path.join(OUT_DIR, `stage-${STAGE_W}x${STAGE_H}@${scale}x-${stamp}.png`)
      await page.screenshot({ path: refPath })
      log(`  -> ${path.basename(refPath)} (full stage reference)`)

      for (const offset of BAND_OFFSETS) {
        if (offset + BANNER_H > STAGE_H) {
          err(`  ! band offset ${offset} + ${BANNER_H} exceeds stage height ${STAGE_H}; skipping`)
          continue
        }
        const outPath = path.join(
          OUT_DIR,
          `hyve-banner-${BANNER_W}x${BANNER_H}-y${offset}@${scale}x-${stamp}.png`,
        )
        await page.screenshot({
          path: outPath,
          clip: { x: 0, y: offset, width: BANNER_W, height: BANNER_H },
        })
        log(`  -> ${path.basename(outPath)}`)
      }

      await page.close()
    }

    log(`done. output in ${OUT_DIR}`)
  } finally {
    if (browser) await browser.close()
    stopDevServer(server)
  }
}

main().catch((e) => {
  err(`fatal: ${e.stack || e.message}`)
  stopDevServer()
  process.exit(1)
})
