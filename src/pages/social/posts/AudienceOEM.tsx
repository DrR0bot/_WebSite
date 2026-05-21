/**
 * Audience: OEM R&D leaders (aerospace, auto, motorsport).
 *
 * Use cases:
 *  - Targeted post for engineering leadership at OEMs
 *  - Pair with caption: "Legacy instrumentation is the silent tax on
 *    every aerodynamic development programme. We're cutting it."
 *
 * Layout: light variant, "before vs after" two-column compare, proof
 * strip at the bottom (Tier 1 / patents / ATI).
 */

import { Logo } from '../components/Logo'
import bgSlides from '../../deck/assets/Background_slides.png'

export const AudienceOEM = () => (
  <>
    <div
      className="social-canvas__bg"
      aria-hidden="true"
      style={{ backgroundImage: `url(${bgSlides})` }}
    />
    <div
      className="social-canvas__overlay"
      style={{
        background:
          'linear-gradient(180deg, rgba(244,242,243,0.92) 0%, rgba(244,242,243,0.96) 100%)',
      }}
    />

    <div className="social-canvas__content text-hyve-header">
      {/* Top: badge + headline */}
      <div className="flex flex-col gap-6">
        <p className="text-[18px] uppercase tracking-[0.25em] text-hyve-interactive-dark font-semibold">
          For R&amp;D leaders · Aerospace · Auto · Motorsport
        </p>
        <h1 className="font-heading font-medium leading-[1.05] text-[72px] tracking-tight">
          Swap <span className="text-hyve-text/40 line-through decoration-[6px]">weeks</span>
          {' '}of instrumentation
          <br />
          for <span className="text-hyve-interactive-dark">hours</span> of sensing.
        </h1>
      </div>

      {/* Middle: before/after grid */}
      <div className="flex-1 grid grid-cols-2 gap-8 mt-12">
        <div className="rounded-2xl p-8 border border-hyve-text/15 bg-white/40 flex flex-col">
          <p className="text-[14px] uppercase tracking-[0.18em] text-hyve-text/50 font-semibold mb-5">
            Legacy approach
          </p>
          <ul className="space-y-4 text-[22px] text-hyve-text/75 leading-snug font-light">
            <li>· Discrete pressure taps</li>
            <li>· Multi-day installation</li>
            <li>· Drilling &amp; surface damage</li>
            <li>· Sparse spatial resolution</li>
          </ul>
        </div>
        <div className="rounded-2xl p-8 border border-hyve-interactive/40 bg-gradient-to-br from-hyve-accent/15 to-hyve-interactive/10 flex flex-col">
          <p className="text-[14px] uppercase tracking-[0.18em] text-hyve-interactive-dark font-semibold mb-5">
            With Hyve
          </p>
          <ul className="space-y-4 text-[22px] text-hyve-header leading-snug font-medium">
            <li>· High-density sensor array</li>
            <li>· Rapid, non-invasive deployment</li>
            <li>· Reusable &mdash; repositionable</li>
            <li>· Full pressure-distribution map</li>
          </ul>
        </div>
      </div>

      {/* Proof strip + footer */}
      <div className="mt-10 flex flex-col gap-6">
        <div className="grid grid-cols-3 gap-5 text-center">
          {[
            { v: 'Tier 1', l: 'Wind-tunnel validated' },
            { v: '5 + 1', l: 'UK patents granted + pending' },
            { v: 'ATI', l: 'Backed programme' },
          ].map(s => (
            <div
              key={s.v}
              className="rounded-xl py-6 px-3 bg-hyve-header/[0.04] border border-hyve-header/10 flex flex-col items-center gap-2"
            >
              <p className="text-[44px] font-heading font-semibold text-hyve-header leading-none tracking-tight">
                {s.v}
              </p>
              <p className="text-[19px] text-hyve-text/75 leading-tight font-medium">
                {s.l}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3">
          <Logo src="/HD-Logo-dk2.svg" alt="Hyve Dynamics" className="h-12 w-auto" />
          <p className="text-[22px] text-hyve-text font-medium">hyvedynamics.com</p>
        </div>
      </div>
    </div>
  </>
)
