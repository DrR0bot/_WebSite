/**
 * Banner capture — renders the Home page mesh background at an exact pixel
 * size and screenshots horizontal bands out of it.
 *
 * Usage:
 *   npm run banner                       # default: LinkedIn company cover
 *   npm run banner:rollup                # 850 × 2000 mm roller stand, 100 dpi
 *   npm run banner:ppt                   # 16:9 PowerPoint slide background
 *   BANNER_OUT_DIR=./out npm run banner  # write somewhere else
 *
 * Portrait / print banners: set BANNER_W/H to the banner's pixel size (or
 * half of it and let BANNER_SCALES=2 double the resolution). Leave the
 * stage at the same size to render the mesh at the banner's own aspect
 * (this matches the tall Home page canvas), or make the stage wider and
 * pick columns with BANNER_COLUMNS=<x,x,...>.
 *
 * Camera: BANNER_LOOK="x,y,z" sets the point the camera aims at. Raising
 * y tilts the view up, moving the horizon down the frame and bringing the
 * streamlines in. Reference values for the roll-up: y=5 horizon ~35%,
 * y=15 ~60% (preset default), y=25 ~80%. BANNER_CAM moves the camera.
 * BANNER_STREAMLINE_OPACITY boosts the (1 px wide) streamlines for print.
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

/**
 * Named presets, selected with `--preset <name>`. Environment variables
 * still override individual values. Presets exist because npm scripts run
 * under cmd.exe on Windows, where `VAR=x npm run banner` does not work.
 */
const PRESETS = {
  /** LinkedIn company page cover, rendered inside a 16:9-ish stage. */
  linkedin: { w: 1128, h: 191, stageH: 634, scales: '1,2' },
  /**
   * Roller stand, 850 × 2000 mm. 1673 × 3937 CSS px at 2x = 3346 × 7874 px,
   * i.e. 100 dpi at print size — plenty for a large-format roll-up viewed
   * from a metre or more away. Stage == banner so the mesh renders at the
   * banner's own portrait aspect, like the tall Home page canvas. The
   * camera is tilted up (look.y 15 vs the Home page's -5) so the horizon
   * sits ~60% down and the streamlines fill the top half.
   */
  rollup: {
    w: 1673,
    h: 3937,
    scales: '2',
    settleMs: 6000,
    look: '0,15,-15',
    // Streamlines are 1 device px wide, so at 2x they need ~3x the site's
    // 0.15 opacity to read at print size.
    streamlineOpacity: '0.5',
  },
  /**
   * PowerPoint 16:9 slide background (13.333 × 7.5 in). 1920 × 1080 at 1x
   * for Full HD decks and 3840 × 2160 at 2x for 4K / projector use. Stage ==
   * slide so the mesh renders at the slide's own aspect. Tilted up so the
   * horizon sits mid-slide and the upper half stays clean for titles/body;
   * use BANNER_LOOK=0,-5,-15 (Home page framing) for a busier cover slide.
   */
  ppt: {
    w: 1920,
    h: 1080,
    scales: '1,2',
    settleMs: 5000,
    look: '0,10,-15',
    streamlineOpacity: '0.3',
  },
  /**
   * A5 print leaflet background incl. 3 mm bleed (154 × 216 mm). 910 × 1276
   * CSS px at 2x = 1820 × 2552 px ≈ 300 dpi. Used by src/pages/leaflet.
   */
  leaflet: {
    w: 910,
    h: 1276,
    scales: '2',
    settleMs: 5000,
    look: '0,8,-15',
    streamlineOpacity: '0.4',
  },
}

const presetIdx = process.argv.indexOf('--preset')
const presetName = presetIdx !== -1 ? process.argv[presetIdx + 1] : 'linkedin'
const preset = PRESETS[presetName]
if (!preset) {
  process.stderr.write(`[banner] unknown preset "${presetName}". Known: ${Object.keys(PRESETS).join(', ')}\n`)
  process.exit(1)
}

const BANNER_W = Number(process.env.BANNER_W || preset.w)
const BANNER_H = Number(process.env.BANNER_H || preset.h)

/**
 * Camera framing, forwarded to /banner as `cam` and `look` ("x,y,z").
 * Component defaults: cam 0,10,35 / look 0,-5,-15. Raising look.y tilts
 * the view up so the horizon drops and the streamlines come into frame.
 */
const CAM = process.env.BANNER_CAM || preset.cam || ''
const LOOK = process.env.BANNER_LOOK || preset.look || ''
/** Streamline opacity override (site default 0.15), forwarded as `so`. */
const STREAMLINE_OPACITY = process.env.BANNER_STREAMLINE_OPACITY || preset.streamlineOpacity || ''

/**
 * Stage the scene is rendered into. Wider/taller than the banner so the
 * perspective matches the Home page and we can choose which band to keep.
 */
const STAGE_W = Number(process.env.BANNER_STAGE_W || preset.stageW || BANNER_W)
const STAGE_H = Number(process.env.BANNER_STAGE_H || preset.stageH || BANNER_H)

const parseList = (value, fallback) =>
  (value || fallback)
    .split(',')
    .map((n) => Number(n.trim()))
    .filter((n) => Number.isFinite(n))

/**
 * Offsets (CSS px from the stage origin) to clip at. Every X × Y
 * combination is written. When the stage is the same size as the banner
 * there is nothing to choose, so both default to a single 0.
 */
const stageMatchesBanner = STAGE_W === BANNER_W && STAGE_H === BANNER_H
const BAND_OFFSETS = parseList(process.env.BANNER_BANDS, stageMatchesBanner ? '0' : '60,120,180,240')
const COLUMN_OFFSETS = parseList(process.env.BANNER_COLUMNS, '0')

/** Milliseconds to let the wave + streamline animation settle. */
const SETTLE_MS = Number(process.env.BANNER_SETTLE_MS || preset.settleMs || 4000)

/** Device scale factors to write, e.g. 1 = exact CSS px, 2 = doubled. */
const SCALES = parseList(process.env.BANNER_SCALES, preset.scales)

/** Defaults to the sibling `Banners` folder next to the website repo. */
const OUT_DIR = path.resolve(PROJECT_ROOT, process.env.BANNER_OUT_DIR || '../Banners')

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

      const query = new URLSearchParams({ w: String(STAGE_W), h: String(STAGE_H) })
      if (CAM) query.set('cam', CAM)
      if (LOOK) query.set('look', LOOK)
      if (STREAMLINE_OPACITY) query.set('so', STREAMLINE_OPACITY)
      const url = `${ORIGIN}/banner?${query}`
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

      // Full stage, for choosing a clip offset by eye. Skipped when the
      // stage *is* the banner, since the single clip below is identical.
      if (!stageMatchesBanner) {
        const refPath = path.join(OUT_DIR, `stage-${STAGE_W}x${STAGE_H}@${scale}x-${stamp}.png`)
        await page.screenshot({ path: refPath })
        log(`  -> ${path.basename(refPath)} (full stage reference)`)
      }

      for (const y of BAND_OFFSETS) {
        if (y + BANNER_H > STAGE_H) {
          err(`  ! band offset ${y} + ${BANNER_H} exceeds stage height ${STAGE_H}; skipping`)
          continue
        }
        for (const x of COLUMN_OFFSETS) {
          if (x + BANNER_W > STAGE_W) {
            err(`  ! column offset ${x} + ${BANNER_W} exceeds stage width ${STAGE_W}; skipping`)
            continue
          }
          const suffix = stageMatchesBanner ? '' : `-x${x}-y${y}`
          const outPath = path.join(
            OUT_DIR,
            `hyve-banner-${BANNER_W}x${BANNER_H}${suffix}@${scale}x-${stamp}.png`,
          )
          await page.screenshot({
            path: outPath,
            clip: { x, y, width: BANNER_W, height: BANNER_H },
          })
          log(`  -> ${path.basename(outPath)}`)
        }
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
