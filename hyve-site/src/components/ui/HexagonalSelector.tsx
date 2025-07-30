import { motion } from 'framer-motion'
import { Plane, Car, Wind, Shield } from 'lucide-react'
import React, { useState } from 'react'

// Industry data structure
export interface Industry {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  shortDescription: string
  sellingPoints: string[]
  ctaText: string
  ctaLink: string
  sideIndex: number // Which side of the hexagon (0-5)
}

// Industry definitions mapped to hexagon sides
export const INDUSTRIES: Industry[] = [
  {
    id: 'aerospace',
    name: 'Aerospace',
    icon: Plane,
    shortDescription: 'Real-time aerodynamic intelligence for next-gen aircraft',
    sellingPoints: [
      'Surface integration on any aircraft geometry',
      'Multi-parameter monitoring (pressure, temperature, strain)',
      'In-flight data collection without interference',
    ],
    ctaText: 'Explore Aerospace Solutions',
    ctaLink: '/industries/aerospace',
    sideIndex: 0, // Top
  },
  {
    id: 'motorsport',
    name: 'Motorsport',
    icon: Car,
    shortDescription: 'Precision aerodynamics for competitive advantage',
    sellingPoints: [
      'Real-time airflow analysis for maximum performance',
      'Critical temperature monitoring for reliability',
      'Data-driven insights for superior vehicle performance',
    ],
    ctaText: 'Discover Motorsport Tech',
    ctaLink: '/industries/motorsport',
    sideIndex: 1, // Top-right
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: Wind,
    shortDescription: 'Maximizing efficiency for sustainable power generation',
    sellingPoints: [
      'Real-time performance monitoring and adjustment',
      'Predictive maintenance for early issue detection',
      'Supporting net-zero initiatives through optimization',
    ],
    ctaText: 'Learn About Energy Solutions',
    ctaLink: '/industries/energy',
    sideIndex: 2, // Bottom-right
  },
  {
    id: 'structural',
    name: 'Structural Health Monitoring',
    icon: Shield,
    shortDescription: 'Reliable sensing in extreme conditions',
    sellingPoints: [
      'Engineered for harsh environments and extreme conditions',
      'Remote monitoring with long-term stability',
      'Mission-critical data acquisition and processing',
    ],
    ctaText: 'Explore Extreme Applications',
    ctaLink: '/industries/structural-health-monitoring',
    sideIndex: 3, // Bottom
  },
]

// Large hexagon with interactive sides
const LargeHexagon: React.FC<{
  size: number
  industries: Industry[]
  hoveredIndustry: Industry | null
  selectedIndustry: Industry | null
  onHoverSide: (industry: Industry | null) => void
  onSelectSide: (industry: Industry) => void
}> = ({ size, industries, hoveredIndustry, selectedIndustry, onHoverSide, onSelectSide }) => {
  const centerX = size / 2
  const centerY = size / 2
  const radius = size * 0.45 // Large hexagon radius

  // Calculate hexagon points
  const hexagonPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 60 - 90) * (Math.PI / 180) // Start from top
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    return { x, y, angle: i * 60 - 90 }
  })

  const hexagonPath = hexagonPoints.map(p => `${p.x},${p.y}`).join(' ')

  // 🎯 HEXAGON LABEL POSITIONING SYSTEM
  // ===================================
  // Calculate base positions for labels around the hexagon
  const getSideInfo = (sideIndex: number) => {
    // 📍 GLOBAL POSITIONING CONTROLS:
    // ===============================

    const labelRadius = radius + 60 // 🔄 DISTANCE FROM HEXAGON: Increase to move ALL labels further out
    //    Current: 60px from hexagon edge
    //    - Increase (e.g., 80) = labels further from hexagon
    //    - Decrease (e.g., 40) = labels closer to hexagon

    const labelAngle = (sideIndex * 60 - 30) * (Math.PI / 180) // 🔄 ANGLE CALCULATION
    //    -30 degrees centers labels on hexagon sides
    //    Don't change unless you understand trigonometry!

    // Calculate the base X,Y coordinates for this hexagon side
    const labelX = centerX + labelRadius * Math.cos(labelAngle)
    const labelY = centerY + labelRadius * Math.sin(labelAngle)

    return {
      labelX, // Base X coordinate (will be fine-tuned below)
      labelY, // Base Y coordinate (will be fine-tuned below)
      angle: sideIndex * 60 - 30,
    }
  }

  return (
    // 🎯 HEXAGON CONTAINER SIZING
    // ===========================
    // Current size: 400px hexagon + 120px padding = 520x520px total container
    // - Increase padding if labels get cut off at edges
    // - The SVG is offset by 60px to center the hexagon in the larger container
    <div className="relative" style={{ width: size + 120, height: size + 120 }}>
      <svg
        width={size + 120}
        height={size + 120}
        className="absolute inset-0"
        style={{ transform: 'translate(-40px, 30px)' }} // 🎯 HEXAGON CENTERING: Adjust if hexagon appears off-center
      >
        {/* SVG Filter for glow effect */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#0ea5e9" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Main hexagon outline - diffusive style with glow */}
        <polygon
          points={hexagonPath}
          className="fill-transparent stroke-hyve-content/60 transition-all duration-300"
          style={{
            strokeWidth: 4,
            strokeDasharray: '1 4',
            filter: 'url(#glow)',
          }}
          strokeLinejoin="round"
        />

        {/* Interactive side areas */}
        {industries.map(industry => {
          const point1 = hexagonPoints[industry.sideIndex]
          const point2 = hexagonPoints[(industry.sideIndex + 1) % 6]
          const isHovered = hoveredIndustry?.id === industry.id
          const isSelected = selectedIndustry?.id === industry.id

          // Create a thicker clickable area for each side
          const innerRadius = radius - 15
          const outerRadius = radius + 15

          const outerPoint1 = {
            x: centerX + outerRadius * Math.cos((industry.sideIndex * 60 - 90) * (Math.PI / 180)),
            y: centerY + outerRadius * Math.sin((industry.sideIndex * 60 - 90) * (Math.PI / 180)),
          }
          const outerPoint2 = {
            x:
              centerX +
              outerRadius * Math.cos(((industry.sideIndex + 1) * 60 - 90) * (Math.PI / 180)),
            y:
              centerY +
              outerRadius * Math.sin(((industry.sideIndex + 1) * 60 - 90) * (Math.PI / 180)),
          }
          const innerPoint1 = {
            x: centerX + innerRadius * Math.cos((industry.sideIndex * 60 - 90) * (Math.PI / 180)),
            y: centerY + innerRadius * Math.sin((industry.sideIndex * 60 - 90) * (Math.PI / 180)),
          }
          const innerPoint2 = {
            x:
              centerX +
              innerRadius * Math.cos(((industry.sideIndex + 1) * 60 - 90) * (Math.PI / 180)),
            y:
              centerY +
              innerRadius * Math.sin(((industry.sideIndex + 1) * 60 - 90) * (Math.PI / 180)),
          }

          const sideAreaPath = `${outerPoint1.x},${outerPoint1.y} ${outerPoint2.x},${outerPoint2.y} ${innerPoint2.x},${innerPoint2.y} ${innerPoint1.x},${innerPoint1.y}`

          return (
            <g key={industry.id}>
              {/* Clickable side area */}
              <polygon
                points={sideAreaPath}
                className={`cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'fill-hyve-interactive/20 stroke-hyve-interactive stroke-3'
                    : isHovered
                      ? 'fill-hyve-accent/15 stroke-hyve-accent stroke-2'
                      : 'fill-transparent stroke-transparent'
                }`}
                strokeLinejoin="round"
                onMouseEnter={() => onHoverSide(industry)}
                onMouseLeave={() => onHoverSide(null)}
                onClick={() => onSelectSide(industry)}
              />

              {/* Side highlight line */}
              <line
                x1={point1.x}
                y1={point1.y}
                x2={point2.x}
                y2={point2.y}
                className={`transition-all duration-300 ${
                  isSelected
                    ? 'stroke-hyve-interactive stroke-4'
                    : isHovered
                      ? 'stroke-hyve-accent stroke-3'
                      : 'stroke-transparent'
                }`}
                strokeLinecap="round"
              />
            </g>
          )
        })}
      </svg>

      {/* Industry labels positioned around the hexagon */}
      {industries.map(industry => {
        const sideInfo = getSideInfo(industry.sideIndex)
        const Icon = industry.icon
        const isHovered = hoveredIndustry?.id === industry.id
        const isSelected = selectedIndustry?.id === industry.id

        // 🎯 MANUAL POSITIONING CONTROLS
        // =====================================
        //
        // COORDINATE SYSTEM:
        // - leftOffset: Higher values = move RIGHT, Lower values = move LEFT
        // - topOffset: Higher values = move DOWN, Lower values = move UP
        // - labelWidth: Controls the width of the text container (affects text wrapping)
        //
        // ALIGNMENT TIPS:
        // - For labels that overflow right edge: DECREASE leftOffset
        // - For labels that are too far left: INCREASE leftOffset
        // - For labels too close to hexagon: DECREASE topOffset (for top) or INCREASE topOffset (for bottom)
        // - For labels too far from hexagon: INCREASE topOffset (for top) or DECREASE topOffset (for bottom)

        const alignmentClasses = 'items-center'
        let labelWidth = 100 // 📐 Label container width (adjust for text wrapping)
        let leftOffset = sideInfo.labelX - 50 // 📍 Default: center the 100px width container
        let topOffset = sideInfo.labelY - 35 // 📍 Default: center vertically

        // 🔧 FINE-TUNE POSITIONING FOR EACH INDUSTRY
        // ==========================================
        // Adjust these values to perfect the alignment for each industry label

        switch (industry.sideIndex) {
          case 0: // 🛩️ AEROSPACE (Top position)
            // ADJUST THESE VALUES TO MOVE AEROSPACE LABEL:
            leftOffset = sideInfo.labelX - 150 // ⬅️➡️ Horizontal: decrease to move LEFT, increase to move RIGHT
            topOffset = sideInfo.labelY - 80 // ⬆️⬇️ Vertical: decrease to move UP, increase to move DOWN
            labelWidth = 100 // 📏 Width: increase if text wraps, decrease to tighten
            break

          case 1: // 🏎️ MOTORSPORT (Top-right position)
            // ADJUST THESE VALUES TO MOVE MOTORSPORT LABEL:
            leftOffset = sideInfo.labelX - 65 // ⬅️➡️ Currently shifted LEFT to avoid right edge overflow
            topOffset = sideInfo.labelY - 120 // ⬆️⬇️ Currently moved UP from default position
            labelWidth = 100 // 📏 Width: adjust if "Motorsport" text doesn't fit well
            break

          case 2: // 🌱 RENEWABLE ENERGY (Bottom-right position)
            // ADJUST THESE VALUES TO MOVE RENEWABLE ENERGY LABEL:
            leftOffset = sideInfo.labelX + 45 // ⬅️➡️ Currently shifted LEFT to avoid overflow
            topOffset = sideInfo.labelY - 40 // ⬆️⬇️ Currently moved UP slightly from default
            labelWidth = 100 // 📏 Width: "Renewable Energy" is longer text
            break

          case 3: // 🛡️ HOSTILE ENVIRONMENTS (Bottom position)
            // ADJUST THESE VALUES TO MOVE HOSTILE ENVIRONMENTS LABEL:
            leftOffset = sideInfo.labelX - 20 // ⬅️➡️ Centered horizontally
            topOffset = sideInfo.labelY + 80 // ⬆️⬇️ Currently positioned closer to hexagon bottom
            labelWidth = 100 // 📏 Width: "Hostile Environments" may need more width
            break

          case 4: // 🔮 FUTURE INDUSTRY (Bottom-left position) - Currently unused
            // ADJUST THESE VALUES IF YOU ADD A 5TH INDUSTRY:
            leftOffset = sideInfo.labelX - 75 // ⬅️➡️ Pre-positioned for left side
            topOffset = sideInfo.labelY - 20 // ⬆️⬇️ Bottom-left positioning
            labelWidth = 100 // 📏 Width: adjust based on new industry name length
            break

          case 5: // 🔮 FUTURE INDUSTRY (Top-left position) - Currently unused
            // ADJUST THESE VALUES IF YOU ADD A 6TH INDUSTRY:
            leftOffset = sideInfo.labelX - 75 // ⬅️➡️ Pre-positioned for left side
            topOffset = sideInfo.labelY - 40 // ⬆️⬇️ Top-left positioning
            labelWidth = 100 // 📏 Width: adjust based on new industry name length
            break
        }

        // 💡 QUICK ADJUSTMENT GUIDE:
        // =========================
        // 1. Find the industry you want to adjust above
        // 2. Modify leftOffset: +/- 10-20 pixels for small adjustments
        // 3. Modify topOffset: +/- 10-20 pixels for small adjustments
        // 4. Modify labelWidth: 80-120 pixels typically work well
        // 5. Save and refresh to see changes

        return (
          <motion.div
            key={industry.id}
            className={`absolute flex flex-col ${alignmentClasses} cursor-pointer`}
            style={{
              left: leftOffset,
              top: topOffset,
              width: labelWidth,
            }}
            whileHover={{ scale: 1.05 }}
            onMouseEnter={() => onHoverSide(industry)}
            onMouseLeave={() => onHoverSide(null)}
            onClick={() => onSelectSide(industry)}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                isSelected
                  ? 'bg-hyve-interactive/20 text-hyve-interactive'
                  : isHovered
                    ? 'bg-hyve-accent/20 text-hyve-accent'
                    : 'bg-hyve-content/30 text-hyve-text'
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <span
              className={`text-xs font-medium text-center transition-all duration-300 leading-tight ${
                isSelected
                  ? 'text-hyve-interactive'
                  : isHovered
                    ? 'text-hyve-accent'
                    : 'text-hyve-text/80'
              }`}
            >
              {industry.name}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

// This component has been replaced by LargeHexagon

// Center display component - now with much more space!
const CenterDisplay: React.FC<{
  selectedIndustry: Industry | null
  hoveredIndustry: Industry | null
}> = ({ selectedIndustry, hoveredIndustry }) => {
  const displayIndustry = selectedIndustry || hoveredIndustry

  if (!displayIndustry) {
    // Default state - placeholder for future animation
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-6 w-80 h-80 flex flex-col items-center justify-center"
      >
        {/* Large space for future Blender animation */}
        <div className="w-64 h-48 bg-hyve-accent/5 rounded-2xl flex items-center justify-center border-2 border-dashed border-hyve-accent/20">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-hyve-accent/10 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-hyve-accent/30 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-light text-hyve-text">Animation Space</h3>
              <p className="text-xs text-hyve-text/70 max-w-xs">
                Your Blender animations will appear here
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      key={displayIndustry.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="text-center space-y-6 w-80 h-80 flex flex-col items-center justify-center"
    >
      {/* Large animation area */}
      <div className="w-64 h-48 bg-hyve-accent/5 rounded-2xl flex items-center justify-center border-2 border-dashed border-hyve-accent/30">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-hyve-accent/10 rounded-full flex items-center justify-center">
            <displayIndustry.icon className="w-10 h-10 text-hyve-accent" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-light text-hyve-text">{displayIndustry.name}</h3>
            <p className="text-xs text-hyve-text/80 leading-relaxed max-w-xs">
              {displayIndustry.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Quick info below animation area */}
      <div className="space-y-3">
        {selectedIndustry && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => {
              console.log(`Navigate to ${displayIndustry.ctaLink}`)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-hyve-accent text-hyve-accent hover:bg-hyve-accent hover:text-white transition-all duration-300 rounded-md text-sm font-medium"
          >
            {displayIndustry.ctaText}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

// Main hexagonal selector component
export const HexagonalSelector: React.FC = () => {
  const [hoveredIndustry, setHoveredIndustry] = useState<Industry | null>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null)

  const handleIndustryHover = (industry: Industry | null) => {
    setHoveredIndustry(industry)
  }

  const handleIndustrySelect = (industry: Industry) => {
    setSelectedIndustry(selectedIndustry?.id === industry.id ? null : industry)
  }

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div className="relative flex items-center justify-center">
        {/* Large hexagon with interactive sides */}
        <div className="absolute inset-0 flex items-center justify-center">
          <LargeHexagon
            size={400}
            industries={INDUSTRIES}
            hoveredIndustry={hoveredIndustry}
            selectedIndustry={selectedIndustry}
            onHoverSide={handleIndustryHover}
            onSelectSide={handleIndustrySelect}
          />
        </div>

        {/* Center display area - positioned in the center of the hexagon */}
        <div className="relative z-10 flex items-center justify-center">
          <CenterDisplay selectedIndustry={selectedIndustry} hoveredIndustry={hoveredIndustry} />
        </div>
      </div>
    </div>
  )
}
