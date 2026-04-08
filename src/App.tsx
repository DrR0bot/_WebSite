// src/App.tsx - Hyve Dynamics with Header and Navigation
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

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
const InvestorUpdateAugust2025 = lazy(() => import('@/pages/newsletters/InvestorUpdateAugust2025').then(m => ({ default: m.InvestorUpdateAugust2025 })))
const WhitePapersPage = lazy(() => import('@/pages/WhitePapersPage').then(m => ({ default: m.WhitePapersPage })))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-hyve-bg">
    <Spinner size="lg" className="text-hyve-accent" />
  </div>
)

// Home page component
const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Hyve Dynamics',
      url: 'https://hyvedynamics.com',
      logo: 'https://hyvedynamics.com/HD-Logo-dk.svg',
      description:
        'Conformable, high-density sensing arrays delivering real-time pressure, temperature and strain data across aerospace, automotive, energy and robotics industries.',
      sameAs: ['https://uk.linkedin.com/company/hyve-dynamics'],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'info@hyvedynamics.com',
        contactType: 'sales',
      },
    },
    {
      '@type': 'WebSite',
      name: 'Hyve Dynamics',
      url: 'https://hyvedynamics.com',
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

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Layout>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/haptic-matrix" element={<HapticMatrixPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/industries/aerospace" element={<AerospacePage />} />
              <Route path="/industries/automotive" element={<AutomotivePage />} />
              <Route path="/industries/digital-twinning-ihm" element={<DigitalTwinningIHMPage />} />
              <Route path="/industries/energy" element={<DigitalTwinningIHMPage />} />
              <Route path="/industries/structural-health" element={<DigitalTwinningIHMPage />} />
              <Route path="/industries/robotics" element={<RoboticsPage />} />
              
              {/* Insights Routes */}
              <Route path="/insights/news" element={<NewsPage />} />
              <Route path="/insights/newsletter" element={<NewsletterPage />} />
              <Route path="/insights/white-papers" element={<WhitePapersPage />} />
              <Route path="/insights/newsletter/aerodynamic-innovation-2024" element={<AerodynamicInnovation2024 />} />
              <Route path="/insights/newsletter/sensor-technology-trends" element={<SensorTechnologyTrends />} />
              
              {/* Secret Investor Newsletter - Not indexed */}
              <Route path="/investor/updates/august-2025" element={<InvestorUpdateAugust2025 />} />
              
              {/* Catch-all route for 404 pages */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <ScrollToTop showAfter={400} />
      </Layout>
    </Router>
  )
}

export default App
