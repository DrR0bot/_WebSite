import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'

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
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Centered Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center relative"
        >
          {/* Subtle background for text contrast */}
          <div className="absolute inset-0 -m-8 bg-gradient-to-br from-hyve-background/40 to-transparent backdrop-blur-sm rounded-2xl pointer-events-none" />

          <div className="relative z-10 pointer-events-auto">
            {/* Centered accent line */}
            <motion.div
              variants={itemVariants}
              className="w-16 h-[2px] bg-hyve-accent mb-8 mx-auto"
            />

            {/* Main Headline - Better distributed */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-extralight leading-[1.1] mb-8"
            >
              <span className="block text-hyve-text mb-2">Adaptation Through Insight.</span>
              <span className="block text-hyve-text mb-4">Evolution Through Data.</span>
            </motion.h1>

            {/* Refined Subheadline - Centered and wider */}
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-hyve-text/70 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
            >
              Hyve&apos;s Haptic Matrix unlocks real-world, high-density data where it matters
              most—fueling insight, driving innovation, and enabling intelligent evolution across
              machines, vehicles, and structures.
            </motion.p>

            {/* Elegant CTA Group - Centered */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pointer-events-auto"
            >
              <Button
                size="lg"
                className="group bg-transparent border border-hyve-text text-hyve-text hover:bg-hyve-text hover:text-white px-8 py-5 transition-all duration-300"
                onClick={() => {
                  document.getElementById('technology')?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }}
              >
                <span className="flex items-center gap-2 text-sm font-light tracking-wide">
                  Explore Technology
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>

              <button
                className="text-sm text-hyve-text/60 hover:text-hyve-accent transition-colors duration-300 pointer-events-auto"
                onClick={() => window.open('mailto:info@hyvedynamics.com', '_blank')}
              >
                Get in Touch →
              </button>
            </motion.div>
          </div>
        </motion.div>
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