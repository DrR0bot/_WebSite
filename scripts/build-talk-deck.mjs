/**
 * Talk deck builder — "A Nervous System for Machines".
 *
 * Generates an editable 16:9 PowerPoint (.pptx) in the brand style used by
 * the LinkedIn post composer (/posts): Poppins, Hyve colour tokens, the
 * mesh backgrounds captured by `npm run banner:ppt`, and the "Say:" cues
 * in each slide's speaker-notes pane. Square dashed boxes mark where
 * images / graphics should be dropped in; bracketed text like `[X]` is
 * highlighted so nothing placeholder-ish ships by accident.
 *
 * Real-world cases quoted on the slides are listed in SOURCES (rendered as
 * the final slide) and referenced by key in each slide's `src` line.
 *
 * Usage:
 *   npm run deck:talk                       # writes ../Presentations/*.pptx
 *   TALK_OUT_DIR=./out npm run deck:talk    # write somewhere else
 *
 * Prerequisites:
 *   - ../Banners/hyve-ppt-{content,cover}-1920x1080@1x.png
 *     (from `npm run banner:ppt`; falls back to flat colours if missing)
 *   - Poppins installed on the machine that opens the deck, or embed fonts
 *     in PowerPoint (File → Options → Save → Embed fonts).
 *
 * Content lives in the SLIDES array at the bottom; layout helpers above.
 * Slide size is LAYOUT_WIDE: 13.333 × 7.5 in. All coordinates are inches.
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

import PptxGenJS from 'pptxgenjs'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
const BANNERS_DIR = path.resolve(PROJECT_ROOT, '../Banners')
const OUT_DIR = path.resolve(PROJECT_ROOT, process.env.TALK_OUT_DIR || '../Presentations')
const OUT_FILE = path.join(OUT_DIR, 'hyve-talk-nervous-system-for-machines.pptx')

const log = (m) => process.stdout.write(`[deck] ${m}\n`)

// ---------------------------------------------------------------------------
// Brand tokens (mirrors tailwind.config.js `hyve` palette; pptxgenjs wants
// hex without the leading '#').
// ---------------------------------------------------------------------------
const C = {
  header: '2A303C',
  text: '3D4657',
  textLight: '4D576A',
  accent: '7FB3BE',
  accentLight: '94C7CE',
  interactiveDark: '028396',
  bg: 'F4F2F3',
  content: 'CDE2E7',
  white: 'FFFFFF',
  mutedDark: 'B8C2CC',
  bodyDark: 'DCE3E8',
}
const FONT = 'Poppins'

// Slide geometry
const W = 13.333
const H = 7.5
const M = 0.7 // outer margin
const CW = W - 2 * M // content width
const RIGHT_COL = W - M - 3.3 // x of the standard right-hand placeholder

// ---------------------------------------------------------------------------
// Sources. Keys are referenced from slides via `src`. Rendered on the last
// slide so every number on screen can be traced.
// ---------------------------------------------------------------------------
const SOURCES = {
  aloha: {
    label: 'NTSB AAR-89/03, Aloha Airlines Flight 243 (1989); FAA Lessons Learned, N73711',
    url: 'https://www.faa.gov/lessons_learned/transport_airplane/accidents/N73711',
  },
  a380: {
    label: 'Reuters, "Airbus A380 wing flaw undetected for a decade" (May 2012); BBC News (Feb 2012)',
    url: 'https://www.reuters.com/article/business/airbus-a380-wing-flaw-undetected-for-a-decade-idUSL5E8GOFKO/',
  },
  morandi: {
    label: 'Corriere della Sera (Sept 2018, Feb 2020); Politecnico di Milano, "Dynamics and causes of the collapse of the Morandi viaduct"',
    url: 'https://www.corriere.it/english/18_settembre_05/red-tape-blocked-work-on-genoa-bridge-despite-safety-concerns-285b75dc-b12f-11e8-998a-dc1d12ab0ca0.shtml',
  },
  max: {
    label: 'FAA, "Summary of the FAA\'s Review of the Boeing 737 MAX" (2020); US House T&I Committee final report (Sept 2020)',
    url: 'https://www.faa.gov/sites/faa.gov/files/2022-08/737_RTS_Summary.pdf',
  },
  mercedes: {
    label: 'Motorsport.com, "How one wrong simulation answer triggered key mistake with Mercedes\' W13 design" (Dec 2022)',
    url: 'https://www.motorsport.com/f1/news/how-one-wrong-simulation-answer-triggered-key-mistake-with-mercedes-w13-design/10419858/',
  },
  mclaren: {
    label: 'Motorsport.com, "Stella: McLaren DNA problems stem from outdated F1 methodologies" (2023)',
    url: 'https://au.motorsport.com/f1/news/stella-mclaren-dna-problems-stem-from-outdated-f1-methodologies/10468762/',
  },
  nasaPsp: {
    label: 'NASA Spinoff 2012, "Pressure-Sensitive Paints Advance Rotorcraft Design Testing"; NASA Ames, "Power of Pink"; NASA, "Pressure Sensitive Paint Research Capability" (2025)',
    url: 'https://spinoff.nasa.gov/Spinoff2012/t_3.html',
  },
  vineyard: {
    label: 'Reuters, "Faulty manufacturing blamed for Vineyard Wind offshore blade failure" (July 2024); Vineyard Wind 1 COP Addendum (BOEM/BSEE)',
    url: 'https://www.reuters.com/business/energy/ge-vernova-says-manufacturing-issue-led-vineyard-turbine-blade-failure-2024-07-24/',
  },
  siemens: {
    label: 'Siemens Energy Q3 FY23 press release (Aug 2023); Reuters, "Siemens Energy books $2.4 billion in charges on wind turbines"',
    url: 'https://www.reuters.com/business/energy/siemens-energy-books-24-bln-charges-wind-turbine-issues-2023-08-07/',
  },
}

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------
const ASSETS = {
  bgContent: path.join(BANNERS_DIR, 'hyve-ppt-content-1920x1080@1x.png'),
  bgCover: path.join(BANNERS_DIR, 'hyve-ppt-cover-1920x1080@1x.png'),
  logoDarkSvg: path.join(PROJECT_ROOT, 'public/HD-Logo-dk2.svg'),
  logoWhiteSvg: path.join(PROJECT_ROOT, 'public/logo_white.svg'),
  product: path.join(PROJECT_ROOT, 'public/MatrixMesh-r5.png'),
  ati: path.join(PROJECT_ROOT, 'public/ATI_logo.png'),
}

/** PowerPoint handles PNG far more predictably than SVG; rasterise logos. */
async function rasteriseLogos() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hyve-deck-'))
  const out = {}
  for (const [key, src] of [
    ['logoDark', ASSETS.logoDarkSvg],
    ['logoWhite', ASSETS.logoWhiteSvg],
  ]) {
    const dest = path.join(tmp, `${key}.png`)
    await sharp(src, { density: 300 }).resize({ width: 1600 }).png().toFile(dest)
    const meta = await sharp(dest).metadata()
    out[key] = { path: dest, aspect: meta.width / meta.height }
  }
  return out
}

// ---------------------------------------------------------------------------
// Text helpers
// ---------------------------------------------------------------------------

/**
 * Splits a string on `[placeholder]` tokens and returns pptxgenjs text runs
 * with the bracketed parts highlighted so they are obvious to fill in.
 */
function runs(text, base = {}, highlightColor = C.accentLight) {
  const parts = text.split(/(\[[^\]]+\])/g).filter(Boolean)
  return parts.map((p) =>
    /^\[[^\]]+\]$/.test(p)
      ? { text: p, options: { ...base, bold: true, highlight: highlightColor } }
      : { text: p, options: { ...base } },
  )
}

/** Multiple paragraphs → runs with breakLine between them. */
function paragraphs(lines, base = {}, highlightColor) {
  const all = []
  lines.forEach((line, i) => {
    const lineBase = typeof line === 'string' ? base : { ...base, ...line.options }
    const text = typeof line === 'string' ? line : line.text
    const r = runs(text, lineBase, highlightColor)
    if (i < lines.length - 1) r[r.length - 1].options.breakLine = true
    all.push(...r)
  })
  return all
}

// ---------------------------------------------------------------------------
// Slide chrome
// ---------------------------------------------------------------------------

/**
 * Creates a slide with background, logo, optional top-right tag, footer
 * URL, slide number, source line and speaker notes.
 *
 * variant: 'light' (mesh content bg, dark type) | 'cover' (mesh cover bg,
 * dark type) | 'dark' (solid header colour, light type).
 */
function makeSlide(pptx, logos, { variant = 'light', tag, notes, src, number, total }) {
  const slide = pptx.addSlide()
  const dark = variant === 'dark'

  if (dark) {
    slide.background = { color: C.header }
    // Soft accent highlight top-right, echoing the social posts' radial overlay.
    slide.addShape('ellipse', {
      x: W - 6.5,
      y: -3.5,
      w: 9,
      h: 7,
      fill: { color: C.accent, transparency: 88 },
      line: { color: C.accent, transparency: 100 },
    })
  } else {
    const bg = variant === 'cover' ? ASSETS.bgCover : ASSETS.bgContent
    if (fs.existsSync(bg)) slide.background = { path: bg }
    else slide.background = { color: C.bg }
  }

  const fg = dark ? C.white : C.header
  const muted = dark ? C.mutedDark : C.textLight

  // Logo top-left
  const logo = dark ? logos.logoWhite : logos.logoDark
  const logoH = dark ? 0.5 : 0.42
  slide.addImage({ path: logo.path, x: M, y: 0.42, h: logoH, w: logoH * logo.aspect })

  // Tag top-right
  if (tag) {
    slide.addText(tag.toUpperCase(), {
      x: W - M - 6,
      y: 0.42,
      w: 6,
      h: logoH,
      align: 'right',
      valign: 'middle',
      fontFace: FONT,
      fontSize: 10,
      bold: true,
      charSpacing: 4,
      color: muted,
      margin: 0,
    })
  }

  // Source line (above the footer)
  if (src && src.length) {
    const labels = src.map((k) => SOURCES[k]?.short || shortSource(k)).join('  ·  ')
    slide.addText(`Sources: ${labels}`, {
      x: M,
      y: H - 0.98,
      w: CW,
      h: 0.3,
      fontFace: FONT,
      fontSize: 9,
      italic: true,
      color: muted,
      margin: 0,
      valign: 'middle',
    })
  }

  // Footer
  slide.addText('hyvedynamics.com', {
    x: M,
    y: H - 0.62,
    w: 4,
    h: 0.3,
    fontFace: FONT,
    fontSize: 10,
    color: muted,
    margin: 0,
    valign: 'middle',
  })
  slide.addText(`${String(number).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, {
    x: W - M - 2,
    y: H - 0.62,
    w: 2,
    h: 0.3,
    align: 'right',
    fontFace: FONT,
    fontSize: 10,
    color: muted,
    margin: 0,
    valign: 'middle',
  })

  if (notes) slide.addNotes(notes)

  return { slide, fg, muted, dark }
}

/** Short attribution used in the per-slide source line. */
function shortSource(key) {
  return {
    aloha: 'NTSB AAR-89/03',
    a380: 'Reuters / BBC, 2012',
    morandi: 'Corriere della Sera; Politecnico di Milano',
    max: 'FAA 737 MAX review, 2020',
    mercedes: 'Motorsport.com, 2022',
    mclaren: 'Motorsport.com, 2023',
    nasaPsp: 'NASA Spinoff 2012; NASA Ames',
    vineyard: 'Reuters, 2024; GE Vernova RCA',
    siemens: 'Siemens Energy; Reuters, 2023',
  }[key] || key
}

/** Accent bar under the logo / above a title. */
function accentBar(slide, x, y, w = 0.7) {
  slide.addShape('rect', { x, y, w, h: 0.04, fill: { color: C.accent }, line: { color: C.accent } })
}

/** Slide title. Returns the y just below it. */
function title(slide, text, { x = M, y = 1.35, w = CW, size = 34, color = C.header, lines = 1 } = {}) {
  const h = (size / 72) * 1.25 * lines + 0.1
  slide.addText(runs(text, { fontFace: FONT, fontSize: size, color, bold: false }), {
    x,
    y,
    w,
    h,
    valign: 'top',
    margin: 0,
    lineSpacingMultiple: 1.05,
  })
  return y + h
}

/** Body paragraphs. */
function body(slide, lines, { x = M, y, w = CW, h, size = 17, color = C.text, spacing = 1.2, after = 8 } = {}) {
  slide.addText(paragraphs(lines, { fontFace: FONT, fontSize: size, color }), {
    x,
    y,
    w,
    h,
    valign: 'top',
    margin: 0,
    lineSpacingMultiple: spacing,
    paraSpaceAfter: after,
  })
}

/** Big punchline text, optionally with the tail in accent colour. */
function punch(slide, text, { x = M, y, w = CW, h = 0.9, size = 30, dark = false, accentTail } = {}) {
  const base = { fontFace: FONT, fontSize: size, color: dark ? C.white : C.header }
  const parts = accentTail
    ? [
        { text, options: { ...base, breakLine: true } },
        { text: accentTail, options: { ...base, color: dark ? C.accent : C.interactiveDark, bold: true } },
      ]
    : [{ text, options: base }]
  slide.addText(parts, { x, y, w, h, margin: 0, valign: 'middle', lineSpacingMultiple: 1.1 })
}

/** Square dashed placeholder for an image / graphic. */
function placeholder(slide, { x, y, size = 3.2, label = 'Image / graphic', dark = false }) {
  const stroke = dark ? C.accent : C.interactiveDark
  slide.addShape('roundRect', {
    x,
    y,
    w: size,
    h: size,
    rectRadius: 0.12,
    fill: { color: dark ? C.white : C.header, transparency: dark ? 92 : 96 },
    line: { color: stroke, width: 1.25, dashType: 'dash' },
  })
  slide.addText(label.toUpperCase(), {
    x,
    y: y + size / 2 - 0.25,
    w: size,
    h: 0.5,
    align: 'center',
    valign: 'middle',
    fontFace: FONT,
    fontSize: 9,
    bold: true,
    charSpacing: 3,
    color: stroke,
    margin: 0,
  })
}

/** Card with optional title + body, like the social-post application cards. */
function card(slide, { x, y, w, h, heading, text, dark = false, headingSize = 15, textSize = 13, accentHeading = false }) {
  slide.addShape('roundRect', {
    x,
    y,
    w,
    h,
    rectRadius: 0.1,
    fill: { color: C.white, transparency: dark ? 93 : 35 },
    line: { color: dark ? C.white : C.content, transparency: dark ? 80 : 0, width: 0.75 },
  })
  const pad = 0.28
  const fg = dark ? C.white : C.header
  const parts = []
  if (heading) {
    parts.push(
      ...runs(heading, {
        fontFace: FONT,
        fontSize: headingSize,
        bold: true,
        color: accentHeading ? (dark ? C.accent : C.interactiveDark) : fg,
      }),
    )
    if (text) parts[parts.length - 1].options.breakLine = true
  }
  if (text) {
    parts.push(...runs(text, { fontFace: FONT, fontSize: textSize, color: dark ? C.bodyDark : C.text }))
  }
  slide.addText(parts, {
    x: x + pad,
    y: y + pad * 0.6,
    w: w - 2 * pad,
    h: h - pad * 1.2,
    valign: 'middle',
    margin: 0,
    lineSpacingMultiple: 1.15,
    paraSpaceAfter: 4,
  })
}

/** Row of pill chips, e.g. "Pressure · Suction · Temperature · Strain". */
function chips(slide, items, { x, y, dark = false, size = 13 }) {
  let cx = x
  for (const it of items) {
    const w = it.length * 0.105 + 0.55
    slide.addShape('roundRect', {
      x: cx,
      y,
      w,
      h: 0.42,
      rectRadius: 0.21,
      fill: { color: dark ? C.accent : C.interactiveDark, transparency: dark ? 75 : 88 },
      line: { color: dark ? C.accent : C.interactiveDark, width: 0.75 },
    })
    slide.addText(it, {
      x: cx,
      y,
      w,
      h: 0.42,
      align: 'center',
      valign: 'middle',
      fontFace: FONT,
      fontSize: size,
      bold: true,
      color: dark ? C.white : C.interactiveDark,
      margin: 0,
    })
    cx += w + 0.18
  }
}

/** Horizontal flow of boxes joined by arrows. */
function flow(slide, steps, { x = M, y, w = CW, h = 0.9, dark = false, size = 13, gap = 0.5 }) {
  const n = steps.length
  const boxW = (w - gap * (n - 1)) / n
  steps.forEach((s, i) => {
    const bx = x + i * (boxW + gap)
    slide.addShape('roundRect', {
      x: bx,
      y,
      w: boxW,
      h,
      rectRadius: 0.1,
      fill: { color: C.white, transparency: dark ? 90 : 25 },
      line: { color: dark ? C.accent : C.interactiveDark, width: 1 },
    })
    slide.addText(s, {
      x: bx,
      y,
      w: boxW,
      h,
      align: 'center',
      valign: 'middle',
      fontFace: FONT,
      fontSize: size,
      bold: true,
      color: dark ? C.white : C.header,
      margin: 0.05,
    })
    if (i < n - 1) {
      slide.addText('→', {
        x: bx + boxW,
        y,
        w: gap,
        h,
        align: 'center',
        valign: 'middle',
        fontFace: FONT,
        fontSize: size + 6,
        color: dark ? C.accent : C.interactiveDark,
        margin: 0,
      })
    }
  })
}

/** Bulleted list rendered as a plain text box with real PowerPoint bullets. */
function bullets(slide, items, { x = M, y, w = CW, h, size = 16, color = C.text, spacing = 1.15 }) {
  const items2 = items.map((t, i) => {
    const r = runs(t, { fontFace: FONT, fontSize: size, color })
    r[0].options.bullet = { indent: 18 }
    if (i < items.length - 1) r[r.length - 1].options.breakLine = true
    return r
  })
  slide.addText(items2.flat(), {
    x,
    y,
    w,
    h,
    valign: 'top',
    margin: 0,
    lineSpacingMultiple: spacing,
    paraSpaceAfter: 6,
  })
}

/**
 * "Case" card: a real-world incident in one line, with a bold lead
 * (what / when) and a plain consequence. Used on the evidence slides.
 */
function caseCard(slide, { x, y, w, h, lead, text, dark = false }) {
  card(slide, { x, y, w, h, heading: lead, text, dark, headingSize: 15, textSize: 13, accentHeading: true })
}

// ---------------------------------------------------------------------------
// Slides
// ---------------------------------------------------------------------------

const SLIDES = [
  // 1 — Title
  {
    variant: 'cover',
    notes: 'Title slide. Hold while people settle.',
    build: (pptx, s) => {
      accentBar(s.slide, M, 2.2)
      title(s.slide, 'A Nervous System\nfor Machines', { y: 2.4, size: 48, w: 8.4, lines: 2 })
      body(
        s.slide,
        ['Embedding adaptronic sensing skins into structures that feel'],
        { y: 4.3, w: 8.4, h: 0.8, size: 18, color: C.text },
      )
      body(
        s.slide,
        ['Dr Juan Sebastian Conde  ·  Co-Founder & Chief Scientist  ·  Hyve Dynamics'],
        { y: 5.35, w: 9, h: 0.5, size: 13, color: C.textLight },
      )
      if (fs.existsSync(ASSETS.product)) {
        s.slide.addImage({ path: ASSETS.product, x: W - M - 3.6, y: 2.7, w: 3.6, h: 3.6, sizing: { type: 'contain', w: 3.6, h: 3.6 } })
      } else {
        placeholder(s.slide, { x: W - M - 3.4, y: 2.8, size: 3.4, label: 'Product image' })
      }
    },
  },

  // 2 — The misconception
  {
    variant: 'dark',
    tag: 'The misconception',
    src: ['aloha', 'a380', 'morandi'],
    notes:
      'Show of hands: "Who agrees a wing is passive?" Then the three cases, one line each, no commentary. Let the numbers land. Close with the punchline.',
    build: (pptx, s) => {
      title(s.slide, 'A wing is a passive structure.', { y: 1.25, size: 38, color: C.white, w: 8.6 })
      body(
        s.slide,
        ['Designed, built, inspected on a schedule. Then operated blind.'],
        { y: 2.15, w: 8.4, h: 0.6, size: 17, color: C.accent },
      )
      const cases = [
        {
          lead: 'Aloha 243, 1988',
          text: 'Fatigue cracks along one rivet line were already 2–3 mm at the last inspection. 2,624 flights later, 18 ft of fuselage left the aircraft at 24,000 ft.',
        },
        {
          lead: 'Airbus A380, 2012',
          text: 'Cracks in wing-rib brackets, found by chance after a turbulence check. All 68 in-service aircraft inspected; repair bill heading toward €500m.',
        },
        {
          lead: 'Morandi bridge, Genoa, 2018',
          text: 'Monitoring sensors offline since 2015. Cable section loss of 10–20% was known. 43 dead.',
        },
      ]
      cases.forEach((c, i) => {
        caseCard(s.slide, { x: M, y: 2.9 + i * 1.08, w: 8.3, h: 0.96, ...c, dark: true })
      })
      punch(s.slide, 'The structure knew.', { x: RIGHT_COL, y: 2.9, w: 3.3, h: 1.6, size: 26, dark: true, accentTail: 'Nobody was listening.' })
      placeholder(s.slide, { x: RIGHT_COL, y: 4.65, size: 1.5, label: 'Image', dark: true })
    },
  },

  // 3 — How we know today
  {
    variant: 'light',
    tag: 'How we know today',
    src: ['mercedes', 'mclaren'],
    notes:
      'Respect simulation: every F1 team has world-class CFD and a wind tunnel. They still lost seasons to correlation. Position measurement as the partner that keeps the model honest.',
    build: (pptx, s) => {
      title(s.slide, 'We predict. We simulate. We estimate.', { y: 1.3, size: 30, w: 8.8 })
      caseCard(s.slide, {
        x: M, y: 2.2, w: 8.3, h: 1.0,
        lead: 'Mercedes W13, 2022',
        text: 'A championship-winning team traced a lost season to "one wrong simulation answer". The car never behaved like the model.',
      })
      caseCard(s.slide, {
        x: M, y: 3.3, w: 8.3, h: 1.0,
        lead: 'McLaren, 2021–23',
        text: 'Years of "DNA" handling problems blamed on a wind tunnel that could not reproduce what the car sees on track.',
      })
      body(
        s.slide,
        ['Models need validation. Validation needs measurement. Measurement is the bottleneck.'],
        { y: 4.5, w: 8.3, h: 0.7, size: 17 },
      )
      punch(s.slide, 'Now we measure.', { y: 5.2, w: 8, h: 0.9, size: 38 })
      placeholder(s.slide, { x: RIGHT_COL, y: 2.2, size: 3.3, label: 'Simulation vs track' })
    },
  },

  // 4 — It was never passive
  {
    variant: 'light',
    tag: 'How we measure today',
    src: ['nasaPsp'],
    notes:
      '"Who here has waited weeks for an instrumented model?" These are NASA\'s own numbers for wind-tunnel pressure instrumentation.',
    build: (pptx, s) => {
      title(s.slide, 'It was never passive.', { y: 1.3, size: 36, w: 8.6 })
      body(
        s.slide,
        [
          { text: 'We just don’t instrument it.', options: { color: C.interactiveDark, bold: true } },
          'Every structure experiences pressure, load, temperature and strain, all the time. Here is what it takes to measure some of it:',
        ],
        { y: 2.2, w: 8.3, h: 1.0, size: 16, after: 4 },
      )
      const items = [
        ['100–200 pressure taps', 'drilled and tubed by hand, per model'],
        ['5–10× the cost', 'if you need dynamic (unsteady) taps'],
        ['A second model', 'a dedicated “pressure model” doubles model cost'],
        ['Days to weeks', 'to decipher the data; weeks or months to get back in the tunnel'],
      ]
      items.forEach(([h, t], i) => {
        const col = i % 2
        const row = Math.floor(i / 2)
        card(s.slide, { x: M + col * 4.3, y: 3.25 + row * 1.2, w: 4.1, h: 1.05, heading: h, text: t, headingSize: 17, textSize: 12, accentHeading: true })
      })
      body(s.slide, ['Plus wiring, weight, modified geometry and compromised results.'], { y: 5.75, w: 8.3, h: 0.5, size: 15, color: C.textLight })
      placeholder(s.slide, { x: RIGHT_COL, y: 2.2, size: 3.3, label: 'Tapped model photo' })
    },
  },

  // 5 — Points, not surfaces
  {
    variant: 'light',
    tag: 'Points, not surfaces',
    src: ['max'],
    notes:
      'Say this carefully and without blame; it is a design-philosophy point. The system trusted a single point of measurement and had nothing to cross-check it against. This reframes the accuracy question before anyone asks it.',
    build: (pptx, s) => {
      title(s.slide, 'Points, not surfaces', { y: 1.3, size: 36, w: 8.6 })
      caseCard(s.slide, {
        x: M, y: 2.2, w: 8.3, h: 1.15,
        lead: 'Boeing 737 MAX, 2018–19',
        text: 'MCAS acted on one angle-of-attack sensor. Erroneous data from that single sensor drove the stabiliser nose-down. Two crashes. 346 people.',
      })
      body(
        s.slide,
        [
          'Discrete sensors tell you what happens here. Engineering decisions depend on what happens everywhere.',
          'A perfect sensor at one point still misses the surface. And when it fails, you have nothing to compare it with.',
        ],
        { y: 3.55, w: 8.3, h: 1.5, size: 16 },
      )
      punch(s.slide, 'The problem isn’t precision.', { y: 5.1, w: 8.4, h: 1.1, size: 28, accentTail: 'It’s coverage.' })
      placeholder(s.slide, { x: RIGHT_COL, y: 2.2, size: 3.3, label: 'Points vs field graphic' })
    },
  },

  // 6 — Give it a skin
  {
    variant: 'light',
    tag: 'The skin',
    notes: 'Pass a sample strip around the room while you talk.',
    build: (pptx, s) => {
      title(s.slide, 'Give it a skin', { y: 1.3, size: 36, w: 8.6 })
      body(
        s.slide,
        ['Ultra-thin, flexible, conformable sensing skin that bonds directly to the surface.'],
        { y: 2.3, w: 8.2, h: 1.0, size: 18 },
      )
      chips(s.slide, ['Pressure', 'Suction', 'Temperature', 'Strain'], { x: M, y: 3.4 })
      bullets(
        s.slide,
        [
          'No drilling. No tubing. No second model.',
          'Installed in hours, not weeks. No change to the geometry.',
          'A platform: further sensing modalities integrate onto the same skin.',
        ],
        { y: 4.2, w: 8.2, h: 1.8, size: 17 },
      )
      placeholder(s.slide, { x: RIGHT_COL, y: 1.9, size: 3.3, label: 'Skin sample photo' })
    },
  },

  // 7 — What only a skin can see (moat)
  {
    variant: 'dark',
    tag: 'Only a skin can see this',
    src: ['nasaPsp'],
    notes: 'This is your moat slide. Say it calmly and confidently. No hedging.',
    build: (pptx, s) => {
      title(s.slide, 'What only a skin can see', { y: 1.3, size: 38, color: C.white, w: 8.6 })
      const items = [
        ['Distributed shear stress, measured directly', 'No tap, paint or gauge does this on a real structure. No practical incumbent.'],
        ['Thousands of points, one surface', 'Spatial density that discrete sensors cannot reach.'],
        ['Loads integrated from the full field', 'Not extrapolated from a handful of taps.'],
        ['Live', 'Not days or weeks later when the data has been processed.'],
      ]
      items.forEach(([h, t], i) => {
        card(s.slide, {
          x: M, y: 2.45 + i * 1.0, w: 8.3, h: 0.88,
          heading: h, text: t, dark: true, accentHeading: true, headingSize: 16, textSize: 13,
        })
      })
      placeholder(s.slide, { x: RIGHT_COL, y: 2.45, size: 3.3, label: 'Shear / pressure field', dark: true })
    },
  },

  // 8 — From surface to data stream
  {
    variant: 'light',
    tag: 'Electronics',
    notes:
      'Share lessons paid for: excitation, IR-drop, chopping. Show rigour, not polish. Finish on points → fields.',
    build: (pptx, s) => {
      title(s.slide, 'From surface to data stream', { y: 1.3, size: 36, w: 8.6 })
      flow(s.slide, ['Sensing nodes', 'Front-end electronics', 'Controller', 'CAN FD', 'Live data'], { y: 2.35, h: 0.95, size: 13 })
      body(
        s.slide,
        [
          'Small signals across large surfaces. Every millivolt matters.',
          'Noise, offset and excitation are designed for, not tolerated. Lessons paid for: excitation, IR-drop, chopping.',
        ],
        { y: 3.75, w: 8.2, h: 1.6, size: 17 },
      )
      s.slide.addText(
        [
          { text: 'Hundreds of points ', options: { fontFace: FONT, fontSize: 26, color: C.header } },
          { text: '→ ', options: { fontFace: FONT, fontSize: 26, color: C.interactiveDark } },
          { text: 'one continuous field.', options: { fontFace: FONT, fontSize: 26, color: C.interactiveDark, bold: true } },
        ],
        { x: M, y: 5.35, w: 8.4, h: 0.8, margin: 0, valign: 'middle' },
      )
      placeholder(s.slide, { x: W - M - 2.8, y: 3.65, size: 2.8, label: 'Electronics photo' })
    },
  },

  // 9 — Live demo
  {
    variant: 'dark',
    tag: 'Live demo',
    notes: 'Invite someone up to press it and show the live field. Then: "Still passive?"',
    build: (pptx, s) => {
      s.slide.addText('LIVE DEMO', {
        x: M, y: 2.55, w: CW, h: 0.4, align: 'center',
        fontFace: FONT, fontSize: 12, bold: true, charSpacing: 6, color: C.accent, margin: 0,
      })
      s.slide.addText('Watch the wing feel.', {
        x: M, y: 3.0, w: CW, h: 1.4, align: 'center', valign: 'middle',
        fontFace: FONT, fontSize: 60, color: C.white, margin: 0,
      })
      accentBar(s.slide, W / 2 - 0.35, 4.55)
    },
  },

  // 10 — Faster testing
  {
    variant: 'light',
    tag: 'Aerospace · Motorsport · Wind energy',
    src: ['nasaPsp', 'mercedes'],
    notes: 'Replace the stat with one real number: setup time, or the number of taps a single skin replaced.',
    build: (pptx, s) => {
      title(s.slide, 'Faster testing', { y: 1.3, size: 36, w: 8.6 })
      card(s.slide, {
        x: M, y: 2.25, w: 4.05, h: 1.55,
        heading: 'Today', text: 'A dedicated pressure model. Weeks of preparation. Data deciphered days or weeks later. Another queue for tunnel time if you need more.',
        headingSize: 15, textSize: 12,
      })
      card(s.slide, {
        x: M + 4.25, y: 2.25, w: 4.05, h: 1.55,
        heading: 'With a skin', text: 'Instrumented in an afternoon. Full-field pressure and shear, live. Validate the model against the whole surface, not a sample of it.',
        headingSize: 15, textSize: 12, accentHeading: true,
      })
      body(
        s.slide,
        ['Wind tunnel, flight test, track test: the correlation problem that cost Mercedes a season is a coverage problem.'],
        { y: 4.0, w: 8.3, h: 0.7, size: 16 },
      )
      s.slide.addShape('roundRect', {
        x: M, y: 4.8, w: 8.3, h: 1.35, rectRadius: 0.1,
        fill: { color: C.interactiveDark, transparency: 90 }, line: { color: C.interactiveDark, width: 1 },
      })
      s.slide.addText(
        [
          { text: '[One real number]', options: { fontFace: FONT, fontSize: 34, bold: true, color: C.interactiveDark, highlight: C.accentLight, breakLine: true } },
          { text: 'e.g. setup time, or taps replaced by one skin', options: { fontFace: FONT, fontSize: 14, color: C.text } },
        ],
        { x: M + 0.3, y: 4.8, w: 7.8, h: 1.35, margin: 0, valign: 'middle', lineSpacingMultiple: 1.1 },
      )
      placeholder(s.slide, { x: RIGHT_COL, y: 2.25, size: 3.3, label: 'Wind tunnel / flight test' })
    },
  },

  // 11 — Structures that report their own health
  {
    variant: 'light',
    tag: 'Composites · Wind · Robotics · Vehicles',
    src: ['vineyard', 'siemens', 'aloha'],
    notes:
      'Two wind cases from the last two years, then back to Aloha: the cracks were measurable at the last inspection. Continuous strain sees the crack grow, not the failure.',
    build: (pptx, s) => {
      title(s.slide, 'Structures that report their own health', { y: 1.3, size: 32, w: 9.2 })
      caseCard(s.slide, {
        x: M, y: 2.2, w: 8.3, h: 0.95,
        lead: 'Vineyard Wind, 2024',
        text: 'A 107 m blade broke apart. Cause: insufficient bonding that QA “should have identified”. Debris on Nantucket beaches; blades pulled from 22 turbines.',
      })
      caseCard(s.slide, {
        x: M, y: 3.25, w: 8.3, h: 0.95,
        lead: 'Siemens Gamesa, 2023',
        text: 'Blade and bearing defects across its newest onshore platforms. €1.6bn set aside to fix them, years after installation.',
      })
      caseCard(s.slide, {
        x: M, y: 4.3, w: 8.3, h: 0.8,
        lead: 'Aloha 243, 1988',
        text: 'The cracks were measurable at the last inspection. Nobody measured in between.',
      })
      punch(s.slide, 'A skin sees the crack grow,', { y: 5.3, w: 8.3, h: 0.9, size: 24, accentTail: 'not the failure.' })
      placeholder(s.slide, { x: RIGHT_COL, y: 2.2, size: 3.3, label: 'SHM / robotics image' })
    },
  },

  // 12 — Proven foundations
  {
    variant: 'light',
    tag: 'Proven foundations',
    notes:
      'Partner logos only with permission. (Note: the website\'s structured data still says 5 granted UK patents and some pages say "since 2017" — worth aligning.)',
    build: (pptx, s) => {
      title(s.slide, 'Proven foundations', { y: 1.3, size: 36, w: 8.6 })
      const facts = [
        ['4 granted patents', '2 further applications filed'],
        ['Deep-tech R&D', 'since 2019'],
      ]
      facts.forEach(([h, t], i) => {
        card(s.slide, { x: M + i * 4.3, y: 2.35, w: 4.1, h: 1.2, heading: h, text: t, headingSize: 20, textSize: 14, accentHeading: true })
      })
      s.slide.addText('VALIDATED WITH', {
        x: M, y: 3.85, w: 4, h: 0.3, fontFace: FONT, fontSize: 10, bold: true, charSpacing: 4, color: C.textLight, margin: 0,
      })
      for (let i = 0; i < 3; i++) {
        placeholder(s.slide, { x: M + i * 1.75, y: 4.2, size: 1.5, label: `Partner ${i + 1}` })
      }
      s.slide.addText('BACKED BY', {
        x: M + 6.2, y: 3.85, w: 4, h: 0.3, fontFace: FONT, fontSize: 10, bold: true, charSpacing: 4, color: C.textLight, margin: 0,
      })
      placeholder(s.slide, { x: M + 6.2, y: 4.2, size: 1.5, label: 'ARIA' })
      placeholder(s.slide, { x: M + 6.2 + 1.75, y: 4.2, size: 1.5, label: 'Innovate UK' })
      if (fs.existsSync(ASSETS.ati)) {
        s.slide.addShape('roundRect', {
          x: M + 6.2 + 3.5, y: 4.2, w: 1.5, h: 1.5, rectRadius: 0.12,
          fill: { color: C.white, transparency: 20 }, line: { color: C.content, width: 0.75 },
        })
        s.slide.addImage({ path: ASSETS.ati, x: M + 6.2 + 3.5 + 0.15, y: 4.35, w: 1.2, h: 1.2, sizing: { type: 'contain', w: 1.2, h: 1.2 } })
      } else {
        placeholder(s.slide, { x: M + 6.2 + 3.5, y: 4.2, size: 1.5, label: 'ATI' })
      }
      s.slide.addText('Partner logos: with permission only.', {
        x: M, y: 5.95, w: 6, h: 0.3, fontFace: FONT, fontSize: 10, italic: true, color: C.textLight, margin: 0,
      })
    },
  },

  // 13 — From sensing to responding
  {
    variant: 'dark',
    tag: 'From sensing to responding',
    src: ['morandi'],
    notes:
      'Morandi had sensors. They were offline for three years and nobody acted on what the earlier data showed. Sensing is step one; the point is a structure that understands and responds. Ask again: "Who still thinks this wing is passive?"',
    build: (pptx, s) => {
      title(s.slide, 'From sensing to responding', { y: 1.3, size: 38, color: C.white, w: 10 })
      flow(s.slide, ['Sense', 'Understand', 'Respond'], { y: 2.45, h: 1.1, size: 22, dark: true, gap: 0.7 })
      body(
        s.slide,
        [
          'Morandi had sensors. They were offline for three years. Data nobody acts on is not a nervous system.',
          'Surfaces that adjust to the flow. Structures that redistribute load. Machines that don’t just sense their environment, but respond and adapt to it.',
        ],
        { y: 3.9, w: CW, h: 1.6, size: 17, color: C.bodyDark },
      )
      s.slide.addText(
        runs('We started with a passive wing. You’ve just watched it feel.', { fontFace: FONT, fontSize: 24, italic: true, color: C.accent }),
        { x: M, y: 5.5, w: CW, h: 0.8, margin: 0, valign: 'middle' },
      )
    },
  },

  // 14 — Let's build it together
  {
    variant: 'cover',
    tag: 'Questions',
    notes: 'Name the three asks, then open the floor.',
    build: (pptx, s) => {
      title(s.slide, 'Let’s build it together', { y: 1.3, size: 40, w: 8.6 })
      const asks = ['Test & validation partners', 'Integration & manufacturing partners', 'Investors in deep tech']
      asks.forEach((a, i) => {
        card(s.slide, { x: M, y: 2.4 + i * 0.95, w: 6.4, h: 0.8, heading: a, headingSize: 17 })
      })
      s.slide.addText(
        paragraphs(
          [
            { text: '[email]', options: { fontSize: 16, color: C.text } },
            { text: 'hyvedynamics.com', options: { fontSize: 20, bold: true, color: C.header } },
          ],
          { fontFace: FONT },
        ),
        { x: M, y: 5.35, w: 6.4, h: 0.9, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 },
      )
      placeholder(s.slide, { x: W - M - 2.6, y: 2.4, size: 2.6, label: 'QR code' })
      s.slide.addText('Questions', {
        x: W - M - 4.6, y: 5.15, w: 4.6, h: 0.9, align: 'right', valign: 'middle',
        fontFace: FONT, fontSize: 40, color: C.interactiveDark, margin: 0,
      })
    },
  },

  // 15 — Sources
  {
    variant: 'light',
    tag: 'Sources',
    notes: 'Reference slide. Leave up during Q&A if anyone asks about a number.',
    build: (pptx, s) => {
      title(s.slide, 'Sources', { y: 1.2, size: 30, w: 8 })
      const entries = Object.values(SOURCES)
      const lines = []
      entries.forEach((e, i) => {
        lines.push({ text: e.label, options: { fontSize: 11, color: C.header, bold: true } })
        lines.push({ text: e.url, options: { fontSize: 9.5, color: C.interactiveDark, hyperlink: { url: e.url } } })
        if (i < entries.length - 1) lines.push({ text: ' ', options: { fontSize: 4 } })
      })
      s.slide.addText(paragraphs(lines, { fontFace: FONT }), {
        x: M, y: 1.95, w: CW, h: 4.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.05, paraSpaceAfter: 2,
      })
    },
  },
]

// ---------------------------------------------------------------------------
async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  for (const key of ['bgContent', 'bgCover']) {
    if (!fs.existsSync(ASSETS[key])) log(`warning: ${path.basename(ASSETS[key])} missing — run \`npm run banner:ppt\`; using flat colour`)
  }

  const logos = await rasteriseLogos()

  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'Hyve Dynamics'
  pptx.company = 'Hyve Dynamics'
  pptx.title = 'A Nervous System for Machines'
  pptx.subject = 'Embedding adaptronic sensing skins into structures that feel'

  SLIDES.forEach((def, i) => {
    const s = makeSlide(pptx, logos, { ...def, number: i + 1, total: SLIDES.length })
    def.build(pptx, s)
  })

  await pptx.writeFile({ fileName: OUT_FILE })
  log(`wrote ${OUT_FILE} (${SLIDES.length} slides)`)
}

main().catch((e) => {
  process.stderr.write(`[deck] fatal: ${e.stack || e.message}\n`)
  process.exit(1)
})
