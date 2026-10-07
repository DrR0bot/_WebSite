/**
 * Event leaflet — Engineering Design Show 2026 (dev-only).
 *
 * A5 double-sided handout for the stand, in the same visual language as
 * the LinkedIn post templates (/posts): Poppins, Hyve colour tokens, mesh
 * background on the light side, gunmetal + radial accent on the dark side.
 *
 * Layout is in millimetres (see Leaflet.css) so `npm run leaflet` can
 * print it to a true-size PDF with 3 mm bleed via Chrome's print engine.
 * Text stays vector in the PDF; only the background and product render
 * are raster.
 *
 * QR codes: by default the branded dotted code supplied by marketing
 * (assets/qr-hyve.jpg) is used on both sides. Set USE_BRAND_QR to false to
 * fall back to codes generated at render time from LINKS.* with `qrcode`,
 * which carry UTM tags so leaflet visits are distinguishable in analytics.
 *
 * Bracketed text like `[Stand X]` is highlighted as a placeholder; real
 * values render plainly.
 *
 * Dev-only, same pattern as /deck, /posts and /banner: registered behind
 * `import.meta.env.DEV` in src/App.tsx and dead-code-eliminated in prod.
 */

import QRCode from 'qrcode'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { NoIndex } from '@/components/common/NoIndex'
import { Logo } from '@/pages/social/components/Logo'

import meshA5 from './assets/mesh-a5.png'
import qrBrand from './assets/qr-hyve.jpg'
import './Leaflet.css'

/** Use the supplied branded QR (true) or generate from LINKS.* (false). */
const USE_BRAND_QR = true

// ---------------------------------------------------------------------------
// Content — edit here.
// ---------------------------------------------------------------------------

const EVENT = {
  name: 'Engineering Design Show',
  dates: '7–8 October 2026',
  venue: 'Coventry Building Society Arena',
  stand: 'Stand G5',
}

const TALK = {
  title: 'A Nervous System for Machines',
  subtitle: 'Embedding adaptronic sensing skins into structures that feel',
  when: 'Wednesday 7 October · 12:15–12:45',
  where: 'New Electronics stage',
  speaker: 'Dr Juan Sebastian Conde',
  role: 'Co-Founder & Chief Scientist',
}

const LINKS = {
  explore: 'https://hyvedynamics.com/?utm_source=eds2026&utm_medium=leaflet&utm_campaign=front',
  technology:
    'https://hyvedynamics.com/haptic-matrix?utm_source=eds2026&utm_medium=leaflet&utm_campaign=back',
  email: 'info@hyvedynamics.com',
  site: 'hyvedynamics.com',
}

const PROOF = [
  { k: '4', v: 'granted patents · 2 filed' },
  { k: 'Tier 1', v: 'aerospace wind-tunnel validated' },
  { k: 'Since 2019', v: 'deep-tech R&D' },
]

const AT_THE_STAND = [
  'Live demo: press the wing and watch the field respond',
  'Sample skins to handle',
  'The engineers who built it',
]

const BACKERS = 'Backed by ARIA · Innovate UK · ATI'

const INDUSTRIES = ['Aerospace', 'Motorsport', 'Wind energy', 'Robotics', 'Defence', 'Automotive']

// ---------------------------------------------------------------------------

/** Inline SVG QR code. Transparent background so it sits on any surface. */
const Qr = ({ url, dark, className = '' }: { url: string; dark?: boolean; className?: string }) => {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    let cancelled = false
    QRCode.toString(url, {
      type: 'svg',
      margin: 0,
      errorCorrectionLevel: 'M',
      color: { dark: dark ? '#F4F2F3' : '#2A303C', light: '#00000000' },
    })
      .then(s => {
        if (!cancelled) setSvg(s)
      })
      .catch(() => {
        if (!cancelled) setSvg('')
      })
    return () => {
      cancelled = true
    }
  }, [url, dark])
  return (
    <div
      className={`leaflet-qr ${className}`}
      role="img"
      aria-label={`QR code: ${url}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

/** QR tile: branded image, or a generated code for `url` as fallback. */
const QrTile = ({ url, className = '' }: { url: string; className?: string }) =>
  USE_BRAND_QR ? (
    <img src={qrBrand} alt={`QR code: ${LINKS.site}`} className={`block ${className}`} />
  ) : (
    <Qr url={url} className={className} />
  )

/**
 * Highlights [bracketed] placeholders so they are impossible to miss.
 * Real values (no brackets) render as plain semibold text.
 */
const Ph = ({ children }: { children: string }) =>
  /^\[.*\]$/.test(children) ? (
    <span className="bg-hyve-accent-light/70 text-hyve-header font-semibold px-[0.6mm] rounded-[0.5mm]">
      {children}
    </span>
  ) : (
    <span className="font-semibold">{children}</span>
  )

const Guides = () => (
  <>
    <div className="leaflet-guide leaflet-guide--trim" />
    <div className="leaflet-guide leaflet-guide--safe" />
  </>
)

// ---------------------------------------------------------------------------
// FRONT — light, mesh background. Hook, product, talk, QR.
// ---------------------------------------------------------------------------
const Front = ({ guides }: { guides: boolean }) => (
  <section className="leaflet-page" data-page="front">
    <div
      className="leaflet-page__bg"
      aria-hidden="true"
      style={{ backgroundImage: `url(${meshA5})` }}
    />
    {/* Lift the top for legibility; let the grid show through at the bottom. */}
    <div
      className="leaflet-page__overlay"
      style={{
        background:
          'linear-gradient(180deg, rgba(244,242,243,0.55) 0%, rgba(244,242,243,0.25) 45%, rgba(244,242,243,0) 70%)',
      }}
    />
    {guides && <Guides />}

    <div className="leaflet-page__content text-hyve-header">
      {/* Header */}
      <div className="flex items-start justify-between">
        <Logo src="/HD-Logo-dk2.svg" alt="Hyve Dynamics" className="h-[9mm] w-auto" />
        <div className="text-right leading-tight">
          <p className="text-[7pt] uppercase tracking-[0.22em] font-semibold text-hyve-text/70">
            {EVENT.name}
          </p>
          <p className="text-[7pt] uppercase tracking-[0.22em] font-semibold text-hyve-interactive-dark mt-[0.8mm]">
            <Ph>{EVENT.stand}</Ph>
          </p>
        </div>
      </div>

      {/* Hook */}
      <div className="mt-[14mm]">
        <div className="w-[12mm] h-[0.8mm] bg-hyve-accent mb-[5mm]" />
        <h1 className="font-heading font-medium leading-[1.05] text-[27pt] tracking-tight">
          A nervous system
          <br />
          for machines.
        </h1>
        <p className="mt-[5mm] text-[10.5pt] leading-snug text-hyve-text font-light max-w-[82mm]">
          A flexible sensing skin that bonds to any surface and measures pressure, temperature and
          strain across the whole area, live.
        </p>
      </div>

      {/* Product render — sits over the grid on the right. */}
      <img
        src="/MatrixMesh-r5.png"
        alt=""
        aria-hidden="true"
        className="absolute right-[-5mm] top-[64mm] w-[58mm] h-auto drop-shadow-2xl"
      />

      {/* Talk card */}
      <div className="mt-auto mb-[6mm] max-w-[84mm]">
        <p className="text-[7pt] uppercase tracking-[0.22em] font-semibold text-hyve-interactive-dark mb-[2mm]">
          See it live
        </p>
        <div className="rounded-[2mm] border border-hyve-content bg-white/70 px-[4mm] py-[3.2mm]">
          <p className="font-heading font-semibold text-[10.5pt] leading-tight">{TALK.title}</p>
          <p className="text-[8pt] leading-snug text-hyve-text font-light mt-[1mm]">
            {TALK.subtitle}
          </p>
          <p className="text-[8pt] font-semibold text-hyve-header mt-[2.2mm]">
            {TALK.when} · {TALK.where}
          </p>
          <p className="text-[7.5pt] text-hyve-text/80 mt-[0.6mm]">
            {TALK.speaker} · {TALK.role}
          </p>
        </div>
      </div>

      {/* Footer: QR + URL */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[7pt] uppercase tracking-[0.22em] text-hyve-text/60 font-semibold">
            The physical data layer for AI
          </p>
          <p className="text-[12pt] font-semibold text-hyve-header mt-[1mm]">{LINKS.site}</p>
          <p className="text-[7.5pt] text-hyve-text/80 mt-[0.5mm]">
            {EVENT.dates} · {EVENT.venue}
          </p>
        </div>
        <div className="flex flex-col items-center gap-[1.5mm]">
          <div className="rounded-[1.5mm] bg-white p-[1.8mm] border border-hyve-content">
            <QrTile url={LINKS.explore} className="w-[23mm] h-[23mm]" />
          </div>
          <p className="text-[6.5pt] uppercase tracking-[0.2em] font-semibold text-hyve-text/70">
            Scan to explore
          </p>
        </div>
      </div>
    </div>
  </section>
)

// ---------------------------------------------------------------------------
// BACK — dark. What it is, why it matters, proof, contact.
// ---------------------------------------------------------------------------
const Back = ({ guides }: { guides: boolean }) => (
  <section className="leaflet-page leaflet-page--dark" data-page="back">
    <div
      className="leaflet-page__overlay"
      style={{
        background:
          'radial-gradient(ellipse at 80% 0%, rgba(127,179,190,0.30) 0%, rgba(42,48,60,0) 55%)',
      }}
    />
    {guides && <Guides />}

    <div className="leaflet-page__content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Logo src="/logo_white.svg" alt="Hyve Dynamics" className="h-[9mm] w-auto opacity-90" />
        <p className="text-[7pt] uppercase tracking-[0.22em] font-semibold text-white/55">
          What we do
        </p>
      </div>

      {/* Headline */}
      <h2 className="font-heading font-medium leading-[1.08] text-[20pt] tracking-tight mt-[8mm] text-white">
        Give the structure <span className="text-hyve-accent">a skin.</span>
      </h2>
      <p className="mt-[3mm] text-[9pt] leading-snug text-white/80 font-light max-w-[110mm]">
        Ultra-thin, conformable and installed in hours. No drilling, no tubing, no modified
        geometry. Hundreds of sensing points become one continuous, real-time field.
      </p>

      {/* Modalities */}
      <div className="flex flex-wrap gap-[2mm] mt-[4mm]">
        {['Pressure', 'Suction', 'Temperature', 'Strain', 'Shear'].map(m => (
          <span
            key={m}
            className="text-[7.5pt] font-semibold px-[3mm] py-[1.2mm] rounded-full border border-hyve-accent/60 text-white"
            style={{ backgroundColor: 'rgba(127,179,190,0.18)' }}
          >
            {m}
          </span>
        ))}
      </div>

      {/* Three reasons */}
      <div className="flex flex-col gap-[2.4mm] mt-[6mm]">
        {[
          {
            t: 'Faster testing',
            d: 'Wind tunnel, flight and track test instrumented in an afternoon. Full-field pressure and shear, live, with no second model.',
          },
          {
            t: 'Structures that report their own health',
            d: 'Continuous strain and load across the whole surface. See the crack grow, not the failure.',
          },
          {
            t: 'From sensing to responding',
            d: 'Live surface data for digital twins, control loops and adaptive structures.',
          },
        ].map(c => (
          <div
            key={c.t}
            className="rounded-[2mm] border border-white/15 px-[4mm] py-[2.8mm]"
            style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
          >
            <p className="font-heading font-semibold text-[10pt] text-hyve-accent leading-tight">
              {c.t}
            </p>
            <p className="text-[8pt] text-white/85 leading-snug font-light mt-[1mm]">{c.d}</p>
          </div>
        ))}
      </div>

      {/* Proof strip */}
      <div className="grid grid-cols-3 gap-[2mm] mt-[5mm]">
        {PROOF.map(p => (
          <div key={p.v} className="border-t border-white/20 pt-[1.8mm]">
            <p className="font-heading font-semibold text-[13pt] text-white leading-none">{p.k}</p>
            <p className="text-[7pt] text-white/70 leading-snug mt-[1mm]">{p.v}</p>
          </div>
        ))}
      </div>
      <p className="text-[7pt] text-white/60 mt-[2.5mm]">{BACKERS}</p>
      <p className="text-[7pt] text-white/60 mt-[0.8mm]">{INDUSTRIES.join(' · ')}</p>

      {/* At the stand */}
      <div
        className="mt-[5mm] rounded-[2mm] border border-hyve-accent/50 px-[4mm] py-[3mm]"
        style={{ backgroundColor: 'rgba(127,179,190,0.12)' }}
      >
        <p className="text-[7pt] uppercase tracking-[0.22em] font-semibold text-hyve-accent">
          At the stand
        </p>
        <ul className="mt-[1.5mm] flex flex-col gap-[0.8mm]">
          {AT_THE_STAND.map(t => (
            <li key={t} className="text-[8.5pt] text-white/90 leading-snug flex gap-[2mm]">
              <span className="text-hyve-accent">—</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div className="mt-auto flex items-end justify-between">
        <div>
          <p className="text-[7pt] uppercase tracking-[0.22em] text-white/55 font-semibold">
            Book a demo at the stand
          </p>
          <p className="text-[12pt] font-semibold text-white mt-[1mm]">{LINKS.site}</p>
          <p className="text-[8.5pt] text-white/85 mt-[0.5mm]">{LINKS.email}</p>
          <p className="text-[7.5pt] text-white/60 mt-[0.5mm]">
            <Ph>{EVENT.stand}</Ph> · {EVENT.name} · {EVENT.dates}
          </p>
        </div>
        <div className="flex flex-col items-center gap-[1.5mm]">
          <div className="rounded-[1.5mm] bg-white p-[1.8mm]">
            <QrTile url={LINKS.technology} className="w-[23mm] h-[23mm]" />
          </div>
          <p className="text-[6.5pt] uppercase tracking-[0.2em] font-semibold text-white/70">
            Technical details
          </p>
        </div>
      </div>
    </div>
  </section>
)

// ---------------------------------------------------------------------------

export const LeafletPage = () => {
  const [params] = useSearchParams()
  const guides = params.get('guides') === '1'
  const print = params.get('print') === '1'

  // Scale both pages to fit the viewport on screen. Print ignores this.
  const [scale, setScale] = useState(1)
  useEffect(() => {
    if (print) return
    const PX_PER_MM = 96 / 25.4
    const pagesW = (154 * 2 + 32 / PX_PER_MM) * PX_PER_MM
    const pagesH = 216 * PX_PER_MM
    const calc = () => {
      const s = Math.min(
        (window.innerWidth - 48) / pagesW,
        (window.innerHeight - 140) / pagesH,
        1.2
      )
      setScale(s)
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [print])

  // Signal readiness to the export script once fonts are in.
  useEffect(() => {
    let cancelled = false
    const ready = async () => {
      try {
        await Promise.all([
          document.fonts.load('300 12pt Poppins'),
          document.fonts.load('400 12pt Poppins'),
          document.fonts.load('500 12pt Poppins'),
          document.fonts.load('600 12pt Poppins'),
          document.fonts.ready,
        ])
      } catch {
        /* fall through — export script also waits a settle period */
      }
      if (!cancelled) document.documentElement.dataset.leafletReady = 'true'
    }
    ready()
    return () => {
      cancelled = true
      delete document.documentElement.dataset.leafletReady
    }
  }, [])

  const stageStyle = useMemo(
    () => (print ? undefined : { transform: `scale(${scale})` }),
    [print, scale]
  )

  return (
    <>
      <NoIndex
        title="Event Leaflet"
        description="Hyve Dynamics internal event leaflet composer (dev-only)."
      />
      <div className="leaflet-stage">
        {!print && (
          <p className="leaflet-hud">
            A5 leaflet · 154 × 216 mm incl. 3 mm bleed · <code>npm run leaflet</code> to export ·{' '}
            <code>?guides=1</code> for trim lines
          </p>
        )}
        <div className="leaflet-stage__pages" style={stageStyle}>
          <Front guides={guides} />
          <Back guides={guides} />
        </div>
      </div>
    </>
  )
}
