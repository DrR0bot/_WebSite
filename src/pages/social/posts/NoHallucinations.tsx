/**
 * No Hallucinations — the grounded-AI post.
 *
 * Use cases:
 *  - Riding current AI discourse (hallucinations are a hot topic)
 *  - Counter-positioning against pure perception / LLM stacks
 *  - High share potential — punchy, contrarian
 *
 * Layout: dark variant, contrast headline + a "guess → sense" mini-grid
 * with three before/after rows.
 */

import { Logo } from '../components/Logo'

export const caption = `AI hallucinates because it has to guess.

It can read every paper ever written about a wind tunnel — but it can't feel the air moving across a wing.

Hyve closes that gap. Real surface data. No guessing. No drift.`

const ROWS = [
  { before: 'Sees, then guesses', after: 'Senses, then knows' },
  { before: 'Predicts surface contact', after: 'Measures surface contact' },
  { before: 'Drifts as conditions change', after: 'Self-corrects in real time' },
]

export const NoHallucinations = () => (
  <>
    <div
      className="social-canvas__overlay"
      style={{
        background:
          'radial-gradient(ellipse at 80% 15%, rgba(127,179,190,0.22) 0%, rgba(42,48,60,0) 55%)',
      }}
    />

    <div className="social-canvas__content">
      {/* Top: logo + section tag */}
      <div className="flex items-center justify-between">
        <Logo src="/logo_white.svg" alt="Hyve Dynamics" className="h-12 w-auto opacity-90" />
        <p className="text-[14px] uppercase tracking-[0.25em] text-white/55 font-semibold">
          Grounded AI
        </p>
      </div>

      {/* Headline + grid */}
      <div className="flex-1 flex flex-col justify-center gap-12">
        <h1 className="font-heading font-medium leading-[1.05] text-[82px] tracking-tight text-white">
          AI without
          <br />
          senses is a
          <br />
          <span className="text-hyve-accent">guessing machine.</span>
        </h1>

        <div className="flex flex-col gap-3">
          {ROWS.map(r => (
            <div
              key={r.before}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 rounded-2xl px-7 py-4 border border-white/15"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <p className="text-[22px] text-white/50 line-through decoration-2 font-light leading-tight text-right">
                {r.before}
              </p>
              <span className="text-hyve-accent text-[26px] font-mono">→</span>
              <p className="text-[22px] text-white font-medium leading-tight">
                {r.after}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between pt-6 border-t border-white/15">
        <div className="flex flex-col gap-1">
          <p className="text-[16px] uppercase tracking-[0.22em] text-white/55 font-semibold">
            Real data. Real decisions.
          </p>
          <p className="text-[26px] text-white font-medium">hyvedynamics.com</p>
        </div>
        <p className="text-[18px] text-white/60 font-medium italic whitespace-nowrap">
          The physical data layer for AI
        </p>
      </div>
    </div>
  </>
)
