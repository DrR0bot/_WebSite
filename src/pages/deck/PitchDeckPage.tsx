import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { Maximize2, Minimize2 } from 'lucide-react'

import { NoIndex } from '@/components/common/NoIndex'

import bgSlides from './assets/Background_slides.png'
import imgAirbus1 from './assets/Airbus1.png'
import imgAirbus4 from './assets/Airbus4.png'
import imgAirbus2b from './assets/Airbus2b.png'
import imgMatrixR1 from './assets/MatrixMesh-r1.png'
import imgMatrixR5 from './assets/MatrixMesh-r5.png'
import imgAirbus5 from './assets/Airbus5.png'

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

    {/* Main copy + product image */}
    <div className="flex items-center gap-8 lg:gap-12">
      <div className="flex-1">
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
      <div className="hidden md:block flex-shrink-0 w-[280px] lg:w-[340px]">
        <img
          src={imgMatrixR5}
          alt="Haptic Matrix sensor array"
          className="w-full h-auto drop-shadow-xl"
        />
      </div>
    </div>

    {/* Bottom row — round info left, entity right */}
    <div className="flex justify-between items-end pb-2">
      <p className="text-xs md:text-sm text-hyve-text/60 font-light">
        £3.5M Seed Round · April 2026 · Strictly Confidential
      </p>
      <p className="text-xs md:text-sm text-hyve-text/60 font-light">
        Hyve Dynamics Holdings Limited
      </p>
    </div>
  </div>
)

// ---- SLIDE 2: THE PROBLEM --------------------------------------------------
const problemContent = (
  <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center gap-8 text-hyve-header">
    <div>
      <p className="text-[28px] font-semibold text-hyve-text leading-relaxed flex flex-col gap-0 mt-2.5 mb-2.5">
        The physical world is the last environment without a data layer.
      </p>
      <p className="text-[28px] font-semibold text-hyve-text leading-relaxed flex flex-col gap-0 mt-2.5 mb-2.5">
        And it is costing the industry billions.
      </p>
    </div>

    <div>
      <div className="border-t border-hyve-text/15 pt-5 mb-4">
        <h3 className="text-xl uppercase tracking-normal font-semibold text-hyve-text mb-3">
          The Pain in Three Numbers
        </h3>
        <p className="text-xs md:text-sm italic text-hyve-text/60 leading-relaxed">
          Programme scale: <strong>commercial aircraft-class development</strong> — <strong>wind tunnel testing</strong> as a line of programme cost and schedule risk <em>(not a single ad-hoc tunnel hire).</em>
        </p>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-hyve-text/15">
            <th className="py-2 pr-4 text-xs md:text-sm font-semibold text-hyve-text/80 w-1/3">Programme cost</th>
            <th className="py-2 pr-4 text-xs md:text-sm font-semibold text-hyve-text/80 w-1/3">Hourly facility rate</th>
            <th className="py-2 text-xs md:text-sm font-semibold text-hyve-text/80 w-1/3">Scheduling lead time</th>
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

    <div className="text-[9px] md:text-[10px] font-bold text-hyve-text/40 space-y-1 pt-4">
      <p><sup>1</sup> Total operational wind tunnel costs for a major commercial aircraft programme (programme-wide aggregate, not one short campaign). Peer-reviewed: <em>Engineering Science and Technology</em> via ScienceDirect (2025).</p>
      <p><sup>2</sup> Major NASA-class transonic tunnels reported up to ~$20,000/user-hour; reimbursable rates vary by facility and era. <em>Aerospace America</em> (AIAA), May 2018; RAND NASA facility economics (e.g. TR-999).</p>
      <p><sup>3</sup> NASA Ames wind tunnel users: 12–18 months advance scheduling for entry. <em>NASA Ames Test Planning Guide</em>, Rev. 8.1 (2021).</p>
    </div>
  </div>
)

// ---- SLIDE 2B: PROBLEM (cont.) — Legacy stack, ideal lab, late data --------
const problemContContent = (
  <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-8 justify-center items-stretch text-hyve-header">
    <div className="flex-1 flex flex-col justify-center gap-8">
      {/* THE STACK HASN'T CHANGED */}
      <div>
        <div className="border-b border-hyve-text/15 pb-4 mb-5">
          <h3 className="text-lg md:text-xl font-semibold text-hyve-text mb-3">
            The Stack Hasn't Changed in 50 Years
          </h3>
          <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-hyve-text leading-relaxed">
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
          <li><strong>Restrictive, expensive facilities optimise for what they can run</strong> — not for full-surface truth at the <strong>surface</strong> where programmes actually succeed or fail.</li>
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

    <div className="hidden md:flex w-[30%] flex-shrink-0 items-center">
      <img
        src={imgAirbus5}
        alt="Legacy wind tunnel instrumentation — pressure taps and wiring on test model"
        className="w-full h-auto rounded-lg shadow-lg object-cover"
      />
    </div>
  </div>
)

// ---- SLIDE 3: THE SOLUTION -------------------------------------------------
const solutionContent = (
  <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center gap-8 text-hyve-header">
    <div>
      <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
        Hyve gives engineers a continuous, full-surface picture of what their structures are actually doing, not what a simulation predicts.
      </p>
    </div>

    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
      <div className="flex-1 space-y-4">
        <p className="text-xs md:text-sm text-hyve-text leading-relaxed">
          The Haptic Matrix is an ultra-thin, flexible electronic membrane that applies directly to any aerodynamic surface, such as a wing, fuselage, blade, chassis. It streams simultaneous, real-time data across the entire area it covers.
        </p>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-hyve-header/20 bg-hyve-header/5 px-3 py-3 text-center flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-wider text-hyve-header">Bidirectional</p>
            <p className="text-sm md:text-base font-semibold text-hyve-header mt-0.5">Pressure</p>
          </div>
          <div className="rounded-lg border border-hyve-header/20 bg-hyve-header/5 px-3 py-3 text-center flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-wider text-hyve-header">In-plane</p>
            <p className="text-sm md:text-base font-semibold text-hyve-header mt-0.5">Strain</p>
          </div>
          <div className="rounded-lg border border-hyve-header/20 bg-hyve-header/5 px-3 py-3 text-center flex flex-col justify-center">
            <p className="text-sm md:text-base font-semibold text-hyve-header">Temperature</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs md:text-sm font-semibold text-hyve-header/80">
          <span>Simultaneously</span>
          <span className="text-hyve-header/30">—</span>
          <span>Continuously</span>
          <span className="text-hyve-header/30">—</span>
          <span className="text-hyve-header font-bold">At Scale</span>
        </div>

        <div className="border border-hyve-text/20 rounded-lg px-6 py-4 bg-hyve-header/[0.04]">
          <p className="text-xs md:text-sm font-semibold text-hyve-header leading-relaxed text-center">
            No holes. No single-use consumables. No post-processing delay. No assumptions.
          </p>
        </div>
        <p className="text-xs md:text-sm text-hyve-text leading-relaxed">
          You cannot <strong>replay chaos at laboratory purity</strong>, and you cannot <strong>defend a programme</strong> on only the scenarios the tunnel matrix could afford. <strong>Hyve measures the surface the world actually touches.</strong>
        </p>
      </div>
      <div className="w-full md:w-[40%] flex-shrink-0">
        <img
          src={imgAirbus1}
          alt="Haptic Matrix deployed on wind tunnel model at Airbus Filton"
          className="w-full h-auto rounded-lg shadow-lg object-cover"
        />
      </div>
    </div>

    <div className="space-y-3">
      <p className="text-xs md:text-sm text-hyve-text leading-relaxed">
        Deploys in hours, not days. Conforms to curvature down to 5mm radius. Captures &gt;500 sensing nodes per square metre. Spatial density that point sensors cannot match even in aggregate.
      </p>
      <p className="text-xs md:text-sm text-hyve-text leading-relaxed">
        For the first time, engineers can watch their structure respond in real time to the forces actually acting on it. In the wind tunnel. On the track. And, soon, in the air.
      </p>
    </div>

    <p className="text-sm md:text-base font-semibold text-hyve-header border-t border-hyve-text/15 pt-6">
      One platform. Any structure. Continuous intelligence.
    </p>
  </div>
)

// ---- SLIDE 4: PLATFORM ARCHITECTURE ----------------------------------------
const platformContent = (
  <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-8 justify-center items-stretch text-hyve-header">
    <div className="flex-1 flex flex-col justify-center gap-6">
      <div>
        <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
          You subscribe to the data, not the sensors.
        </p>
        <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
          Real time. On demand. Under your control.
        </p>
        <p className="text-xs md:text-sm italic text-hyve-text/60 mt-3">
          A sensor measures. A platform compounds. Hyve is not a sensor company.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-b border-hyve-text/15 py-4">
        <div>
          <p className="text-xs font-semibold text-hyve-header uppercase tracking-wider mb-1">Hardware</p>
          <p className="text-xs text-hyve-text/70">Haptic Matrix — conformal sensing</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-hyve-header uppercase tracking-wider mb-1">Software</p>
          <p className="text-xs text-hyve-text/70">Live acquisition, calibration, control</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-hyve-header uppercase tracking-wider mb-1">Data</p>
          <p className="text-xs text-hyve-text/70">Streams, replay, structured outputs</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs md:text-sm text-hyve-text leading-relaxed">
          Hyve owns, maintains, insures, calibrates, and refreshes the array. The customer <strong>does not</strong> take capital ownership of hardware.
        </p>
        <ul className="space-y-1.5 text-xs md:text-sm text-hyve-text leading-relaxed">
          <li><strong>Instant access</strong> — data streams as the test runs</li>
          <li><strong>Instant replay</strong> — rewind, segment, and compare runs</li>
          <li><strong>You control what you measure</strong> — configure on demand</li>
        </ul>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-hyve-text/15 pt-4">
        <div>
          <p className="text-xs font-semibold text-hyve-header">Test &amp; Development</p>
          <p className="text-xs text-hyve-text/60">Peel-and-stick, reusable</p>
          <p className="text-xs font-semibold text-hyve-header mt-1">Live now</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-hyve-header">In-Service IVHM</p>
          <p className="text-xs text-hyve-text/60">Permanently embedded</p>
          <p className="text-xs font-semibold text-hyve-header mt-1">Funded by this raise</p>
        </div>
        <div className="flex items-end">
          <p className="text-xs text-hyve-text/60 italic leading-relaxed">
            Mode 1 earns the relationship.<br />Mode 2 makes it perpetual.
          </p>
        </div>
      </div>
    </div>

    <div className="hidden md:flex w-[38%] flex-shrink-0 flex-col justify-center gap-4">
      <img
        src={imgAirbus2b}
        alt="Haptic Matrix array in Airbus Filton Wind Tunnel — live test session"
        className="w-full h-auto rounded-lg shadow-lg object-cover"
      />
      <img
        src={imgMatrixR1}
        alt="Haptic Matrix deployed on aircraft wing surface"
        className="w-full h-auto drop-shadow-xl"
      />
    </div>
  </div>
)

// ---- SLIDE 5: MARKET & DECACORN PATH ---------------------------------------
const marketContent = (
  <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center gap-6 text-hyve-header">
    <div>
      <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
        Aerospace is the beachhead.
      </p>
      <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
        The platform follows every structure that has ever interacted with a fluid.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-hyve-text/15 pt-5">
      <div>
        <p className="text-xs text-hyve-text/60 mb-1">Beachhead — actively validated</p>
        <p className="text-sm font-semibold text-hyve-header mb-2">Aerodynamic testing instrumentation</p>
        <p className="text-lg md:text-xl font-bold text-hyve-header mb-1">~$3.1B</p>
        <p className="text-xs text-hyve-text/60 mb-2">Global market · CAGR 5–7%</p>
        <p className="text-xs text-hyve-text leading-relaxed">Fewer tests, but each demands higher-fidelity instrumentation — the shift from volume to value. No incumbent offers a conformal, full-surface, real-time array. Hyve is a new category.</p>
      </div>
      <div>
        <p className="text-xs text-hyve-text/60 mb-1">Next — funded by this raise</p>
        <p className="text-sm font-semibold text-hyve-header mb-2">Aircraft SHM / IVHM</p>
        <p className="text-lg md:text-xl font-bold text-hyve-header mb-1">~$5.7B → $10.9B by 2034</p>
        <p className="text-xs text-hyve-text/60 mb-2">CAGR 6.6% · within a $114B MRO super cycle</p>
        <p className="text-xs text-hyve-text leading-relaxed">28,000+ composite-airframe aircraft in service. Oliver Wyman: integrated aircraft health management is <em>"likely to be adopted as an industry standard."</em></p>
      </div>
      <div>
        <p className="text-xs text-hyve-text/60 mb-1">Platform horizon</p>
        <p className="text-sm font-semibold text-hyve-header mb-2">Broader physical asset monitoring</p>
        <p className="text-lg md:text-xl font-bold text-hyve-header mb-1">~$3.7B → $10.5B by 2030</p>
        <p className="text-xs text-hyve-text/60 mb-2">CAGR 19.2%</p>
        <p className="text-xs text-hyve-text leading-relaxed">Marine, infrastructure, energy, industrial — identical unsolved monitoring problems, same platform architecture.</p>
      </div>
    </div>

    <p className="text-sm md:text-base font-semibold text-hyve-header border-t border-hyve-text/15 pt-4">
      Combined addressable opportunity: ~$25B+ today. ~$60B+ by 2034.
    </p>

    <div className="border-t border-hyve-text/15 pt-4 space-y-3">
      <p className="text-sm font-semibold text-hyve-header">The Decacorn path</p>
      <div className="flex flex-col md:flex-row items-stretch gap-0">
        <div className="flex-1 border border-hyve-text/15 rounded-l-lg md:rounded-l-lg rounded-r-none p-3 bg-hyve-header/[0.03]">
          <p className="text-xs text-hyve-text/60 mb-1">SHM/IVHM penetration</p>
          <p className="text-lg font-bold text-hyve-header">~$330M ARR</p>
          <p className="text-xs text-hyve-text/60 mt-1">3% of one segment by 2034</p>
        </div>
        <div className="flex items-center justify-center text-hyve-text/30 text-lg font-light px-1 hidden md:flex">→</div>
        <div className="flex-1 border border-hyve-text/15 p-3 bg-hyve-header/[0.03]">
          <p className="text-xs text-hyve-text/60 mb-1">At 8× revenue multiple</p>
          <p className="text-lg font-bold text-hyve-header">$2.6B+</p>
          <p className="text-xs text-hyve-text/60 mt-1">From one sub-segment of one vertical</p>
        </div>
        <div className="flex items-center justify-center text-hyve-text/30 text-lg font-light px-1 hidden md:flex">→</div>
        <div className="flex-1 border border-hyve-text/15 rounded-r-lg md:rounded-r-lg rounded-l-none p-3 bg-hyve-header/[0.03]">
          <p className="text-xs text-hyve-text/60 mb-1">Add marine, energy, infrastructure</p>
          <p className="text-lg font-bold text-hyve-header">$10B+</p>
          <p className="text-xs text-hyve-text/60 mt-1">Platform valuation exceeds Decacorn</p>
        </div>
      </div>
      <p className="text-xs font-semibold text-hyve-text/60 uppercase tracking-wider pt-2">Recent aerospace sensing acquisitions</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-xs text-hyve-text"><strong>Simmonds Precision</strong><br /><span className="text-hyve-text/60">SHM &amp; fuel sensing</span><br />→ TransDigm · $765M<sup>5</sup><br /><span className="text-hyve-text/50">2025</span></div>
        <div className="text-xs text-hyve-text"><strong>Raptor Scientific</strong><br /><span className="text-hyve-text/60">Aero test &amp; measurement</span><br />→ TransDigm · $655M<sup>6</sup><br /><span className="text-hyve-text/50">2024</span></div>
        <div className="text-xs text-hyve-text"><strong>PSI / Druck</strong><br /><span className="text-hyve-text/60">Pressure instrumentation</span><br />→ Crane · $1.06B<sup>7</sup><br /><span className="text-hyve-text/50">2025</span></div>
        <div className="text-xs text-hyve-text"><strong>Meggitt</strong><br /><span className="text-hyve-text/60">Aerospace sensors</span><br />→ Parker Hannifin · $8.63B<sup>8</sup><br /><span className="text-hyve-text/50">2022</span></div>
      </div>
      <p className="text-xs text-hyve-text/70 pt-2">
        TransDigm alone spent <strong>$1.42B on two aerospace sensing acquisitions</strong> in 2024–2025. Proprietary sensing with aftermarket content commands 2–7× revenue multiples.
      </p>
      <p className="text-[9px] md:text-[10px] font-bold text-hyve-text/40 pt-2">
        <sup>5</sup> TransDigm Group press release, 2025. <sup>6</sup> TransDigm Group press release, 2024. <sup>7</sup> Crane Co. investor filing, 2025. <sup>8</sup> Parker Hannifin acquisition filing, 2022.
      </p>
    </div>
  </div>
)

// ---- SLIDE 5B: PLATFORM UNIVERSALITY ----------------------------------------
const universalityContent = (
  <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center gap-8 text-hyve-header">
    <div>
      <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
        If it works on a live Airbus programme model in a wind tunnel, it works everywhere.
      </p>
      <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
        We are choosing the order.
      </p>
    </div>

    <div className="space-y-4">
      <p className="text-xs md:text-sm text-hyve-text leading-relaxed">
        The Haptic Matrix operates on a universal physical principle: wherever fluid dynamics or mechanical forces interact with a structure, there is a measurement problem the world has not solved.
      </p>
      <p className="text-xs md:text-sm text-hyve-text leading-relaxed">
        We are not building for all of them today. We are building for the one that makes us ready for all of them.
      </p>
    </div>

    <div className="border border-hyve-text/20 rounded-lg px-6 py-5 bg-hyve-header/[0.04]">
      <p className="text-sm md:text-base font-semibold text-hyve-header leading-relaxed text-center">
        Aerospace gives us something no other market can: the world's hardest quality gate.
      </p>
    </div>

    <p className="text-xs md:text-sm text-hyve-text leading-relaxed">
      The path runs through DO-160 environmental qualification, OEM acceptance, and type-certification credibility. When we arrive in marine, energy, or infrastructure, we are arriving as a technology already inside Airbus wind tunnel programmes. That changes the sales conversation entirely.
    </p>

    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-hyve-text/15">
          <th className="py-2 pr-4 text-xs font-semibold text-hyve-text/80">Domain</th>
          <th className="py-2 pr-4 text-xs font-semibold text-hyve-text/80">Problem</th>
          <th className="py-2 text-xs font-semibold text-hyve-text/80">Status</th>
        </tr>
      </thead>
      <tbody className="text-xs md:text-sm text-hyve-text">
        <tr className="border-b border-hyve-text/10">
          <td className="py-2.5 pr-4 font-semibold">Aerospace</td>
          <td className="py-2.5 pr-4">Sparse, slow, invasive aerodynamic and structural data</td>
          <td className="py-2.5 font-semibold text-hyve-header">✅ Validated — beachhead</td>
        </tr>
        <tr className="border-b border-hyve-text/10">
          <td className="py-2.5 pr-4 font-semibold">Marine &amp; Naval</td>
          <td className="py-2.5 pr-4">Hull loads and pressure unmeasured in operation</td>
          <td className="py-2.5 text-hyve-text/60">Inbound interest received</td>
        </tr>
        <tr className="border-b border-hyve-text/10">
          <td className="py-2.5 pr-4 font-semibold">Energy infrastructure</td>
          <td className="py-2.5 pr-4">Pipeline fatigue and corrosion onset undetected</td>
          <td className="py-2.5 text-hyve-text/60">Inbound interest received</td>
        </tr>
        <tr className="border-b border-hyve-text/10">
          <td className="py-2.5 pr-4 font-semibold">Civil &amp; Mining</td>
          <td className="py-2.5 pr-4">Tunnel stress redistribution precedes collapse with no live monitoring</td>
          <td className="py-2.5 text-hyve-text/60">Inbound interest received</td>
        </tr>
        <tr>
          <td className="py-2.5 pr-4 font-semibold">Insurance &amp; Prognostics</td>
          <td className="py-2.5 pr-4">Aircraft risk underwritten on calendar, not condition data</td>
          <td className="py-2.5 text-hyve-text/60">Natural IVHM extension</td>
        </tr>
      </tbody>
    </table>

    <p className="text-xs md:text-sm text-hyve-text leading-relaxed border-t border-hyve-text/15 pt-4">
      The array is the same. The subscription is the same. The data platform is the same.<br />
      What changes is the surface — and the domain we have earned the right to enter.
    </p>
  </div>
)

// ---- SLIDE 6: TRACTION ------------------------------------------------------
const tractionContent = (
  <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-8 justify-center items-stretch text-hyve-header">
    <div className="flex-1 flex flex-col justify-center gap-6">
      <div>
        <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
          The most demanding aerodynamic programmes in the world are already testing with us.
        </p>
        <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
          The technology works. The pipeline is real.
        </p>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-hyve-text/15">
            <th className="py-2 pr-4 text-xs font-semibold text-hyve-text/80">Relationship</th>
            <th className="py-2 text-xs font-semibold text-hyve-text/80">What it proves</th>
          </tr>
        </thead>
        <tbody className="text-xs md:text-sm text-hyve-text">
          <tr className="border-b border-hyve-text/10">
            <td className="py-2.5 pr-4"><strong>Airbus / Filton wind tunnel</strong><br /><span className="text-hyve-text/60">Active testing partner</span></td>
            <td className="py-2.5">Tier-1 OEM. Deployed in <strong>&lt;20 min</strong>. Removed in <strong>&lt;5 min</strong>. Retested — confirmed working.</td>
          </tr>
          <tr className="border-b border-hyve-text/10">
            <td className="py-2.5 pr-4"><strong>F1 — Red Bull Racing, Alpine, Aston Martin</strong><br /><span className="text-hyve-text/60">Testing rigs being planned</span></td>
            <td className="py-2.5">The most data-intensive aero programmes on Earth see the value case</td>
          </tr>
          <tr>
            <td className="py-2.5 pr-4"><strong>British Cycling / Univ. Manchester</strong><br /><span className="text-hyve-text/60">Testing being planned</span></td>
            <td className="py-2.5">Platform relevant across geometries beyond aviation</td>
          </tr>
        </tbody>
      </table>

      <blockquote className="border-l-2 border-hyve-text/20 pl-5 py-2">
        <p className="text-base md:text-lg italic text-hyve-text/80 leading-relaxed">
          "A quantum leap in data acquisition."
        </p>
        <p className="text-xs text-hyve-text/50 mt-1">— Senior engineer, leading European aerospace OEM</p>
      </blockquote>

      <p className="text-xs md:text-sm text-hyve-text/60 leading-relaxed">
        No paying customers yet. That is appropriate for this technology at this stage. The raise funds the step from validated to commercial.
      </p>

      <p className="text-xs font-semibold text-hyve-text/50 border-t border-hyve-text/15 pt-3">
        4 patents granted · UK, US, EU · 2 further applications in progress
      </p>
    </div>

    <div className="hidden md:flex w-[35%] flex-shrink-0 items-center">
      <img
        src={imgAirbus4}
        alt="Engineers deploying Haptic Matrix on wind tunnel model at Airbus Filton"
        className="w-full h-auto rounded-lg shadow-lg object-cover"
      />
    </div>
  </div>
)

// ---- SLIDE 7: COMPETITIVE LANDSCAPE -----------------------------------------
const landscapeContent = (
  <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center gap-6 text-hyve-header">
    <div>
      <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
        Every alternative makes a trade-off. Hyve makes none.
      </p>
      <p className="text-xs md:text-sm italic text-hyve-text/60 mt-2">
        The industry is shifting from simulation to reality. The existing instrumentation stack was not built for that transition.
      </p>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-hyve-text/15">
            <th className="py-2 pr-3 text-xs font-semibold text-hyve-text/80">Method</th>
            <th className="py-2 pr-3 text-xs font-semibold text-hyve-text/80 text-center">Invasive?</th>
            <th className="py-2 pr-3 text-xs font-semibold text-hyve-text/80 text-center">Reusable?</th>
            <th className="py-2 pr-3 text-xs font-semibold text-hyve-text/80 text-center">Real-time?</th>
            <th className="py-2 pr-3 text-xs font-semibold text-hyve-text/80 text-center">Full-surface?</th>
            <th className="py-2 text-xs font-semibold text-hyve-text/80 text-center">Real-world?</th>
          </tr>
        </thead>
        <tbody className="text-xs md:text-sm text-hyve-text">
          <tr className="border-b border-hyve-text/10">
            <td className="py-2.5 pr-3">Pressure taps</td>
            <td className="py-2.5 pr-3 text-center">✅ Yes</td>
            <td className="py-2.5 pr-3 text-center">✅ <span className="text-[9px] text-hyve-text/40 block">(infrastructure)</span></td>
            <td className="py-2.5 pr-3 text-center">✅ Yes</td>
            <td className="py-2.5 pr-3 text-center">❌ No</td>
            <td className="py-2.5 text-center">❌ Tunnel only</td>
          </tr>
          <tr className="border-b border-hyve-text/10">
            <td className="py-2.5 pr-3">Pressure-sensitive paint</td>
            <td className="py-2.5 pr-3 text-center">❌ Single-use</td>
            <td className="py-2.5 pr-3 text-center">❌</td>
            <td className="py-2.5 pr-3 text-center">❌ No</td>
            <td className="py-2.5 pr-3 text-center">✅ Yes</td>
            <td className="py-2.5 text-center">❌ Lab only</td>
          </tr>
          <tr className="border-b border-hyve-text/10">
            <td className="py-2.5 pr-3">CFD</td>
            <td className="py-2.5 pr-3 text-center">—</td>
            <td className="py-2.5 pr-3 text-center">—</td>
            <td className="py-2.5 pr-3 text-center">✅ Yes</td>
            <td className="py-2.5 pr-3 text-center">✅ Yes</td>
            <td className="py-2.5 text-center">❌ Simulated</td>
          </tr>
          <tr className="border-b border-hyve-text/10">
            <td className="py-2.5 pr-3">Discrete strain gauges</td>
            <td className="py-2.5 pr-3 text-center">✅ Yes</td>
            <td className="py-2.5 pr-3 text-center">✅</td>
            <td className="py-2.5 pr-3 text-center">✅ Yes</td>
            <td className="py-2.5 pr-3 text-center">❌ No</td>
            <td className="py-2.5 text-center">✅ Yes</td>
          </tr>
          <tr className="bg-hyve-header/5">
            <td className="py-2.5 pr-3 font-bold">Hyve Haptic Matrix</td>
            <td className="py-2.5 pr-3 text-center font-bold">❌ No</td>
            <td className="py-2.5 pr-3 text-center font-bold">✅</td>
            <td className="py-2.5 pr-3 text-center font-bold">✅ Yes</td>
            <td className="py-2.5 pr-3 text-center font-bold">✅ Yes</td>
            <td className="py-2.5 text-center font-bold">✅ Yes</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p className="text-xs md:text-sm text-hyve-text leading-relaxed">
      The Haptic Matrix is not a better version of any of these. It is a different category entirely.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-hyve-text/15 pt-4">
      <div>
        <p className="text-xs font-semibold text-hyve-header mb-1">Commercial model</p>
        <p className="text-xs text-hyve-text/70 leading-relaxed">Legacy vendors sell hardware SKUs — capital on the customer's books. Hyve sells a subscription to surface data.</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-hyve-header mb-1">The macro shift</p>
        <p className="text-xs text-hyve-text/70 leading-relaxed">Aerospace is moving from design-by-simulation to design-by-data. Hydrogen propulsion, blended wing bodies, and next-gen UAVs need surfaces with no validated simulation history.</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-hyve-header mb-1">Defence dimension</p>
        <p className="text-xs text-hyve-text/70 leading-relaxed">The same embedded sensing that monitors a commercial fuselage monitors a combat UAV airframe. Dual-use is structural, not incidental.</p>
      </div>
    </div>
  </div>
)

// ---- SLIDE 8: TEAM ----------------------------------------------------------
const teamContent = (
  <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center gap-6 text-hyve-header">
    <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
      Built by the people who know exactly what is broken — because they spent their careers working around it.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border-t border-hyve-text/15 pt-5">
      <div>
        <p className="text-sm font-semibold text-hyve-header">Hristiana Georgieva</p>
        <p className="text-xs text-hyve-text/60 mb-1">Co-Founder &amp; Co-CEO</p>
        <p className="text-xs text-hyve-text leading-relaxed">Enterprise software sales, strategic partnerships, and complex global negotiations. Drives commercial strategy, customer acquisition, and partnership network.</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-hyve-header">Juan Sebastian Conde</p>
        <p className="text-xs text-hyve-text/60 mb-1">Co-Founder &amp; Chief Scientist</p>
        <p className="text-xs text-hyve-text leading-relaxed">PhD, Cranfield. Aerospace research across NASA, Boeing, Airbus, Rolls-Royce. Invented the Haptic Matrix from first principles. Leads core R&amp;D, IP, and sensor science.</p>
      </div>
      
      <div>
        <p className="text-sm font-semibold text-hyve-header">Jonathan Michael Theodore</p>
        <p className="text-xs text-hyve-text/60 mb-1">Co-Founder &amp; Co-CEO</p>
        <p className="text-xs text-hyve-text leading-relaxed">Co-CEO from 2024. Head of Product since 2019. PhD, King's College London; Oxford BA &amp; MSt. Product roadmap, platform packaging, corporate development, and investor positioning.</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-hyve-header">Parker Webb-Mitchell</p>
        <p className="text-xs text-hyve-text/60 mb-1">CTO</p>
        <p className="text-xs text-hyve-text leading-relaxed">Technology vision across hardware, software, data infrastructure, and DaaS. ~9 years at nCino (EMEA): presales engineering, solution architecture, and scaling teams.</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-hyve-header">Paul Evans</p>
        <p className="text-xs text-hyve-text/60 mb-1">Chief Revenue Officer</p>
        <p className="text-xs text-hyve-text leading-relaxed">At Hyve since 2021. ~35 years leading B2B sales at Oracle (CX SaaS) and IFS (UK — including Aerospace &amp; Defence). Complex deals and OEM-class accounts.</p>
      </div>
    </div>

    <div className="border-t border-hyve-text/15 pt-4">
      <p className="text-xs font-semibold text-hyve-text/60 uppercase tracking-wider mb-3">Advisors</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs font-semibold text-hyve-header">David Rajan</p>
          <p className="text-xs text-hyve-text/70 leading-relaxed">Co-founder &amp; former CEO, Opteran. Deep tech robotics. Scaling discipline and partnership pattern recognition.</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-hyve-header">Qi Zhang</p>
          <p className="text-xs text-hyve-text/70 leading-relaxed">Ikerbasque Research Professor, BCMaterials; Senior Lecturer, Cranfield University. Functional materials, piezoelectric thin-film research.</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-hyve-header">Amin Amiri</p>
          <p className="text-xs text-hyve-text/70 leading-relaxed">Founder, A2E Venture Catalysts. M&amp;A and chairman-level leadership in UK aerospace supply chain. Harvard Business School. Investor in Hyve.</p>
        </div>
      </div>
    </div>

    <p className="text-xs md:text-sm text-hyve-text leading-relaxed border-t border-hyve-text/15 pt-4">
      <strong>Why us:</strong> Six years of PhD and postdoctoral research. Four patents granted. Validated by Airbus in a live wind tunnel programme. Active testing with Red Bull Racing, Alpine, Aston Martin and British Cycling. Already inside this market, not approaching it from the outside.
    </p>
  </div>
)

// ---- SLIDE 9: CAPITAL ROADMAP -----------------------------------------------
const capitalContent = (
  <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center gap-6 text-hyve-header">
    <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
      This £3.5M raise has one job: get Hyve to Series A with proof that the platform scales.
    </p>

    <div className="border-t border-hyve-text/15 pt-4">
      <p className="text-sm font-semibold text-hyve-header mb-3">Where we are today — TRL 6</p>
      <ul className="list-disc list-inside space-y-1.5 text-xs md:text-sm text-hyve-text leading-relaxed">
        <li>Haptic Matrix demonstrated in a relevant environment: Airbus Filton wind tunnel, live programme model</li>
        <li>Active testing partnerships: Red Bull Racing, Alpine, Aston Martin · British Cycling</li>
        <li>Airbus open invitation to test on any active wind tunnel programme model</li>
        <li>Four patents granted + two filed applications · IP moat established</li>
        <li>Platform architecture and DaaS model defined · no revenue yet</li>
      </ul>
    </div>

    <div>
      <p className="text-sm font-semibold text-hyve-header mb-3">What £3.5M delivers — 24-month milestones</p>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-hyve-text/15">
            <th className="py-2 pr-4 text-xs font-semibold text-hyve-text/80">Milestone</th>
            <th className="py-2 pr-4 text-xs font-semibold text-hyve-text/80">Target</th>
            <th className="py-2 text-xs font-semibold text-hyve-text/80">Signal to Series A</th>
          </tr>
        </thead>
        <tbody className="text-xs md:text-sm text-hyve-text">
          <tr className="border-b border-hyve-text/10">
            <td className="py-2.5 pr-4">V4 peel-and-stick at TRL 9</td>
            <td className="py-2.5 pr-4 font-semibold">Month 12</td>
            <td className="py-2.5">Mode 1 production-ready — technical risk removed</td>
          </tr>
          <tr className="border-b border-hyve-text/10">
            <td className="py-2.5 pr-4">Embedded solution at TRL 7</td>
            <td className="py-2.5 pr-4 font-semibold">Month 18</td>
            <td className="py-2.5">Mode 2 de-risked — manufacturing channel established</td>
          </tr>
          <tr className="border-b border-hyve-text/10">
            <td className="py-2.5 pr-4">£1.1M ARR</td>
            <td className="py-2.5 pr-4 font-semibold">Month 24</td>
            <td className="py-2.5">Named pipeline converted — revenue proof</td>
          </tr>
          <tr>
            <td className="py-2.5 pr-4">3+ paying customers across aerospace &amp; motorsport</td>
            <td className="py-2.5 pr-4 font-semibold">Month 24</td>
            <td className="py-2.5">Multi-sector revenue — not a single-customer story</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 border-t border-hyve-text/15 pt-4">
      <div className="text-center">
        <p className="text-lg md:text-xl font-bold text-hyve-header">60%</p>
        <p className="text-xs text-hyve-text/60">Team / People</p>
        <p className="text-xs text-hyve-text/40">£2.10M</p>
      </div>
      <div className="text-center">
        <p className="text-lg md:text-xl font-bold text-hyve-header">22%</p>
        <p className="text-xs text-hyve-text/60">R&amp;D + Hardware</p>
        <p className="text-xs text-hyve-text/40">£770K</p>
      </div>
      <div className="text-center">
        <p className="text-lg md:text-xl font-bold text-hyve-header">7%</p>
        <p className="text-xs text-hyve-text/60">Cloud + Software</p>
        <p className="text-xs text-hyve-text/40">£245K</p>
      </div>
      <div className="text-center">
        <p className="text-lg md:text-xl font-bold text-hyve-header">5%</p>
        <p className="text-xs text-hyve-text/60">Go-to-Market</p>
        <p className="text-xs text-hyve-text/40">£175K</p>
      </div>
      <div className="text-center">
        <p className="text-lg md:text-xl font-bold text-hyve-header">4%</p>
        <p className="text-xs text-hyve-text/60">Legal / Ops</p>
        <p className="text-xs text-hyve-text/40">£140K</p>
      </div>
      <div className="text-center">
        <p className="text-lg md:text-xl font-bold text-hyve-header">2%</p>
        <p className="text-xs text-hyve-text/60">Contingency</p>
        <p className="text-xs text-hyve-text/40">£70K</p>
      </div>
    </div>

    <div className="border-t border-hyve-text/15 pt-4 text-xs text-hyve-text leading-relaxed space-y-1">
      <p className="font-semibold text-hyve-header text-sm mb-2">The funding ladder</p>
      <p><strong>£3.5M Seed</strong> → <strong>Series A £8–12M</strong> → <strong>Series B £25M+</strong> → <strong>Exit / IPO</strong></p>
      <p className="text-hyve-text/60">Series A trigger: £1.1M ARR · 3 paying customers · TRL 9 production</p>
      <p className="text-hyve-text/60">Series B trigger: £5M+ ARR · IVHM contracts signed · international GTM live</p>
    </div>
  </div>
)

// ---- SLIDE 10: THE ASK ------------------------------------------------------
const askContent = (
  <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center gap-8 text-hyve-header">
    <p className="text-xl md:text-[22px] font-semibold text-hyve-text leading-relaxed">
      Hyve is raising £3.5M Seed to take validated technology to production scale and prove the platform compounds.
    </p>

    <p className="text-2xl md:text-3xl font-bold">
      £3.5M · Seed · April 2026
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm font-semibold mb-2">What it funds</p>
        <p className="text-xs text-hyve-text/70 leading-relaxed">
          Production capability for Mode 1 (TRL 9) · TRL 7 for Mode 2 (embedded IVHM) · Data delivery stack · Pipeline conversion to £1.1M ARR · Commercial team to execute it.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">What it unlocks</p>
        <p className="text-xs text-hyve-text/70 leading-relaxed">
          Series A at defensible traction — live revenue, named customers across aerospace and defence, manufacturing channel established.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Why now</p>
        <p className="text-xs text-hyve-text/70 leading-relaxed">
          Clean Aviation, hydrogen propulsion, advanced UAVs, and next-generation defence platforms all require aerodynamic and structural data the existing stack cannot provide. The regulatory environment is moving toward embedded structural monitoring as a requirement, not an option.
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Why Hyve</p>
        <p className="text-xs text-hyve-text/70 leading-relaxed">
          Six years of research. Four patents. Demonstrated in a live Airbus wind tunnel programme. Active testing with Red Bull Racing, Alpine, Aston Martin and British Cycling. The technology is not theoretical. It is already working.
        </p>
      </div>
    </div>

    <p className="text-xs text-hyve-text/30 border-t border-hyve-text/15 pt-4">
      Hyve Dynamics Holdings Limited · Confidential · April 2026 · hyvedynamics.com
    </p>
  </div>
)

// ---- SLIDE 11: THANK YOU ----------------------------------------------------
const thankYouContent = (
  <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center items-center text-hyve-header text-center">
    <img
      src="/HD-Logo-dk2.svg"
      alt="Hyve Dynamics"
      className="h-16 md:h-20 w-auto mb-8"
    />
    <h2 className="text-3xl md:text-5xl font-heading font-normal leading-tight mb-4">
      Thank you
    </h2>
    <p className="text-base md:text-lg text-hyve-text/60">
      The nervous system for machines
    </p>
  </div>
)

// ---- SLIDES ARRAY ----------------------------------------------------------
const DECK_SLIDES: SlideConfig[] = [
  { id: 1, placeholder: 'Cover', variant: 'light', bg: bgSlides, content: coverContent },
  { id: 2, placeholder: 'Problem', variant: 'light', bg: bgSlides, content: problemContent },
  { id: 3, placeholder: 'Problem (cont.)', variant: 'light', bg: bgSlides, content: problemContContent },
  { id: 4, placeholder: 'Solution', variant: 'light', bg: bgSlides, content: solutionContent },
  { id: 5, placeholder: 'Platform', variant: 'light', bg: bgSlides, content: platformContent },
  { id: 6, placeholder: 'Market & Decacorn', variant: 'light', bg: bgSlides, content: marketContent },
  { id: 7, placeholder: 'Universality', variant: 'light', bg: bgSlides, content: universalityContent },
  { id: 8, placeholder: 'Traction', variant: 'light', bg: bgSlides, content: tractionContent },
  { id: 9, placeholder: 'Landscape', variant: 'light', bg: bgSlides, content: landscapeContent },
  { id: 10, placeholder: 'Team', variant: 'light', bg: bgSlides, content: teamContent },
  { id: 11, placeholder: 'Capital Roadmap', variant: 'light', bg: bgSlides, content: capitalContent },
  { id: 12, placeholder: 'The Ask', variant: 'light', bg: bgSlides, content: askContent },
  { id: 13, placeholder: 'Thank You', variant: 'light', bg: bgSlides, content: thankYouContent },
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
