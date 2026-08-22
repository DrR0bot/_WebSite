/**
 * Defence Cover — opens the defence / dual-use vertical.
 *
 * Use cases:
 *  - First post in defence-targeted campaign
 *  - Pair with outreach to MOD / dstl / primes / sovereign-capability programmes
 *  - Reusable as conference banner for defence events (DSEI, FIA, etc.)
 *
 * Layout: dark variant. Big positioning headline, supporting subhead,
 * three proof pillars stacked vertically, sovereign-by-design footer.
 *
 * Note: filename keeps the US spelling "Defense" because that's how the
 * concept was tracked through the brief, but the canvas + caption use UK
 * "Defence" spelling to match Hyve's UK / sovereign positioning.
 */

import { Logo } from '../components/Logo'

export const caption = `Autonomy without physical grounding is a liability.

In contested environments, machines can't afford to guess. They need to feel — across their structure, every second they're in the field.

Hyve is building that layer. UK-developed. Sovereign by design.`

const PILLARS = [
  {
    t: 'Surface-level truth',
    d: 'Continuous pressure, temperature and strain across the platform — in flight, at sea, on the ground.',
  },
  {
    t: 'Field-deployable',
    d: 'Reusable, non-invasive sensing built for the operating environment, not the lab bench.',
  },
  {
    t: 'Sovereign by design',
    d: 'UK-developed, ATI-backed, 5 + 1 patents granted and pending.',
  },
]

export const DefenseCover = () => (
  <>
    <div
      className="social-canvas__overlay"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(127,179,190,0.20) 0%, rgba(42,48,60,0) 55%)',
      }}
    />

    <div className="social-canvas__content">
      {/* Top: logo + sector tag */}
      <div className="flex items-center justify-between">
        <Logo src="/logo_white.svg" alt="Hyve Dynamics" className="h-12 w-auto opacity-90" />
        <p className="text-[14px] uppercase tracking-[0.25em] text-white/55 font-semibold">
          Defence · Autonomy · Sovereignty
        </p>
      </div>

      {/* Pre-head + headline */}
      <div className="flex flex-col gap-5 mt-4">
        <p className="text-[18px] uppercase tracking-[0.28em] text-hyve-accent font-semibold">
          For defence &amp; dual-use programmes
        </p>
        <h1 className="font-heading font-medium leading-[1.02] text-[84px] tracking-tight text-white">
          The tactile
          <br />
          layer for
          <br />
          <span className="text-hyve-accent">defence autonomy.</span>
        </h1>
      </div>

      {/* Subhead */}
      <p className="text-[24px] leading-snug text-white/80 font-light max-w-[860px] mt-6">
        Autonomy without physical grounding is a liability in contested
        environments. Hyve gives platforms, payloads and people continuous,
        surface-level truth.
      </p>

      {/* Pillars */}
      <div className="flex-1 flex flex-col gap-3 justify-end">
        {PILLARS.map(p => (
          <div
            key={p.t}
            className="rounded-2xl px-7 py-5 border border-white/15 flex items-center gap-7"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          >
            <p className="text-[26px] font-heading font-semibold text-white leading-tight w-[300px] flex-shrink-0">
              {p.t}
            </p>
            <p className="text-[20px] text-white/85 leading-snug font-light flex-1">
              {p.d}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between pt-6 mt-6 border-t border-white/15">
        <div className="flex flex-col gap-1">
          <p className="text-[16px] uppercase tracking-[0.22em] text-white/55 font-semibold">
            UK-developed · ATI-backed · 5 UK patents
          </p>
          <p className="text-[26px] text-white font-medium">hyvedynamics.com</p>
        </div>
        <p className="text-[18px] text-white/60 font-medium italic whitespace-nowrap">
          Sovereign by design
        </p>
      </div>
    </div>
  </>
)
