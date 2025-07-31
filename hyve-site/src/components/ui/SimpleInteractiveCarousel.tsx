import { motion, AnimatePresence } from 'framer-motion'
import { Plane, Car, Wind, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'

// Industry data structure
interface Industry {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  shortDescription: string
  fullDescription: string
  color: string
  features: string[]
}

// Industry definitions
const INDUSTRIES: Industry[] = [
  {
    id: 'aerospace',
    name: 'Aerospace',
    icon: Plane,
    shortDescription: 'Real-time aerodynamic intelligence for next-gen aircraft',
    fullDescription: 'Transform aerospace design with high-resolution pressure data that captures flow phenomena in real-time, enabling unprecedented optimization of aircraft performance.',
    color: '#0ea5e9',
    features: ['Flight envelope optimization', 'Real-time control surfaces', 'Turbulence monitoring'],
  },
  {
    id: 'motorsport',
    name: 'Motorsport',
    icon: Car,
    shortDescription: 'Precision aerodynamics for competitive advantage',
    fullDescription: 'Gain the edge in motorsport with flexible pressure sensors that conform to complex geometries, providing teams with actionable aerodynamic insights.',
    color: '#f59e0b',
    features: ['Active aero control', 'Drag reduction systems', 'Downforce optimization'],
  },
  {
    id: 'energy',
    name: 'Renewable Energy',
    icon: Wind,
    shortDescription: 'Maximizing efficiency for sustainable power generation',
    fullDescription: 'Optimize wind turbine performance and structural health with distributed pressure sensing that adapts to blade deformation and environmental conditions.',
    color: '#10b981',
    features: ['Blade load monitoring', 'Wind pattern analysis', 'Predictive maintenance'],
  },
  {
    id: 'structural',
    name: 'Structural Health',
    icon: Shield,
    shortDescription: 'Reliable sensing in extreme conditions',
    fullDescription: 'Monitor structural integrity in real-time with robust sensors that maintain accuracy under extreme temperatures, pressures, and environmental conditions.',
    color: '#8b5cf6',
    features: ['Fatigue detection', 'Load distribution', 'Environmental resilience'],
  },
]

export const SimpleInteractiveCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndustry = INDUSTRIES[currentIndex]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % INDUSTRIES.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + INDUSTRIES.length) % INDUSTRIES.length)
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-hyve-content/10 to-transparent rounded-2xl overflow-hidden border border-hyve-content/20">
        <div className="relative h-[600px] p-8 flex items-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${currentIndustry.color} 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Main Content */}
          <div className="relative z-10 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndustry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full"
                  style={{ backgroundColor: `${currentIndustry.color}20` }}
                >
                  {React.createElement(currentIndustry.icon, {
                    className: 'w-12 h-12',
                    style: { color: currentIndustry.color }
                  })}
                </motion.div>

                {/* Industry Name */}
                <h3 className="text-3xl font-bold mb-4 text-hyve-text">
                  {currentIndustry.name}
                </h3>

                {/* Short Description */}
                <p className="text-lg text-hyve-text/80 mb-6 max-w-2xl mx-auto">
                  {currentIndustry.shortDescription}
                </p>

                {/* Full Description */}
                <p className="text-hyve-text/60 mb-8 max-w-3xl mx-auto">
                  {currentIndustry.fullDescription}
                </p>

                {/* Features */}
                <div className="flex justify-center gap-6 flex-wrap">
                  {currentIndustry.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-4 py-2 rounded-full border"
                      style={{ borderColor: `${currentIndustry.color}40` }}
                    >
                      <span className="text-sm text-hyve-text/70">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-hyve-background/50 backdrop-blur-sm border border-hyve-content/20 hover:bg-hyve-background/70 transition-colors"
            aria-label="Previous industry"
          >
            <ChevronLeft className="w-6 h-6 text-hyve-text" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-hyve-background/50 backdrop-blur-sm border border-hyve-content/20 hover:bg-hyve-background/70 transition-colors"
            aria-label="Next industry"
          >
            <ChevronRight className="w-6 h-6 text-hyve-text" />
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="pb-6 flex justify-center space-x-2">
          {INDUSTRIES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-hyve-accent w-8'
                  : 'bg-hyve-content/30 hover:bg-hyve-content/50'
              }`}
              aria-label={`Go to ${INDUSTRIES[index].name}`}
            />
          ))}
        </div>
      </div>

      {/* Callout Annotations */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {currentIndex === 0 && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute left-0 top-1/4"
              >
                <div className="flex items-center">
                  <div className="w-12 h-[1px] bg-hyve-accent"></div>
                  <div className="bg-hyve-background/90 backdrop-blur-sm rounded-lg p-2 ml-2">
                    <p className="text-xs text-hyve-text">High-density sensor array</p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-0 bottom-1/3"
              >
                <div className="flex items-center">
                  <div className="bg-hyve-background/90 backdrop-blur-sm rounded-lg p-2 mr-2">
                    <p className="text-xs text-hyve-text">Real-time data streaming</p>
                  </div>
                  <div className="w-12 h-[1px] bg-hyve-accent"></div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}