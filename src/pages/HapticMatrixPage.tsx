import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Zap,
  Layers,
  Shield,
  Calendar,
  Plane,
  Car,
  GraduationCap,
  FileText,
  Settings,
  Gauge,
} from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { SEO } from '@/components/common/SEO'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CustomMeshBackground } from '@/components/ui/CustomMeshBackground'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
}

// Helper to trigger contact form
const triggerContactForm = () => {
  const contactButton = document.querySelector(
    '[data-contact-trigger]'
  ) as HTMLButtonElement
  if (contactButton) {
    contactButton.click()
  }
}

export const HapticMatrixPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen relative">
      <SEO
        title="Haptic Matrix Technology"
        description="The Haptic Matrix is a conformable, high-density sensing platform delivering real-time pressure, temperature and strain data. Ultra-thin at 0.33mm, deployable in under an hour."
        keywords="Haptic Matrix, sensor array, pressure mapping, temperature sensing, strain measurement, ultra-thin sensors, real-time data, Hyve Dynamics"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Product',
              name: 'Haptic Matrix',
              alternateName: 'Hyve Haptic Matrix sensor array',
              category: 'Industrial sensor array',
              description:
                'Ultra-thin (0.33 mm) conformable flexible sensor array delivering simultaneous real-time pressure, temperature, and strain measurement across aerodynamic and structural surfaces. Multi-modal, high-density (100+ sensing nodes per array), reusable, and deployable in under one hour.',
              brand: {
                '@type': 'Brand',
                name: 'Hyve Dynamics',
              },
              manufacturer: {
                '@type': 'Organization',
                name: 'Hyve Dynamics',
                url: 'https://www.hyvedynamics.com',
              },
              url: 'https://www.hyvedynamics.com/haptic-matrix',
              image: 'https://www.hyvedynamics.com/MatrixMesh-r5.png',
              additionalProperty: [
                { '@type': 'PropertyValue', name: 'Substrate thickness', value: '0.33 mm' },
                { '@type': 'PropertyValue', name: 'Sensing modalities', value: 'Pressure, temperature, strain (simultaneous)' },
                { '@type': 'PropertyValue', name: 'Sensing nodes per array', value: '100+' },
                { '@type': 'PropertyValue', name: 'Deployment time', value: 'Under 1 hour' },
                { '@type': 'PropertyValue', name: 'Reusability', value: 'Repositionable without surface damage' },
                { '@type': 'PropertyValue', name: 'Validation', value: 'Tier 1 aerospace wind tunnel testing' },
              ],
              audience: {
                '@type': 'BusinessAudience',
                audienceType: 'Aerospace OEMs, motorsport teams, automotive OEMs, energy infrastructure operators, robotics integrators',
              },
            },
          ],
        }}
      />
      <CustomMeshBackground
        enabled={true}
        className="min-h-screen"
        blur={true}
        blurIntensity="sm"
      >
        {/* ============================================ */}
        {/* SECTION 1: HERO */}
        {/* ============================================ */}
        <section className="relative min-h-[70vh] flex items-center py-16 lg:py-20 pointer-events-auto">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Link
                to="/"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-hyve-text hover:text-hyve-accent transition-colors group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Link>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Left Content */}
              <div>
                <motion.div variants={itemVariants} className="mb-6">
                  <Badge
                    variant="secondary"
                    className="px-4 py-1 text-sm font-medium"
                  >
                    TECHNOLOGY DEEP DIVE
                  </Badge>
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-hyve-header mb-4 font-heading"
                >
                  Hyve Haptic Matrix Technology
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="text-lg md:text-xl text-hyve-text font-light mb-6 leading-relaxed"
                >
                  Hyve Haptic Matrix represents a new class of non-invasive, multi-parameter surface monitoring platforms for real-time aerodynamic intelligence and structural health monitoring — deployed as a subscription service combining conformable sensing hardware, calibration, and structured data delivery.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-hyve-text hover:bg-hyve-text-dark text-white"
                    onClick={triggerContactForm}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Demo
                  </Button>
                </motion.div>
              </div>

              {/* Right Visual - Product Image + Stats Column */}
              <motion.div
                variants={itemVariants}
                className="relative flex items-center justify-center gap-4"
              >
                {/* Product Image - No background */}
                <div className="relative max-w-[350px]">
                  <img
                    src={`${import.meta.env.BASE_URL}MatrixMesh-r5.png`}
                    alt="Hyve Haptic Matrix - Flexible sensor array showing 10x10 grid configuration on Kapton substrate"
                    className="w-full h-auto object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Key Stats - Right Column */}
                <div className="flex flex-col gap-3">
                  <div className="text-center p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-hyve-content/20">
                    <div className="text-xl font-bold text-hyve-header font-mono">
                      0.33mm
                    </div>
                    <div className="text-[10px] text-hyve-text/70">
                      Thickness
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-hyve-content/20">
                    <div className="text-xl font-bold text-hyve-header font-mono">
                      +120Hz
                    </div>
                    <div className="text-[10px] text-hyve-text/70">
                      Sampling
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-hyve-content/20">
                    <div className="text-xl font-bold text-hyve-header font-mono">
                      ±1.5%
                    </div>
                    <div className="text-[10px] text-hyve-text/70">
                      Accuracy
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 2: TECHNICAL OVERVIEW */}
        {/* ============================================ */}
        <section
          id="overview"
          className="relative py-16 lg:py-20 pointer-events-auto"
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-hyve-content/20 p-8 lg:p-12"
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-hyve-header mb-6 font-heading"
              >
                What Is the Hyve Haptic Matrix?
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-hyve-text/80 leading-relaxed mb-8"
              >
                The Hyve Haptic Matrix is a conformable, ultra-thin (0.33mm) surface sensing array that integrates directly onto aerodynamic and structural surfaces to provide dense, real-time measurement of pressure, temperature, and strain.
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-hyve-text/80 leading-relaxed mb-4"
              >
                It enables non-invasive deployment without drilling, structural modification, or embedded wiring — delivering full-surface insight in testing and operational environments.
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-hyve-text/80 leading-relaxed mb-8"
              >
                Inspired by biological sensing, the architecture prioritises distributed measurement density to capture surface behaviour rather than isolated points.
              </motion.p>

              {/* Core Innovation */}
              <motion.div variants={itemVariants} className="mb-8">
                <h3 className="text-xl font-semibold text-hyve-header mb-4">
                  Core Innovation
                </h3>
                <p className="text-sm text-hyve-text/70 mb-4">
                  Traditional surface instrumentation often requires structural penetration, embedded wiring, or complex optical systems. Hyve replaces this with a conformable, non-invasive MEMS-based sensing architecture, enabling:
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      icon: Gauge,
                      title: 'Bidirectional pressure sensing (±10kPa standard range)',
                      text: 'Captures both positive pressure and suction to resolve true surface loading behaviour.',
                    },
                    {
                      icon: Layers,
                      title: 'Multi-parameter measurement',
                      text: 'Simultaneous pressure, temperature, and strain acquisition from a single deployed surface array.',
                    },
                    {
                      icon: Shield,
                      title: 'Non-invasive integration',
                      text: 'Adhesive surface bonding with no drilling, structural penetration, or composite modification.',
                    },
                    {
                      icon: Settings,
                      title: 'Rapid repositionable deployment',
                      text: 'Deploy, test, remove, and redeploy within minutes in controlled testing environments.',
                    },
                    {
                      icon: Zap,
                      title: 'Real-time synchronized streaming',
                      text: 'kHz-level sampling with low-latency output for live aerodynamic and structural analysis.',
                    },
                  ].map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-hyve-content/10 rounded-lg"
                      >
                        <Icon className="h-4 w-4 text-hyve-interactive flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium text-hyve-header block">
                            {item.title}
                          </span>
                          <span className="text-xs text-hyve-text/70">
                            {item.text}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Development History */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-semibold text-hyve-header mb-4">
                  Development History
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-hyve-interactive/10 to-hyve-accent/10 rounded-xl">
                    <div className="text-2xl font-bold text-hyve-header">
                      8 years
                    </div>
                    <div className="text-xs text-hyve-text/70 mt-1">
                      PhD + post-doctoral research (Cranfield University)
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-hyve-interactive/10 to-hyve-accent/10 rounded-xl">
                    <div className="text-2xl font-bold text-hyve-header">
                      15+ years
                    </div>
                    <div className="text-xs text-hyve-text/70 mt-1">
                      Aerospace and complex systems experience
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-hyve-interactive/10 to-hyve-accent/10 rounded-xl">
                    <div className="text-2xl font-bold text-hyve-header">
                      6 patents
                    </div>
                    <div className="text-xs text-hyve-text/70 mt-1">
                      Granted + filed applications
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-hyve-interactive/10 to-hyve-accent/10 rounded-xl">
                    <div className="text-2xl font-bold text-hyve-header">
                      Validated
                    </div>
                    <div className="text-xs text-hyve-text/70 mt-1">
                      Deployed in high-performance testing environments
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTIONS 3-12 TEMPORARILY REMOVED                          */}
        {/* Archived in docs/HapticMatrixPage-archived-content.md      */}
        {/* pending technology refinement.                              */}
        {/* ============================================ */}

        {/* ============================================ */}
        {/* SECTION 13: CTAs */}
        {/* ============================================ */}
        <section
          id="contact"
          className="relative py-16 lg:py-20 pointer-events-auto"
        >
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-hyve-header mb-4 font-heading">
                  Next Steps
                </h2>
                <p className="text-base md:text-lg text-hyve-text/80 max-w-2xl mx-auto">
                  Ready to transform your aerodynamic testing and structural
                  monitoring? Choose the path that fits your needs.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Plane,
                    title: 'Aerospace OEMs & Test Facilities',
                    cta: 'Book Technical Demo',
                    desc: 'See the Hyve Haptic Matrix in action at our wind tunnel facility. We\'ll demonstrate real-time pressure mapping on your test article geometry.',
                  },
                  {
                    icon: Car,
                    title: 'Motorsport Teams',
                    cta: 'Request Performance Briefing',
                    desc: 'Engineered for F1 programmes targeting £2M+ annual wind tunnel cost reduction. Private ROI analysis based on your wind tunnel usage.',
                  },
                  {
                    icon: Shield,
                    title: 'Defense & Government',
                    cta: 'Arrange Cleared Discussion',
                    desc: 'ITAR-compliant solutions for classified programs. Hypersonic testing, UAV monitoring, survivability assessment.',
                  },
                  {
                    icon: GraduationCap,
                    title: 'Research Institutions',
                    cta: 'Explore Academic Programs',
                    desc: 'Academic pricing available. Discuss grant-funded research, PhD projects, and publication opportunities.',
                  },
                  {
                    icon: Settings,
                    title: 'Custom Applications',
                    cta: 'Contact Engineering',
                    desc: 'Extreme temperature ranges? Custom geometries? Proprietary system integration? Our engineering team can help.',
                  },
                  {
                    icon: FileText,
                    title: 'General Inquiries',
                    cta: 'Download Technical Datasheet',
                    desc: 'Get the full technical specifications, comparison guides, and application briefs in PDF format.',
                  },
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div key={index} variants={itemVariants}>
                      <Card className="h-full bg-white/95 backdrop-blur-xl border-hyve-content/20 hover:shadow-xl transition-shadow">
                        <CardContent className="p-6 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hyve-interactive/20 to-hyve-accent/20 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-hyve-interactive" />
                            </div>
                            <h3 className="text-base font-semibold text-hyve-header">
                              {item.title}
                            </h3>
                          </div>

                          <p className="text-sm text-hyve-text/70 mb-6 flex-grow">
                            {item.desc}
                          </p>

                          <Button
                            className="w-full bg-hyve-text hover:bg-hyve-text-dark text-white"
                            onClick={triggerContactForm}
                          >
                            {item.cta}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer spacing */}
        <div className="h-24" />
      </CustomMeshBackground>
    </div>
  )
}
