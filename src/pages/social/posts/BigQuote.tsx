/**
 * Big Quote — single bold statement on dark background.
 *
 * Use cases:
 *  - Thought-leadership post (no link, drives saves + reshares)
 *  - Comment-bait — invites "what about touch?" replies
 *  - Reusable as a thread opener
 *
 * Layout: dark variant, hero quote, attribution strip at bottom.
 */

import { Logo } from '../components/Logo'

export const BigQuote = () => (
  <>
    {/* Subtle radial highlight to lift the type off the dark background */}
    <div
      className="social-canvas__overlay"
      style={{
        background:
          'radial-gradient(circle at 30% 25%, rgba(127,179,190,0.22) 0%, rgba(42,48,60,0) 55%)',
      }}
    />

    <div className="social-canvas__content">
      {/* Top: logo */}
      <div>
        <Logo src="/logo_white.svg" alt="Hyve Dynamics" className="h-14 w-auto opacity-90" />
      </div>

      {/* Middle: quote */}
      <div className="flex-1 flex flex-col justify-center gap-8">
        <div className="text-hyve-accent text-[120px] leading-none font-heading font-light -mb-12 select-none">
          &ldquo;
        </div>
        <h2 className="font-heading font-light leading-[1.1] text-[78px] text-white tracking-tight">
          AI sees, hears
          <br />
          and reads.
        </h2>
        <h2 className="font-heading font-medium leading-[1.1] text-[78px] text-white tracking-tight">
          It doesn&apos;t <span className="italic text-hyve-accent">feel</span>.
        </h2>
        <h2 className="font-heading font-medium leading-[1.1] text-[78px] text-white tracking-tight">
          We change that.
        </h2>
      </div>

      {/* Bottom: attribution strip */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[16px] uppercase tracking-[0.24em] text-white/40 font-medium">
            The nervous system for machines
          </p>
          <p className="text-[22px] text-white/85 font-light">
            in the AI era.
          </p>
        </div>
        <p className="text-[18px] text-white/60 font-medium">hyvedynamics.com</p>
      </div>
    </div>
  </>
)
