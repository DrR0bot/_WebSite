/**
 * Industry: Digital Twin / IVHM / Structural Health Monitoring.
 *
 * Use cases:
 *  - Targeting digital-twin platform vendors, SHM/IVHM programmes,
 *    predictive-maintenance OEMs
 *  - Pair with caption: "Every digital twin is only as good as the
 *    physical-world data feeding it. Today, most are starving."
 *
 * Layout: accent gradient variant, white type, three application cards
 * stacked vertically so each title + description gets the full canvas
 * width and can use legible type sizes.
 */

import { Logo } from '../components/Logo'

export const IndustryDigitalTwin = () => (
  <>
    {/* Soft top highlight */}
    <div
      className="social-canvas__overlay"
      style={{
        background:
          'radial-gradient(ellipse at 70% 0%, rgba(127,179,190,0.30) 0%, rgba(42,48,60,0) 60%)',
      }}
    />

    <div className="social-canvas__content">
      {/* Top: logo + category tag */}
      <div className="flex items-center justify-between">
        <Logo src="/logo_white.svg" alt="Hyve Dynamics" className="h-12 w-auto opacity-90" />
        <p className="text-[14px] uppercase tracking-[0.25em] text-white/55 font-semibold">
          Digital Twin · IVHM · SHM
        </p>
      </div>

      {/* Middle: headline + subhead */}
      <div className="flex-1 flex flex-col justify-center gap-8">
        <h1 className="font-heading font-medium leading-[1.05] text-[76px] tracking-tight text-white">
          Digital twins need
          <br />
          <span className="text-hyve-accent">physical-world</span>
          <br />
          ground truth.
        </h1>
        <p className="text-[28px] leading-snug text-white/80 font-light max-w-[860px]">
          Hyve embeds dense surface sensing into the next generation of
          digital-twin, IVHM and structural-health programmes &mdash;
          continuous, real-time, non-invasive.
        </p>
      </div>

      {/* Application cards — stacked vertically so each title + description
          gets the full canvas width and can use legible type sizes. */}
      <div className="flex flex-col gap-4">
        {[
          {
            t: 'Structural Health Monitoring',
            d: 'Surface strain &amp; load mapping &mdash; no embedded gauges, no structural modification.',
          },
          {
            t: 'IVHM &amp; Predictive Maintenance',
            d: 'Continuous condition data feeding fleet-level health models.',
          },
          {
            t: 'Digital-Twin Calibration',
            d: 'Real measurements anchoring simulated models to physical truth.',
          },
        ].map(c => (
          <div
            key={c.t}
            className="rounded-2xl px-7 py-5 border border-white/15 flex items-center gap-7"
            style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}
          >
            <p
              className="text-[28px] font-heading font-semibold text-white leading-tight w-[360px] flex-shrink-0"
              dangerouslySetInnerHTML={{ __html: c.t }}
            />
            <p
              className="text-[22px] text-white/85 leading-snug font-light flex-1"
              dangerouslySetInnerHTML={{ __html: c.d }}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between pt-8 mt-6 border-t border-white/15">
        <div className="flex flex-col gap-2">
          <p className="text-[16px] uppercase tracking-[0.22em] text-white/55 font-semibold">
            The physical data layer for AI
          </p>
          <p className="text-[28px] text-white font-medium">hyvedynamics.com</p>
        </div>
        <p className="text-[18px] text-white/60 font-medium italic whitespace-nowrap">
          Tier 1 validated &middot; 5 UK patents
        </p>
      </div>
    </div>
  </>
)
