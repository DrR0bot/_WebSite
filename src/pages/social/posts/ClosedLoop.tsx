/**
 * Close the Loop — the new core thesis post.
 *
 * Use cases:
 *  - Manifesto / thought-leadership anchor
 *  - Pin to top of company page
 *  - Talk-track for investor / partner outreach
 *
 * Layout: accent variant, vertical 4-step "loop" stack with the SENSE
 * step highlighted as the Hyve-provided "missing edge". Each step gets
 * the full canvas width so the type stays large.
 */

import { Logo } from '../components/Logo'

export const caption = `AI has been an open loop: it perceives, infers, guesses — and sometimes hallucinates.

Add touch and the loop closes. Machines react to what they feel, not what they predict.

The difference between a smart system and an autonomous one.`

const STEPS = [
  {
    n: '01',
    t: 'SENSE',
    d: 'Real-time pressure, temperature and strain from any surface.',
    accent: true,
    badge: 'the missing edge',
  },
  {
    n: '02',
    t: 'PERCEIVE',
    d: 'AI grounds its world model in physical-world signals.',
  },
  {
    n: '03',
    t: 'DECIDE',
    d: 'Models reason on measurements — not predictions.',
  },
  {
    n: '04',
    t: 'ACT & ADJUST',
    d: 'Continuous correction. The loop closes — and starts again.',
  },
]

export const ClosedLoop = () => (
  <>
    <div
      className="social-canvas__overlay"
      style={{
        background:
          'radial-gradient(ellipse at 20% 0%, rgba(127,179,190,0.30) 0%, rgba(42,48,60,0) 60%)',
      }}
    />

    <div className="social-canvas__content">
      {/* Top: logo + section tag */}
      <div className="flex items-center justify-between">
        <Logo src="/logo_white.svg" alt="Hyve Dynamics" className="h-12 w-auto opacity-90" />
        <p className="text-[14px] uppercase tracking-[0.25em] text-white/55 font-semibold">
          Close the loop
        </p>
      </div>

      {/* Headline */}
      <div className="flex flex-col gap-6 mt-4">
        <h1 className="font-heading font-medium leading-[1.05] text-[78px] tracking-tight text-white">
          The closed loop
          <br />
          <span className="text-hyve-accent">AI was missing.</span>
        </h1>
      </div>

      {/* Step cards — vertical stack, full canvas width */}
      <div className="flex-1 flex flex-col gap-4 justify-center mt-4">
        {STEPS.map(s => (
          <div
            key={s.n}
            className={`rounded-2xl px-7 py-5 border flex items-center gap-6 ${
              s.accent
                ? 'border-hyve-accent/80'
                : 'border-white/15'
            }`}
            style={{
              backgroundColor: s.accent
                ? 'rgba(127,179,190,0.14)'
                : 'rgba(255,255,255,0.06)',
            }}
          >
            <p className="text-[22px] font-mono text-white/45 w-[60px] flex-shrink-0">
              {s.n}
            </p>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-3">
                <p className="text-[26px] font-heading font-semibold text-white tracking-tight">
                  {s.t}
                </p>
                {s.badge && (
                  <span className="text-[11px] uppercase tracking-[0.22em] text-hyve-accent font-semibold px-2.5 py-1 rounded-full border border-hyve-accent/60">
                    {s.badge}
                  </span>
                )}
              </div>
              <p className="text-[20px] text-white/85 font-light leading-snug">
                {s.d}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between pt-6 mt-4 border-t border-white/15">
        <div className="flex flex-col gap-1">
          <p className="text-[16px] uppercase tracking-[0.22em] text-white/55 font-semibold">
            Sense → Decide → Act → Sense again
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
