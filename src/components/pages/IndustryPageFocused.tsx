import { motion } from 'framer-motion'
import { ArrowLeft, Download, Calendar } from 'lucide-react'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pagination, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/pagination'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CustomMeshBackground } from '@/components/ui/CustomMeshBackground'

interface IndustryPageProps {
  industry: {
    id: string
    title: string
    tagline: string
    description: string
    videoPath: string
    videoPaths?: string[]
    features: {
      title: string
      description: string
    }[]
    summary: string
    cta: string
    badge?: string
    featuresHeading?: string
  }
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export const IndustryPageFocused: React.FC<IndustryPageProps & { children?: React.ReactNode }> = ({ industry, children }) => {
  const navigate = useNavigate()

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen relative">
      <CustomMeshBackground enabled={true} className="min-h-screen" blur={true} blurIntensity="sm">
        {/* Main Content */}
        <section className="relative min-h-screen flex items-center py-20 pointer-events-auto">
          <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-8">
            {/* Single Container with all content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-hyve-content/20 overflow-hidden"
            >
              <div className="grid lg:grid-cols-2 h-full">
                {/* Left Side - Animation on top, content below */}
                <div className="p-8 lg:p-12 flex flex-col">
                  {/* Back Button */}
                  <motion.div variants={itemVariants} className="mb-6">
                    <Link
                      to="/"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-hyve-text hover:text-hyve-accent transition-colors group cursor-pointer pointer-events-auto"
                      style={{ position: 'relative', zIndex: 50 }}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      Back to Home
                    </Link>
                  </motion.div>

                  {/* Video Animation */}
                  <motion.div variants={itemVariants} className="mb-16 lg:mb-20">
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-hyve-accent/10 to-hyve-interactive/10 p-1">
                      {industry.videoPaths && industry.videoPaths.length > 1 ? (
                        <Swiper
                          modules={[Pagination, Autoplay]}
                          spaceBetween={0}
                          slidesPerView={1}
                          pagination={{
                            clickable: true,
                            bulletClass: 'swiper-pagination-bullet !bg-hyve-text/30 !w-2 !h-2 !mx-1',
                            bulletActiveClass: 'swiper-pagination-bullet-active !bg-hyve-text !w-2 !h-2',
                          }}
                          autoplay={{
                            delay: 8000,
                            disableOnInteraction: false,
                          }}
                          loop={true}
                          className="w-full rounded-xl"
                        >
                          {industry.videoPaths.map((path, idx) => (
                            <SwiperSlide key={idx}>
                              <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-auto rounded-xl"
                                style={{ maxHeight: '280px', objectFit: 'cover' }}
                              >
                                <source src={path} type="video/webm" />
                                Your browser does not support the video tag.
                              </video>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-auto rounded-xl"
                          style={{ maxHeight: '280px', objectFit: 'cover' }}
                        >
                          <source src={industry.videoPath} type="video/webm" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  </motion.div>

                  {/* Content below video */}
                  <div className="flex-1 flex flex-col">
                    {/* Badge */}
                    {industry.badge && (
                      <motion.div variants={itemVariants} className="mb-2">
                        <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
                          {industry.badge}
                        </Badge>
                      </motion.div>
                    )}

                    {/* Title */}
                    <motion.h1
                      variants={itemVariants}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold text-hyve-header mb-2 font-heading"
                    >
                      {industry.title}
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                      variants={itemVariants}
                      className="text-xl md:text-2xl text-hyve-text font-light mb-3"
                    >
                      {industry.tagline}
                    </motion.p>

                    {/* Description */}
                    <motion.p
                      variants={itemVariants}
                      className="text-base md:text-lg text-hyve-text/80 leading-relaxed mb-2 flex-1"
                    >
                      {industry.description}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                      <Button
                        size="lg"
                        className="bg-hyve-text hover:bg-hyve-text-dark text-white group"
                        onClick={() => {
                          // Trigger the contact form in the header
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
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-hyve-accent text-hyve-text hover:bg-hyve-accent/10"
                        onClick={() => {
                          // Navigate to insights/white-papers when available
                          navigate('/insights/white-papers')
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Whitepaper
                      </Button>
                    </motion.div>
                  </div>
                </div>

                {/* Right Side - Features */}
                <div className="bg-gradient-to-br from-hyve-content/30 to-hyve-accent/10 p-8 lg:p-12">
                  <motion.div variants={itemVariants}>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-8 font-heading">
                      {industry.featuresHeading || 'Key Features & Benefits'}
                    </h2>

                    <div className="space-y-4">
                      {industry.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="flex items-start space-x-4"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-hyve-interactive to-hyve-interactive-dark flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                            ✓
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-hyve-header mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-sm md:text-base text-hyve-text/80 leading-relaxed">
                              {feature.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Summary */}
                    <motion.div
                      variants={itemVariants}
                      className="mt-10 pt-8 border-t border-hyve-content/20"
                    >
                      <p className="text-sm md:text-base text-hyve-text/90 leading-relaxed mb-4">
                        {industry.summary}
                      </p>
                      <p className="text-lg md:text-xl font-semibold text-hyve-header font-heading">
                        {industry.cta}
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {children && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-8"
              >
                {children}
              </motion.div>
            )}
          </div>
        </section>
      </CustomMeshBackground>
    </div>
  )
}
