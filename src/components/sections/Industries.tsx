import { motion } from 'framer-motion'
import { Plane, Car, Combine, Bot, ArrowRight, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Industry data
const industries = [
  {
    id: 'aerospace',
    title: 'Aerospace',
    icon: Plane,
    description: 'Wind tunnel instrumentation, flight test, and defence testing. Validated by Tier 1 OEMs.',
    href: '/industries/aerospace',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-600',
  },
  {
    id: 'automotive',
    title: 'Automotive & High-Performance Systems',
    icon: Car,
    description: 'Real-time aerodynamic performance and validation.',
    href: '/industries/automotive',
    color: 'from-red-500/20 to-orange-500/20',
    iconColor: 'text-red-600',
  },
  {
    id: 'digital-twinning-ihm',
    title: 'Infrastructure & IVHM',
    icon: Combine,
    description: 'Continuous structural and surface health monitoring. Embedded sensing for lifecycle monitoring of composite structures.',
    href: '/industries/digital-twinning-ihm',
    color: 'from-green-500/20 to-teal-500/20',
    iconColor: 'text-teal-600',
  },
  {
    id: 'robotics',
    title: 'Robotics & Adaptive Systems',
    icon: Bot,
    description: 'Distributed surface sensing for emerging tactile and environmental awareness applications in robotics and automation.',
    href: '/industries/robotics',
    color: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-600',
  },
]

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
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export const Industries = () => {
  return (
    <section
      className="relative py-12 lg:py-16 overflow-hidden pointer-events-none"
      id="industries"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        {/* Container with background */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          {/* Background container */}
          <div className="absolute inset-0 -m-8 bg-gradient-to-br from-white/90 to-hyve-content/30 backdrop-blur-md rounded-3xl shadow-xl" />

          <div className="relative z-10 px-8 py-8 lg:px-12 lg:py-10">
            {/* Section Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-hyve-header mb-4 font-heading">
                Surface Intelligence Across Critical Systems
              </h2>
              <p className="text-base md:text-lg text-hyve-text/80 max-w-2xl mx-auto">
                Hyve enables continuous high-density surface measurement and monitoring across aerospace testing environments, operational infrastructure, advanced vehicles and emerging robotic systems.
              </p>
            </motion.div>

            {/* Industries Grid - More compact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {industries.map((industry, index) => {
                const Icon = industry.icon
                return (
                  <motion.div
                    key={industry.id}
                    variants={itemVariants}
                    custom={index}
                    className="pointer-events-auto"
                  >
                    <Link to={industry.href}>
                      <Card className="h-full p-4 sm:p-5 lg:p-5 bg-white/90 backdrop-blur-sm border-hyve-content/50 hover:border-hyve-accent transition-all duration-300 hover:shadow-lg group cursor-pointer min-h-[120px]">
                        <div className="flex flex-col items-center text-center h-full">
                          {/* Icon */}
                          <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon
                              className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-7 lg:w-7 ${industry.iconColor}`}
                            />
                          </div>

                          {/* Title */}
                          <h3 className="text-base sm:text-lg lg:text-lg font-semibold text-hyve-header mb-2 font-heading">
                            {industry.title}
                          </h3>

                          {/* Description - Show on larger screens */}
                          <p className="hidden sm:block text-sm text-hyve-text/70 leading-relaxed mb-3 flex-grow">
                            {industry.description}
                          </p>

                          {/* Learn More - Compact */}
                          <div className="flex items-center text-hyve-interactive text-sm font-medium group-hover:text-hyve-interactive-dark transition-colors mt-auto">
                            <span>Explore</span>
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* CTA */}
            <motion.div variants={itemVariants} className="text-center mt-8">
              <p className="text-base text-hyve-text/80 mb-4">
                Ready to revolutionize your industry?
              </p>
              <Button
                size="default"
                className="bg-hyve-text hover:bg-hyve-text-dark text-white pointer-events-auto"
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
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
