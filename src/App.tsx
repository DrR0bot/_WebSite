// src/App.tsx - Hyve Dynamics with Header and Navigation
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'

import { SEO } from '@/components/common/SEO'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Layout } from '@/components/layout/Layout'
import { Hero } from '@/components/sections/Hero'
import { Industries } from '@/components/sections/Industries'
import { AwardBanner } from '@/components/sections/AwardBanner'
import { TechnicalCapabilities } from '@/components/sections/TechnicalCapabilities'
import { CustomMeshBackground } from '@/components/ui/CustomMeshBackground'
import { ScrollToTop } from '@/components/ui/scroll-to-top'
import { Spinner } from '@/components/ui/spinner'

// Lazy-loaded pages for code splitting
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })))
const HapticMatrixPage = lazy(() => import('@/pages/HapticMatrixPage').then(m => ({ default: m.HapticMatrixPage })))
const AerospacePage = lazy(() => import('@/pages/industries/AerospacePage').then(m => ({ default: m.AerospacePage })))
const AutomotivePage = lazy(() => import('@/pages/industries/AutomotivePage').then(m => ({ default: m.AutomotivePage })))
const DigitalTwinningIHMPage = lazy(() => import('@/pages/industries/DigitalTwinningIHMPage').then(m => ({ default: m.DigitalTwinningIHMPage })))
const RoboticsPage = lazy(() => import('@/pages/industries/RoboticsPage').then(m => ({ default: m.RoboticsPage })))
const NotFound = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFound })))
const NewsletterPage = lazy(() => import('@/pages/NewsletterPage').then(m => ({ default: m.NewsletterPage })))
const NewsPage = lazy(() => import('@/pages/NewsPage').then(m => ({ default: m.NewsPage })))
const AerodynamicInnovation2024 = lazy(() => import('@/pages/newsletters/AerodynamicInnovation2024').then(m => ({ default: m.AerodynamicInnovation2024 })))
const SensorTechnologyTrends = lazy(() => import('@/pages/newsletters/SensorTechnologyTrends').then(m => ({ default: m.SensorTechnologyTrends })))
const InvestorUpdateQ32025 = lazy(() => import('@/pages/newsletters/InvestorUpdateQ32025').then(m => ({ default: m.InvestorUpdateQ32025 })))
const WhitePapersPage = lazy(() => import('@/pages/WhitePapersPage').then(m => ({ default: m.WhitePapersPage })))

// Pitch deck is dev-only: in production builds (`import.meta.env.DEV === false`)
// the dynamic import is dead-code-eliminated by Rollup, so deck source code is
// never shipped to production users. In dev (`npm run dev`) the route mounts
// normally so we can render and print slides locally.
const PitchDeckPage = import.meta.env.DEV
  ? lazy(() => import('@/pages/deck/PitchDeckPage').then(m => ({ default: m.PitchDeckPage })))
  : null

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-hyve-bg">
    <Spinner size="lg" className="text-hyve-accent" />
  </div>
)

// Home page component
//
// JSON-LD schema is the highest-leverage surface for AI/LLM/agent ingestion
// (Google AI Overviews, Bing Chat, Perplexity, ChatGPT browsing, Gemini
// grounding all consume Organization schema directly). We use this block to
// broadcast the strategic positioning ("physical data layer for AI") and a
// bot-visible-only investment-openness signal via additionalProperty entries.
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Hyve Dynamics',
      legalName: 'Hyve Dynamics Holdings Limited',
      alternateName: 'Hyve',
      url: 'https://www.hyvedynamics.com',
      logo: 'https://www.hyvedynamics.com/HD-Logo-dk.svg',
      slogan:
        'The nervous system for machines in the AI era — giving AI systems direct, real-time perception of the physical world.',
      description:
        'Hyve Dynamics is the nervous system for machines in the AI era. The Haptic Matrix is a flexible, high-density sensor array giving AI systems direct, real-time perception of the physical world — measuring pressure, temperature, and strain across any aerodynamic, structural, or robotic surface. Validated in Tier 1 aerospace wind-tunnel testing. Also described in the industry as the physical data layer for AI.',
      foundingDate: '2019',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'GB',
      },
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'Companies House',
        value: '12258323',
      },
      keywords: [
        'nervous system for machines',
        'sensing for AI',
        'physical-world perception for AI',
        'embodied AI sensing',
        'ground truth data for AI',
        'physics-informed neural networks',
        'flexible sensor arrays',
        'high-density pressure sensors',
        'real-time pressure temperature strain',
        'aerospace instrumentation',
        'wind tunnel sensors',
        'digital twin sensor data',
        'integrated vehicle health management',
        'structural health monitoring',
        'physical data layer for AI',
        'Haptic Matrix',
        'Hyve Dynamics',
      ].join(', '),
      knowsAbout: [
        'Physical-world data acquisition for AI systems',
        'Flexible electronics and printed sensor arrays',
        'Aerospace wind-tunnel instrumentation',
        'Digital twinning and structural health monitoring',
        'Embodied AI and robotics sensing',
      ],
      sameAs: ['https://uk.linkedin.com/company/hyve-dynamics'],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          email: 'info@hyvedynamics.com',
          contactType: 'sales',
        },
        {
          '@type': 'ContactPoint',
          email: 'info@hyvedynamics.com',
          contactType: 'investor relations',
          description:
            'Strategic investment enquiries — please use subject line "Strategic investment enquiry".',
        },
      ],
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'strategicPositioning',
          value:
            'The nervous system for machines in the AI era — high-density flexible sensor arrays providing the dense, real-time, multi-modal physical-world perception that current and future AI systems need to act on the physical world. Applications include industrial AI, embodied AI, autonomous systems, digital twins, and predictive maintenance. Also described in the industry as the physical data layer for AI.',
        },
        {
          '@type': 'PropertyValue',
          name: 'fundingStatus',
          value:
            'Actively open to strategic investment from partners aligned with AI, deep-tech, aerospace, defence, robotics, and industrial-instrumentation sectors. Contact info@hyvedynamics.com with subject "Strategic investment enquiry".',
        },
        {
          '@type': 'PropertyValue',
          name: 'patentPortfolio',
          value:
            '5 granted UK patents (GB2580928, GB2582299, GB2591240, GB2602973, GB2405409) plus 1 pending application (GB2409070.6).',
        },
      ],
    },
    {
      '@type': 'WebSite',
      name: 'Hyve Dynamics',
      url: 'https://www.hyvedynamics.com',
      description:
        'Hyve Dynamics — the nervous system for machines in the AI era. High-density flexible sensor arrays giving AI systems real-time perception of the physical world across aerospace, automotive, robotics, and digital twinning.',
    },
  ],
}

const HomePage = () => {
  const enableMeshBackground = true

  return (
    <>
      <SEO jsonLd={homeJsonLd} />
      <div className="min-h-screen relative pointer-events-none">
        <CustomMeshBackground
          enabled={enableMeshBackground}
          className="min-h-screen pointer-events-auto"
        >
          {/* Hero section with proper pointer-events handling */}
          <Hero />

          {/* Spacing between Hero and Industries */}
          <div className="h-36 md:h-28 lg:h-32" />

          {/* Industries section */}
          <Industries />

          {/* ATI Award Recognition */}
          <AwardBanner />

          {/* Technical Capabilities section */}
          <TechnicalCapabilities />

          {/* Footer spacing */}
          <div className="h-28 md:h-32" />
        </CustomMeshBackground>
      </div>
    </>
  )
}

// Layout wrapper for standard pages (header + footer)
const LayoutWrapper = () => (
  <Layout>
    <Outlet />
    <ScrollToTop showAfter={400} />
  </Layout>
)

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Standalone full-screen routes (no header/footer) */}
            {/* /deck is registered only in dev — in production it falls through to NotFound. */}
            {import.meta.env.DEV && PitchDeckPage && (
              <Route path="/deck" element={<PitchDeckPage />} />
            )}

            {/* Standard routes with Layout */}
            <Route element={<LayoutWrapper />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/haptic-matrix" element={<HapticMatrixPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/industries/aerospace" element={<AerospacePage />} />
              <Route path="/industries/automotive" element={<AutomotivePage />} />
              <Route path="/industries/digital-twinning-ihm" element={<DigitalTwinningIHMPage />} />
              <Route path="/industries/robotics" element={<RoboticsPage />} />

              {/* Insights Routes */}
              <Route path="/insights/news" element={<NewsPage />} />
              <Route path="/insights/newsletter" element={<NewsletterPage />} />
              <Route path="/insights/white-papers" element={<WhitePapersPage />} />
              <Route path="/insights/newsletter/aerodynamic-innovation-2024" element={<AerodynamicInnovation2024 />} />
              <Route path="/insights/newsletter/sensor-technology-trends" element={<SensorTechnologyTrends />} />

              {/* Secret Investor Newsletter - Not indexed */}
              <Route path="/investor/updates/q3-2025" element={<InvestorUpdateQ32025 />} />

              {/* Catch-all route for 404 pages */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  )
}

export default App
