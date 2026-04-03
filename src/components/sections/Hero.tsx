import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { HapticMatrixAnimation } from '@/components/ui/HapticMatrixAnimation'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export const Hero = () => {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden pointer-events-none py-16 lg:py-20">
      {/* Asymmetric Layout Container */}
      <div
        className="relative z-10 w-full mx-auto px-4 sm:px-6 lg:px-12"
        style={{ maxWidth: '1600px' }}
      >
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-24 items-center justify-items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left relative"
          >
            {/* Subtle background for text contrast */}
            <div className="absolute inset-0 -m-8 bg-gradient-to-br from-hyve-background/40 to-transparent backdrop-blur-sm rounded-2xl" />

            <div className="relative z-10">
              {/* Subtle accent line */}
              <motion.div variants={itemVariants} className="w-12 h-[2px] bg-hyve-accent mb-8" />

              {/* Main Headline */}
              <motion.h1
                variants={itemVariants}
                className="flex flex-col gap-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight leading-[1.1] mb-6"
              >
                <span className="text-hyve-text">
                  Intelligent Surface Monitoring Platform for <span className="font-medium">Real-Time</span>.
                </span>
                <span className="text-hyve-text">
                  Aerodynamic and Infrastructure<span className="font-medium">Data</span>.
                </span>
              </motion.h1>

              {/* Refined Subheadline */}
              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-hyve-text/70 max-w-lg mb-2 font-light leading-relaxed"
              >
                Conformable sensing arrays delivering high-density pressure, temperature and
                strain data in real time.
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-hyve-text/70 max-w-lg mb-10 font-light leading-relaxed"
              >
                Proven in Tier 1 aerospace testing. Built for every industry where surface behaviour matters.
              </motion.p>

              {/* Elegant CTA Group */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 pointer-events-auto items-center"
              >
                <Button
                  size="sm"
                  className="group bg-transparent border border-hyve-text text-hyve-text hover:bg-hyve-text hover:text-white px-5 py-3 sm:px-7 sm:py-4 lg:px-8 lg:py-5 transition-all duration-300 w-auto"
                  onClick={() => navigate('/haptic-matrix')}
                >
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-light tracking-wide">
                    Explore Technology
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>

                <button
                  className="text-sm text-hyve-text/60 hover:text-hyve-accent transition-colors duration-300 text-left pointer-events-auto"
                  onClick={() => window.open('mailto:info@hyvedynamics.com', '_blank')}
                >
                  Book Demo →
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Haptic Matrix Animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full max-w-[650px] h-[380px] sm:h-[460px] md:h-[540px] lg:h-[620px] justify-self-center lg:justify-self-center mx-auto"
          >
            {/* Subtle background for visual consistency with left side */}
            <div className="absolute inset-0 -m-8 bg-gradient-to-br from-hyve-background/40 to-transparent backdrop-blur-sm rounded-2xl" />

            {/* Haptic Matrix Interactive Animation */}
            <div className="relative z-10 w-full h-full">
              <HapticMatrixAnimation className="pointer-events-auto" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Minimal scroll indicator - bottom center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-hyve-text/30" />
        </motion.div>
      </motion.div>

      {/* Very subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-hyve-background/5 via-transparent to-transparent" />
    </section>
  )
}
