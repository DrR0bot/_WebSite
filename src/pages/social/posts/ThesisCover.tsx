/**
 * Thesis Cover — hero post pinning the category claim.
 *
 * Use cases:
 *  - Company page banner change / fresh tagline launch
 *  - Pinned "About us" post
 *  - Investor outreach opener
 *
 * Layout: light variant, big serif-free headline, MatrixMesh product image
 * anchored bottom-right, logo top-left, URL bottom-left.
 *
 * Canvas is exactly 1080×1350 px (LinkedIn 4:5 portrait).
 */

import bgSlides from '../../deck/assets/Background_slides.png'

export const caption = `AI sees, hears, and reads. It still can't feel.

Hyve gives machines the missing sense — real-time pressure, temperature and strain from any surface.

The physical data layer for AI.`

export const ThesisCover = () => (
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
          'linear-gradient(135deg, rgba(244,242,243,0.35) 0%, rgba(244,242,243,0.85) 60%, rgba(244,242,243,0.95) 100%)',
      }}
    />
    <div className="social-canvas__content text-hyve-header">
      {/* Top: logo + accent bar */}
      <div className="flex flex-col gap-8">
        <img src="/HD-Logo-dk2.svg" alt="Hyve Dynamics" className="h-16 w-auto" />
        <div className="w-16 h-[3px] bg-hyve-accent" />
      </div>

      {/* Middle: thesis statement */}
      <div className="flex-1 flex flex-col justify-center gap-10">
        <h1 className="font-heading font-medium leading-[1.05] text-[88px] tracking-tight">
          The physical
          <br />
          data layer
          <br />
          <span className="text-hyve-interactive-dark">for AI.</span>
        </h1>
        <p className="text-[32px] leading-snug text-hyve-text/80 font-light max-w-[820px]">
          Real-time pressure, temperature &amp; strain&nbsp;— from any surface.
        </p>
      </div>

      {/* Bottom: URL + product image */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-[18px] uppercase tracking-[0.22em] text-hyve-text/50 font-medium">
            Hyve Dynamics
          </p>
          <p className="text-[22px] text-hyve-text font-medium">hyvedynamics.com</p>
        </div>
        <img
          src="/MatrixMesh-r5.png"
          alt=""
          aria-hidden="true"
          className="h-[260px] w-auto drop-shadow-2xl"
        />
      </div>
    </div>
  </>
)
