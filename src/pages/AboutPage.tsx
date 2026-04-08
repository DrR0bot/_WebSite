import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Award,
  Calendar,
  Globe,
  Lightbulb,
  Shield,
} from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { SEO } from '@/components/common/SEO'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CustomMeshBackground } from '@/components/ui/CustomMeshBackground'

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

const timelineData = [
  {
    year: '2012\u20132018',
    title: 'Cranfield Research Programme',
    description:
      'Doctoral and postdoctoral research into high-density aerodynamic sensing and flexible sensor architectures.',
    highlight: 'Academic Foundation',
  },
  {
    year: '2018\u20132023',
    title: 'Private Sector Development',
    description:
      '5 years refining technology for commercial applications and securing multiple international patents.',
    highlight: 'Industry Refinement',
  },
  {
    year: '2023\u20132026',
    title: 'Commercial Launch & Aerospace Adoption',
    description:
      'First aerospace-grade flexible sensor deployments, ATI Innovation Award nomination, and growing presence across the wind tunnel testing and sustainable aviation communities.',
    highlight: 'Commercial Success',
  },
  {
    year: '2027',
    title: 'Cross-Industry Expansion',
    description:
      'Expanding applications across automotive development, industrial systems, and infrastructure monitoring.',
    highlight: 'Next Horizon',
  },
  {
    year: '2030',
    title: 'Surface Intelligence Platform',
    description:
      'Establishing surface intelligence as a foundational measurement layer for complex engineered systems.',
    highlight: 'Long-term Vision',
  },
]

const companyValues = [
  {
    title: 'Scientific Integrity',
    description:
      'Our work is grounded in rigorous research and experimental validation. We prioritise measurable evidence over assumptions and marketing claims.',
    icon: Shield,
  },
  {
    title: 'Engineering Excellence',
    description:
      'We design sensing systems for real-world performance \u2014 balancing precision, durability, and practical integration across complex engineering environments.',
    icon: Award,
  },
  {
    title: 'Meaningful Innovation',
    description:
      'We focus on solving fundamental measurement challenges rather than incremental improvements.',
    icon: Lightbulb,
  },
  {
    title: 'Sustainability',
    description:
      'Better measurement leads to better engineering decisions. Hyve supports the development of more efficient systems through improved testing, validation, and monitoring.',
    icon: Globe,
  },
]

export const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen relative">
      <SEO
        title="About Us"
        description="Hyve Dynamics is building the nervous system for machines. Learn about our mission to transform industries through conformable, high-density sensing technology."
        keywords="about Hyve Dynamics, sensor technology company, UK deeptech, haptic matrix, real-time sensing"
      />
      <CustomMeshBackground enabled={true} className="min-h-screen" blur={true} blurIntensity="sm">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center py-16 lg:py-20 pointer-events-auto">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <Link
                to="/"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-hyve-text hover:text-hyve-accent transition-colors group cursor-pointer pointer-events-auto"
                style={{ position: 'relative', zIndex: 50 }}
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </Link>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
                  ABOUT HYVE DYNAMICS
                </Badge>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-hyve-header mb-4 font-heading"
              >
                Pioneering Real-World Intelligence Since 2012
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-hyve-text font-light mb-6 max-w-3xl mx-auto"
              >
                Transforming industries through real-world surface intelligence.
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-hyve-text/80 leading-relaxed max-w-4xl mx-auto mb-4"
              >
                Hyve Dynamics builds flexible, high-density sensing arrays and a data platform that
                enable real-time surface intelligence.
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-hyve-text/80 leading-relaxed max-w-4xl mx-auto"
              >
                Originating from aerospace research at Cranfield University, the system captures
                pressure, temperature, and strain across complex surfaces — allowing engineers to
                observe physical behaviour directly rather than relying on sparse instrumentation and
                assumptions.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Research Foundations */}
        <section className="relative py-16 lg:py-20 pointer-events-auto">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-hyve-content/20 p-8 lg:p-12"
            >
              {/* Top row: Mission + Research Foundations side by side */}
              <div className="grid lg:grid-cols-2 gap-12 mb-8">
                {/* Mission */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl font-bold text-hyve-header mb-6 font-heading">
                    Our Mission
                  </h2>
                  <p className="text-base md:text-lg text-hyve-text/80 leading-relaxed mb-6">
                    To deliver a step change in how physical systems are observed and understood.
                  </p>
                  <p className="text-base md:text-lg text-hyve-text/80 leading-relaxed mb-6">
                    For decades, complex aerodynamic and structural behaviour has been studied through
                    sparse sensors and inferred models. Hyve enables continuous, high-density
                    measurements across real-world surfaces — replacing assumptions with direct insight
                    into how systems actually behave.
                  </p>
                  <p className="text-base md:text-lg text-hyve-text/80 leading-relaxed">
                    Our vision is to establish surface intelligence as a foundational data layer across
                    engineered systems — from aircraft and vehicles to infrastructure and intelligent
                    machines.
                  </p>
                </motion.div>

                {/* Research Foundations */}
                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl font-bold text-hyve-header mb-6 font-heading">
                    Research Foundations
                  </h2>
                  <p className="text-base text-hyve-text/80 leading-relaxed">
                    Hyve Dynamics originates from doctoral and postdoctoral research conducted at
                    Cranfield University, focused on high-density sensing and aerodynamic measurement.
                    The technology was developed to address a long-standing challenge in engineering:
                    complex physical behaviour occurs across entire surfaces, yet most measurement
                    systems capture only isolated data points.
                  </p>
                </motion.div>
              </div>

              {/* Bottom row: Three cards spanning full width */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-hyve-content/30 to-hyve-accent/10 rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-hyve-header mb-2">
                    Academic Foundation
                  </h3>
                  <p className="text-xs text-hyve-text/80">
                    6 years of doctoral and postdoctoral research at Cranfield University focused
                    on advanced sensing architectures for aerodynamic measurement and structural
                    monitoring.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-hyve-content/30 to-hyve-accent/10 rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-hyve-header mb-2">
                    Intellectual Property
                  </h3>
                  <p className="text-xs text-hyve-text/80">
                    Patent applications covering flexible sensing arrays, high-density measurement
                    architectures, and real-time surface data acquisition.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-hyve-content/30 to-hyve-accent/10 rounded-2xl p-5">
                  <h3 className="text-base font-semibold text-hyve-header mb-2">
                    Engineering Development
                  </h3>
                  <p className="text-xs text-hyve-text/80">
                    Laboratory and wind tunnel testing programmes validating sensing performance,
                    durability, and integration across aerodynamic surfaces.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="relative py-16 lg:py-20 pointer-events-auto">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-hyve-header mb-12 font-heading text-center"
              >
                Our Journey
              </motion.h2>

              <div className="relative">
                {/* Animated gradient timeline line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] transform -translate-x-1/2 hidden lg:block overflow-hidden origin-top">
                  <motion.div
                    className="w-full h-full"
                    style={{
                      background: 'linear-gradient(180deg, transparent 0%, #65a3b2 15%, #7FB3BE 50%, #65a3b2 85%, transparent 100%)',
                    }}
                    initial={{ opacity: 0, scaleY: 0 }}
                    whileInView={{ opacity: 1, scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </div>

                {timelineData.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className={`relative flex items-center mb-12 lg:mb-16 ${
                      index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                  >
                    <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                      <Card className="bg-white/95 backdrop-blur-xl border-hyve-content/20 hover:shadow-xl transition-shadow">
                        <CardContent className="p-6 lg:p-8">
                          <Badge variant="secondary" className="mb-3">
                            {item.highlight}
                          </Badge>
                          <h3 className="text-2xl font-bold text-hyve-header mb-2">{item.year}</h3>
                          <h4 className="text-xl font-semibold text-hyve-header mb-3">
                            {item.title}
                          </h4>
                          <p className="text-sm text-hyve-text/80">{item.description}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Animated node on timeline */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex items-center justify-center">
                      <motion.div
                        className="absolute w-8 h-8 rounded-full bg-hyve-interactive/20"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.1, 0.4] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.4 }}
                      />
                      <motion.div
                        className="w-4 h-4 rounded-full bg-gradient-to-br from-hyve-interactive to-hyve-accent border-[3px] border-white shadow-lg shadow-hyve-interactive/30"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.2, type: 'spring' }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Strategic Vision CTA */}
        <section className="relative py-16 lg:py-20 pointer-events-auto">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-hyve-content/20 p-8 lg:p-12 text-center"
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-hyve-header mb-4 font-heading"
              >
                Strategic Vision
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-hyve-text/80 leading-relaxed max-w-3xl mx-auto mb-8"
              >
                Hyve is building sensing infrastructure that enables continuous observation of
                physical systems. As sensing density increases and data platforms mature, surface
                intelligence will become a foundational data layer across engineering, infrastructure,
                and intelligent machines.
              </motion.p>

              <motion.div variants={itemVariants}>
                <Button
                  size="lg"
                  className="bg-hyve-text hover:bg-hyve-text-dark text-white group"
                  onClick={() => {
                    const contactButton = document.querySelector(
                      '[data-contact-trigger]'
                    ) as HTMLButtonElement
                    if (contactButton) {
                      contactButton.click()
                    }
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Demo
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Company Values */}
        <section className="relative py-16 lg:py-20 pointer-events-auto">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-4xl font-bold text-hyve-header mb-12 font-heading text-center"
              >
                Our Values
              </motion.h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {companyValues.map((value, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className="h-full bg-white/95 backdrop-blur-xl border-hyve-content/20 hover:shadow-xl transition-shadow">
                      <CardContent className="p-6 text-center">
                        <value.icon className="h-12 w-12 text-hyve-interactive mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-hyve-header mb-3">
                          {value.title}
                        </h3>
                        <p className="text-sm text-hyve-text/80">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
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
