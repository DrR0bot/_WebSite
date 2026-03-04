import { Car } from 'lucide-react'

import { IndustryPageFocused } from '@/components/pages/IndustryPageFocused'
import { getVideoPath } from '@/lib/assets'

const automotiveData = {
  id: 'automotive',
  title: 'Automotive Innovation',
  badge: 'AUTOMOTIVE',
  tagline: 'Driving the Future of Automotive Innovation',
  description:
    'Real-Time Aerodynamic & Structural Data for Superior Performance. At Hyve Dynamics, we revolutionize automotive testing with real-time, high-density aerodynamic, thermal, and structural data.',
  videoPath: getVideoPath('F1-Car.webm'),
  features: [
    {
      title: 'Real-Time Performance Insights',
      description: 'Captures aerodynamic, thermal, and structural data dynamically.',
    },
    {
      title: 'Ultra-Thin & Non-Intrusive',
      description: '0.33 mm sensor conforms to any vehicle shape without affecting airflow.',
    },
    {
      title: 'High-Density Sensing',
      description: 'Over 100 sensors per 24 cm² for unparalleled data resolution.',
    },
    {
      title: 'Optimized Design & Efficiency',
      description:
        'Supports electric vehicle range extension, motorsports performance tuning, and fuel economy improvements.',
    },
    {
      title: 'Enhanced Safety & Durability',
      description:
        'Detects strain, temperature fluctuations, and aerodynamic inefficiencies to improve vehicle reliability.',
    },
  ],
  summary:
    'By eliminating the limitations of traditional wind tunnel testing and CFD simulations, Hyve Dynamics provides automakers and motorsports teams with real-world, real-time data to accelerate R&D, reduce costs, and enhance performance.',
  cta: 'Power the next generation of automotive excellence with Hyve Dynamics.',
}

export const AutomotivePage = () => {
  return (
    <IndustryPageFocused industry={automotiveData}>
      {/* Motorsport Performance */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-hyve-content/20 p-8 lg:p-10 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
            <Car className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-hyve-header font-heading">
            Motorsport Performance
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { title: 'Real-time downforce mapping', desc: 'Monitor pressure across wings, floor, bodywork during track sessions' },
            { title: 'Brake duct optimization', desc: 'Temperature + pressure for cooling validation' },
            { title: 'DRS validation', desc: 'Quantify pressure changes when rear wing activates' },
            { title: 'Tunnel-to-track correlation', desc: 'Identical sensors in tunnel and on-car' },
          ].map((item, index) => (
            <div key={index} className="p-4 bg-hyve-content/10 rounded-xl">
              <h4 className="text-sm font-semibold text-hyve-header mb-2">{item.title}</h4>
              <p className="text-xs text-hyve-text/70">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-red-500/5 to-orange-500/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-hyve-header mb-3">
            2026 Regulation Reset Advantage
          </h4>
          <p className="text-sm text-hyve-text/70 mb-4">
            New technical rules create development race. Faster iteration between wind tunnel, CFD, and track testing = more performance updates = championship positions.
          </p>
          <div className="text-center">
            <div className="text-2xl font-bold text-hyve-header">£14M+ cumulative value</div>
            <div className="text-xs text-hyve-text/70">2026-2030 for top team</div>
          </div>
        </div>
      </div>

      {/* Automotive (EV & ICE) */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-hyve-content/20 p-8 lg:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
            <Car className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-hyve-header font-heading">
            Automotive (EV & ICE)
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 bg-hyve-content/10 rounded-xl">
            <h4 className="text-base font-semibold text-hyve-header mb-3">EV Range Optimization</h4>
            <p className="text-sm text-hyve-text/70 mb-3">
              Every watt of aero drag reduces range. Full-surface pressure mapping identifies drag sources (mirrors, A-pillar, underbody).
            </p>
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-lg font-bold text-hyve-header">2-5% drag reduction</div>
              <div className="text-xs text-hyve-text/70">= 10-25 miles additional range</div>
            </div>
          </div>

          <div className="p-5 bg-hyve-content/10 rounded-xl">
            <h4 className="text-base font-semibold text-hyve-header mb-3">Thermal Management</h4>
            <p className="text-sm text-hyve-text/70 mb-3">
              Battery cooling, motor thermal limits, cabin HVAC efficiency. Simultaneous pressure + temperature mapping.
            </p>
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-lg font-bold text-hyve-header">Optimized airflow</div>
              <div className="text-xs text-hyve-text/70">Without weight penalty</div>
            </div>
          </div>

          <div className="p-5 bg-hyve-content/10 rounded-xl">
            <h4 className="text-base font-semibold text-hyve-header mb-3">High-Speed Stability</h4>
            <p className="text-sm text-hyve-text/70 mb-3">
              Quantified lift/downforce distribution at speed. Identify separation points causing instability.
            </p>
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-lg font-bold text-hyve-header">Improved safety</div>
              <div className="text-xs text-hyve-text/70">Reduced warranty claims</div>
            </div>
          </div>
        </div>
      </div>
    </IndustryPageFocused>
  )
}
