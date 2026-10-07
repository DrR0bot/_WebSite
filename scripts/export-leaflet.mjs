/**
 * Leaflet export — prints the dev-only /leaflet route to a true-size A5 PDF
 * (154 × 216 mm per page incl. 3 mm bleed) plus PNG previews of each side.
 *
 * Usage:
 *   npm run leaflet                          # -> ../Print/hyve-leaflet-eds2026-a5.pdf
 *   LEAFLET_OUT_DIR=./out npm run leaflet    # write somewhere else
 *   LEAFLET_NAME=my-leaflet npm run leaflet  # change the file stem
 *
 * How it works:
 *   1. Boots `vite dev` (the /leaflet route is dev-only).
 *   2. Opens /leaflet?print=1, waits for fonts (data-leaflet-ready) and a
 *      short settle period.
 *   3. page.pdf() with preferCSSPageSize so the @page rule in Leaflet.css
 *      sets the sheet size. Text stays vector; backgrounds are kept.
 *   4. Screenshots each .leaflet-page at 2x for quick review.
 *
 * Hand the PDF to the printer as "A5, 3 mm bleed, no crop marks" (or ask
 * them to add marks). If they want marks embedded, say so and we can add
 * them to the page.
 */

import { spawn, execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')

const PORT = Number(process.env.LEAFLET_PORT || 4325)
const ORIGIN = `http://127.0.0.1:${PORT}`
const OUT_DIR = path.resolve(PROJECT_ROOT, process.env.LEAFLET_OUT_DIR || '../Print')
const NAME = process.env.LEAFLET_NAME || 'hyve-leaflet-eds2026-a5'
const SETTLE_MS = Number(process.env.LEAFLET_SETTLE_MS || 1500)

const log = (m) => process.stdout.write(`[leaflet] ${m}\n`)
const err = (m) => process.stderr.write(`[leaflet] ${m}\n`)

// Same approach as scripts/capture-banner.mjs: invoke vite's entry directly
// so Windows doesn't leave orphaned grandchildren holding the port.
function startDevServer() {
  return new Promise((resolve, reject) => {
    log(`starting vite dev on port ${PORT}...`)
    const viteEntry = path.join(PROJECT_ROOT, 'node_modules', 'vite', 'bin', 'vite.js')
    const child = spawn(
      process.execPath,
      [viteEntry, '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
      { cwd: PROJECT_ROOT, stdio: ['ignore', 'pipe', 'pipe'] },
    )
    let resolved = false
    const onLine = (chunk) => {
      const text = chunk.toString()
      if (process.env.LEAFLET_VERBOSE) process.stdout.write(text)
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
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    // Viewport only matters for the PNG previews; the PDF uses @page.
    await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 2 })

    const url = `${ORIGIN}/leaflet?print=1`
    log(`opening ${url}`)
    await page.goto(url, { waitUntil: 'networkidle0' })
    await page.waitForFunction(() => document.documentElement.dataset.leafletReady === 'true', { timeout: 30000 })
    // Generated QR svgs (if used) appear asynchronously; images must be decoded.
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll('.leaflet-qr')].every((n) => n.querySelector('svg')) &&
        [...document.images].every((img) => img.complete && img.naturalWidth > 0),
      { timeout: 15000 },
    )
    await new Promise((r) => setTimeout(r, SETTLE_MS))

    const pdfPath = path.join(OUT_DIR, `${NAME}.pdf`)
    await page.pdf({
      path: pdfPath,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    })
    log(`-> ${path.basename(pdfPath)}`)

    const pages = await page.$$('.leaflet-page')
    for (const el of pages) {
      const side = await el.evaluate((n) => n.dataset.page)
      const pngPath = path.join(OUT_DIR, `${NAME}-${side}.png`)
      await el.screenshot({ path: pngPath })
      log(`-> ${path.basename(pngPath)} (preview)`)
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
