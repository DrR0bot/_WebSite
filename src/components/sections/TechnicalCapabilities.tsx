import { motion } from 'framer-motion'
import { Gauge, Thermometer, Activity, ArrowRight, Layers, Cpu, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

// Animation variants - matching site patterns
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

// Physical specifications of the sensor
const physicalSpecs = [
  {
    label: 'Thickness',
    value: '0.33mm',
    detail: 'Ultra-thin flexible array',
  },
  {
    label: 'Sensing Elements',
    value: '2mm × 2mm',
    detail: 'Individual sensor nodes',
  },
  {
    label: 'Density',
    value: '100+ sensors',
    detail: 'In 24cm × 24cm area',
  },
  {
    label: 'Sampling',
    value: '+120Hz',
    detail: '500+ data points/sec',
  },
]

// What the sensor measures - core capabilities
const measurements = [
  {
    id: 'pressure',
    icon: Gauge,
    title: 'Bidirectional Pressure',
    spec: '±10kPa @ ±1.5%',
    description:
      'Captures both pressure AND suction. Most sensors only measure one direction. Hyve captures the complete aerodynamic picture.',
    iconColor: 'text-blue-600',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'temperature',
    icon: Thermometer,
    title: 'Temperature',
    spec: '-50°C to 150°C',
    description:
      'Full operating range with software compensation. From cryogenic wind tunnels to brake duct thermal management.',
    iconColor: 'text-amber-600',
    bgColor: 'from-amber-500/20 to-orange-500/20',
  },
  {
    id: 'strain',
    icon: Activity,
    title: 'Strain',
    spec: 'Real-time loads',
    description:
      'Surface deformation and structural loads. Transition seamlessly from aerodynamic testing to structural health monitoring.',
    iconColor: 'text-emerald-600',
    bgColor: 'from-emerald-500/20 to-teal-500/20',
  },
]

// Before vs After comparison data
const beforeHyve = [
  'Limited discrete measurement points',
  'Multi-day installation and preparation',
  'Structural penetration required',
  'Fixed deployment geometry',
  'Post-processing before analysis',
]

const withHyve = [
  '100+ sensing nodes within the same area',
  'Rapid deployment (<1 hour in testing environments)',
  'Non-invasive adhesive integration',
  'Repositionable architecture',
  'Continuous real-time data streaming',
]

export const TechnicalCapabilities = () => {
  return (
    <section
      className="relative py-12 lg:py-16 overflow-hidden pointer-events-none"
      id="technology"
    >
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
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
                Surface Monitoring Architecture
              </h2>
              <p className="text-base md:text-lg text-hyve-text/80 max-w-3xl mx-auto leading-relaxed">
                Hyve’s conformable surface array integrates directly onto aerodynamic and structural surfaces, enabling rapid, non-invasive deployment in testing environments while delivering real-time pressure, temperature, and strain data into a structured data platform.
              </p>
            </motion.div>

            {/* Physical Specs Row */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {physicalSpecs.map((spec, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white/60 rounded-xl border border-hyve-content/30"
                  >
                    <div className="text-xl md:text-2xl font-bold text-hyve-header font-mono">
                      {spec.value}
                    </div>
                    <div className="text-xs text-hyve-text/60 uppercase tracking-wide mt-1">
                      {spec.label}
                    </div>
                    <div className="text-xs text-hyve-text/50 mt-0.5">
                      {spec.detail}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* What It Is - Physical Description */}
            <motion.div
              variants={itemVariants}
              className="mb-8 pointer-events-auto"
            >
              <div className="bg-white/70 border border-hyve-content/40 rounded-2xl p-5 md:p-6">
                <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-hyve-interactive/10 flex items-center justify-center flex-shrink-0">
                      <Layers className="h-4 w-4 text-hyve-interactive" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-hyve-header">
                        Flexible Kapton Substrate
                      </h4>
                      <p className="text-xs text-hyve-text/70 mt-1">
                        Conforms to complex aerodynamic surfaces—wing leading
                        edges, control surfaces, fuselage contours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-hyve-interactive/10 flex items-center justify-center flex-shrink-0">
                      <Cpu className="h-4 w-4 text-hyve-interactive" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-hyve-header">
                        MEMS Array
                      </h4>
                      <p className="text-xs text-hyve-text/70 mt-1">
                        High-precision electromechanical sensors.
                        Each 4mm node is a precision instrument.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-hyve-interactive/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-4 w-4 text-hyve-interactive" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-hyve-header">
                        Integrated Electronics
                      </h4>
                      <p className="text-xs text-hyve-text/70 mt-1">
                        On-board signal conditioning and wireless/wired
                        transmission. No external amplifiers required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* What It Measures - Three Capabilities */}
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-lg font-semibold text-hyve-header mb-4 font-heading">
                Multi-Parameter Sensing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {measurements.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      className="p-4 bg-white/70 backdrop-blur-sm border border-hyve-content/50 rounded-xl hover:border-hyve-accent/50 transition-all duration-300 pointer-events-auto"
                    >
                      {/* Icon and Title Row */}
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${item.bgColor} flex items-center justify-center`}
                        >
                          <Icon className={`h-4 w-4 ${item.iconColor}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-hyve-header font-heading leading-tight">
                            {item.title}
                          </h4>
                          <span className="text-xs font-medium text-hyve-interactive font-mono">
                            {item.spec}
                          </span>
                        </div>
                      </div>
                      {/* Description */}
                      <p className="text-xs text-hyve-text/70 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            {/* Before vs After Comparison */}
            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-lg font-semibold text-hyve-header mb-4 font-heading">
                From Discrete Instrumentation to Continuous Surface Monitoring
              </h3>
              <p className="text-sm text-hyve-text/70 mb-4">
                Traditional instrumentation samples discrete points. Continuous surface monitoring captures surface behaviour.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before Hyve */}
                <div className="p-5 bg-hyve-text/5 border border-hyve-text/10 rounded-xl">
                  <h4 className="text-xs font-semibold text-hyve-text/50 uppercase tracking-wide mb-3">
                    Pressure Taps / Traditional
                  </h4>
                  <ul className="space-y-2">
                    {beforeHyve.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-hyve-text/60"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-hyve-text/30 mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* With Hyve */}
                <div className="p-5 bg-gradient-to-br from-hyve-interactive/10 to-hyve-accent/10 border border-hyve-accent/30 rounded-xl">
                  <h4 className="text-xs font-semibold text-hyve-interactive uppercase tracking-wide mb-3">
                    Hyve Surface Monitoring Platform
                  </h4>
                  <ul className="space-y-2">
                    {withHyve.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-hyve-header font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-hyve-interactive mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Key Statement + CTA */}
            <motion.div variants={itemVariants} className="pointer-events-auto">
              <div className="bg-gradient-to-r from-hyve-header/5 to-hyve-accent/10 border border-hyve-accent/30 rounded-2xl p-5 md:p-6">
                <div className="max-w-4xl mx-auto">
                  <p className="text-sm md:text-base text-hyve-header font-medium leading-relaxed text-center mb-4">
                    The first platform designed to combine full-surface coverage, real-time feedback, non-invasive deployment, and multi-parameter sensing — across both controlled testing and operational environments.
                  </p>
                  <div className="flex justify-center">
                    <Link
                      to="/haptic-matrix"
                      className="inline-flex items-center text-sm font-medium text-hyve-interactive hover:text-hyve-interactive-dark transition-colors group"
                    >
                      Full Technical Specifications
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
