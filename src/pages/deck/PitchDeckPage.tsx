import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { Maximize2, Minimize2 } from 'lucide-react'

import { NoIndex } from '@/components/common/NoIndex'

import bgCover from './assets/Background_slides.png'
import bgSlides from './assets/Background_slides.png'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import './PitchDeck.css'

// ---------------------------------------------------------------------------
// Slide definitions
//
// variant:    'dark' (light text) | 'light' (dark text) | 'accent' (light text, gradient fallback)
// bg:         Background image (imported asset). Falls back to variant colour.
// bgOverlay:  Optional overlay opacity (0–1) for text readability. Default 0.
// content:    JSX to render on the slide. Falls back to a placeholder.
//
// References marked href="#" need real source URLs — search for "TODO:ref"
// ---------------------------------------------------------------------------

interface SlideConfig {
  id: number
  placeholder: string
  variant: 'dark' | 'light' | 'accent'
  bg?: string
  bgOverlay?: number
  content?: React.ReactNode
}

// ---- SLIDE 1: COVER -------------------------------------------------------
const coverContent = (
  <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-between text-hyve-header">
    {/* Logo — top left */}
    <div className="pt-2">
      <img
        src="/HD-Logo-dk2.svg"
        alt="Hyve Dynamics"
        className="h-14 md:h-16 lg:h-20 w-auto"
      />
    </div>

    {/* Main copy — left aligned */}
    <div>
      <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-heading font-normal leading-tight mb-6">
        The nervous system for machines
      </h1>
      <p className="text-base md:text-lg text-hyve-text leading-relaxed max-w-2xl">
        We are building the physical world's missing data layer.
      </p>
      <p className="text-base md:text-lg text-hyve-text leading-relaxed max-w-2xl">
        Starting with aerospace, then scale to every structure that moves, flexes, or fails.
      </p>
    </div>

    {/* Bottom row — round info left, entity right */}
    <div className="flex justify-between items-end pb-2">
      <p className="text-xs md:text-sm text-hyve-text/60 font-light">
        £3M Seed Round · May 2026 · Strictly Confidential
      </p>
      <p className="text-xs md:text-sm text-hyve-text/60 font-light">
        Hyve Dynamics Holdings Limited
      </p>
    </div>
  </div>
)

// ---- SLIDE 2: THE PROBLEM --------------------------------------------------
const problemContent = (
  <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-between text-hyve-header">
    {/* Headline */}
    <div>
      <p className="text-[28px] font-semibold text-hyve-text leading-relaxed flex flex-col gap-0 mt-2.5 mb-2.5">
        The physical world is the last environment without a data layer.
      </p>
      <p className="text-[28px] font-semibold text-hyve-text leading-relaxed flex flex-col gap-0 mt-2.5 mb-2.5">
        And it is costing the industry billions.
      </p>
    </div>

    {/* THE PAIN IN THREE NUMBERS */}
    <div>
      <div className="border-t border-hyve-text/15 pt-5 mb-4">
        <h3 className="text-xl uppercase tracking-normal font-semibold text-hyve-text mb-3">
          The Pain in Three Numbers
        </h3>
        <p className="text-xs md:text-sm italic text-hyve-text/60 leading-relaxed">
          Programme scale: <strong>commercial aircraft-class development</strong> — <strong>wind tunnel testing</strong> as a line of programme cost and schedule risk <em>(not a single ad-hoc tunnel hire).</em>
        </p>
      </div>

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-hyve-text/15">
            <th className="py-2 pr-4 text-xs md:text-sm font-semibold text-hyve-text/80 w-1/3">Programme cost</th>
            <th className="py-2 pr-4 text-xs md:text-sm font-semibold text-hyve-text/80 w-1/3">Hourly facility rate</th>
            <th className="py-2 text-xs md:text-sm font-semibold text-hyve-text/80 w-1/3">Booking lead time</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-hyve-text/10">
            <td className="py-3 pr-4 text-xl md:text-2xl font-bold text-hyve-header">$15–30M</td>
            <td className="py-3 pr-4 text-xl md:text-2xl font-bold text-hyve-header">~$20,000/hr</td>
            <td className="py-3 text-xl md:text-2xl font-bold text-hyve-header">12–18 months</td>
          </tr>
          <tr>
            <td className="py-2 pr-4 text-xs font-semibold text-hyve-text/60 leading-snug">Aggregate wind tunnel testing spend, major programme<sup>1</sup></td>
            <td className="py-2 pr-4 text-xs font-semibold text-hyve-text/60 leading-snug">Major transonic facility occupancy rate<sup>2</sup></td>
            <td className="py-2 text-xs font-semibold text-hyve-text/60 leading-snug">Advance booking for national-scale tunnel access<sup>3</sup></td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* FOOTNOTES */}
    {/* TODO:ref — replace # with actual source URLs when compiled */}
    <div className="text-[9px] md:text-[10px] font-bold text-hyve-text/40 space-y-1 pt-4">
      <p><sup>1</sup> Total operational wind tunnel costs for a major commercial aircraft programme (programme-wide aggregate, not one short campaign). Peer-reviewed: <em>Engineering Science and Technology</em> via ScienceDirect (2025).</p>
      <p><sup>2</sup> Major NASA-class transonic tunnels reported up to ~$20,000/user-hour; reimbursable rates vary by facility and era. <em>Aerospace America</em> (AIAA), May 2018; RAND NASA facility economics (e.g. TR-999).</p>
      <p><sup>3</sup> NASA Ames wind tunnel users: 12–18 months advance scheduling for entry. <em>NASA Ames Test Planning Guide</em>, Rev. 8.1 (2021).</p>
    </div>
  </div>
)

// ---- SLIDE 2B: PROBLEM (cont.) — Legacy stack, ideal lab, late data --------
const problemContContent = (
  <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-between text-hyve-header">
    {/* THE STACK HASN'T CHANGED */}
    <div>
      <div className="border-b border-hyve-text/15 pb-4 mb-5">
        <h3 className="text-lg md:text-xl font-semibold text-hyve-text mb-3">
          The Stack Hasn't Changed in 50 Years
        </h3>
        <ul className="space-y-2 text-xs md:text-sm text-hyve-text leading-relaxed">
          <li><strong>Pressure taps</strong> — hundreds of holes, weeks of prep, point measurements only</li>
          <li><strong>Pressure-sensitive paint</strong> — single-use, post-processed, lab-bound</li>
          <li><strong>CFD</strong> — indispensable, but unreliable in separated flow and off-design conditions</li>
          <li><strong>Strain gauges</strong> — one location, one direction, one install at a time</li>
        </ul>
      </div>
    </div>

    {/* IDEAL LAB, CHAOTIC WORLD */}
    <div>
      <h3 className="text-lg md:text-xl font-semibold text-hyve-text mb-3">
        Ideal Lab, Chaotic World
      </h3>
      <ul className="space-y-3 text-xs md:text-sm text-hyve-text leading-relaxed">
        <li><strong>Wind tunnels and CFD trade chaos for control</strong> — boundary conditions, scaling laws, cleaned geometries, run matrices you can afford. <strong>The asset's operating envelope is not any of those things.</strong></li>
        <li><strong>Decisive events do not volunteer for the schedule</strong> — gust fields, contamination, corners of the mission profile <strong>not in the test matrix</strong> still determine certification risk and fleet economics.</li>
        <li><strong>Restrictive, expensive facilities optimise for what they can run</strong> — not for full-surface truth at the <strong>contact layer</strong> where programmes actually succeed or fail.</li>
      </ul>
    </div>

    {/* AND LATE DATA IS CATASTROPHIC */}
    <div className="border-t border-hyve-text/15 pt-4">
      <h3 className="text-lg md:text-xl font-semibold text-hyve-text mb-2">
        And Late Data Is Catastrophic
      </h3>
      <p className="text-xs md:text-sm text-hyve-text leading-relaxed">
        A fix found at integration and test costs <strong>21–44× more</strong> than at requirements.
        At operations: <strong>29–100×</strong>.<sup className="font-bold text-hyve-text/40">4</sup>
      </p>
      <p className="text-xs md:text-sm text-hyve-text leading-relaxed mt-2">
        Teams still <strong>buy and babysit hardware</strong> instead of <strong>buying continuous, replayable surface data</strong> on demand.
      </p>
      <p className="text-[9px] md:text-[8px] font-bold text-hyve-text/40 mt-4">
        <sup>4</sup> NASA Johnson Space Center hardware-change study, 2010.
      </p>
    </div>
  </div>
)

// ---- SLIDES ARRAY ----------------------------------------------------------
const DECK_SLIDES: SlideConfig[] = [
  { id: 1, placeholder: 'Cover', variant: 'light', bg: bgSlides, content: coverContent },
  { id: 2, placeholder: 'Problem', variant: 'light', bg: bgSlides, content: problemContent },
  { id: 3, placeholder: 'Problem (cont.)', variant: 'light', bg: bgSlides, content: problemContContent },
  { id: 4, placeholder: 'Solution', variant: 'light', bg: bgSlides },
  { id: 5, placeholder: 'Platform', variant: 'light', bg: bgSlides },
  { id: 6, placeholder: 'Market & Decacorn', variant: 'light', bg: bgSlides },
  { id: 7, placeholder: 'Universality', variant: 'light', bg: bgSlides },
  { id: 8, placeholder: 'Traction', variant: 'light', bg: bgSlides },
  { id: 9, placeholder: 'Landscape', variant: 'light', bg: bgSlides },
  { id: 10, placeholder: 'Team', variant: 'light', bg: bgSlides },
  { id: 11, placeholder: 'Capital Roadmap', variant: 'light', bg: bgSlides },
  { id: 12, placeholder: 'The Ask', variant: 'dark', bg: bgCover },
  { id: 13, placeholder: 'Thank You', variant: 'dark', bg: bgCover },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const PitchDeckPage = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const progress = ((activeIndex + 1) / DECK_SLIDES.length) * 100
  const isLightSlide = DECK_SLIDES[activeIndex]?.variant === 'light'

  // Track fullscreen state
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  return (
    <>
      <NoIndex
        title="Pitch Deck"
        description="Hyve Dynamics confidential pitch deck."
      />

      <div className={`pitch-deck ${isLightSlide ? 'pitch-deck--light-slide' : ''}`}>
        {/* Progress bar */}
        <div className="deck-progress" style={{ width: `${progress}%` }} />

        {/* Overlay UI */}
        <div className="deck-ui inset-0">
          {/* Logo — hidden on cover slide (logo is in the slide content) */}
          <Link
            to="/"
            className={`fixed top-5 left-6 opacity-60 hover:opacity-90 transition-all duration-500 ${activeIndex === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <img
              src="/HD-Logo-dk2.svg"
              alt="Hyve Dynamics"
              className="h-6 md:h-7 w-auto"
            />
          </Link>

          {/* Slide counter */}
          <span className={`fixed top-5 right-6 text-xs font-mono tabular-nums transition-colors duration-500 ${isLightSlide ? 'text-hyve-text/40' : 'text-white/40'}`}>
            {String(activeIndex + 1).padStart(2, '0')} / {String(DECK_SLIDES.length).padStart(2, '0')}
          </span>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className={`fixed bottom-5 right-6 hover:text-hyve-accent transition-colors duration-500 ${isLightSlide ? 'text-hyve-text/30' : 'text-white/30'}`}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Pagination, Navigation, Keyboard]}
          direction="horizontal"
          slidesPerView={1}
          spaceBetween={0}
          speed={500}
          pagination={{ clickable: true }}
          navigation
          keyboard={{ enabled: true }}
          onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.activeIndex)}
          className="w-full h-full"
        >
          {DECK_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className={`deck-slide--${slide.variant} w-full h-full relative`}
              >
                {/* Background image */}
                {slide.bg && (
                  <img
                    src={slide.bg}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Optional overlay for text readability */}
                {slide.bg && (slide.bgOverlay ?? 0) > 0 && (
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: `rgba(0,0,0,${slide.bgOverlay})` }}
                  />
                )}

                {/* Content */}
                {/* Content */}
                <div className="relative z-10 w-full h-full overflow-y-auto">
                  <div className={`min-h-full flex flex-col px-6 md:px-16 lg:px-24 py-16 md:py-20 ${slide.content ? '' : 'items-center justify-center'}`}>
                    {slide.content ?? (
                      <div className="text-center select-none">
                        <p className="text-[10px] uppercase tracking-[0.3em] opacity-20 font-mono mb-3">
                          Slide {slide.id}
                        </p>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold opacity-10">
                          {slide.placeholder}
                        </h2>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
}
