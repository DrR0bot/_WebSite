import { Plane } from 'lucide-react'

import { IndustryPageFocused } from '@/components/pages/IndustryPageFocused'
import { getVideoPath } from '@/lib/assets'

const aerospaceData = {
  id: 'aerospace',
  title: 'Continuous Surface Monitoring for Aerospace Testing & Flight Validation',
  badge: 'AEROSPACE',
  tagline: '',
  description:
    'Hyve provides dense, real-time pressure, temperature, and strain data across aerodynamic and structural surfaces — enabling faster wind tunnel campaigns, improved CFD validation, and non-invasive in-flight instrumentation.',
  videoPath: getVideoPath('A320.webm'),
  featuresHeading: 'Aerospace Applications',
  features: [
    {
      title: 'Wind Tunnel Instrumentation',
      description:
        'Dense surface pressure mapping without drilling or extended installation time.',
    },
    {
      title: 'CFD Correlation & Validation',
      description:
        'High-frequency experimental data to improve model fidelity and reduce iteration cycles.',
    },
    {
      title: 'Flight Test Instrumentation',
      description:
        'Non-invasive adhesive deployment for rapid in-flight aerodynamic and structural measurement.',
    },
    {
      title: 'Composite & Structural Monitoring',
      description:
        'Surface strain and load mapping without embedded gauges or structural modification.',
    },
  ],
  summary:
    'By replacing costly and time-consuming wind tunnel testing and CFD validation, Hyve Dynamics provides aerodynamic innovation, reduces R&D costs, and enhances flight efficiency. Our cutting-edge sensor technology empowers aircraft manufacturers, defense agencies, and space exploration pioneers to push the boundaries of aerodynamic performance.',
  cta: 'Experience the future of aerospace data - powered by Hyve Dynamics.',
}

export const AerospacePage = () => {
  return (
    <IndustryPageFocused industry={aerospaceData}>
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-hyve-content/20 p-8 lg:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <Plane className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-hyve-header font-heading">
            Aerospace Testing
          </h3>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[
            { value: '40-60%', label: 'Lower instrumentation costs' },
            { value: '500+', label: 'Data points/sec vs 10-20' },
            { value: '<1 hour', label: 'Setup vs 1-2 days' },
            { value: 'Infinite', label: 'Repositioning without damage' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-hyve-content/10 rounded-xl">
              <div className="text-2xl font-bold text-hyve-header">{stat.value}</div>
              <div className="text-xs text-hyve-text/70 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-hyve-header/5 to-hyve-accent/10 rounded-2xl p-6 mb-6">
          <h4 className="text-lg font-semibold text-hyve-header mb-4">
            Example: Wind Tunnel Testing
          </h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-semibold text-hyve-text/60 mb-2">Legacy Approach</h5>
              <ul className="space-y-1 text-sm text-hyve-text/70">
                <li>• 20-30 pressure taps</li>
                <li>• 2 days installation</li>
                <li>• Limited spatial resolution</li>
              </ul>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-hyve-interactive mb-2">With Hyve</h5>
              <ul className="space-y-1 text-sm text-hyve-header font-medium">
                <li>• 100+ sensors per wing section</li>
                <li>• 1 hour deployment</li>
                <li>• Complete pressure distribution mapping</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 bg-white/70 rounded-xl border border-hyve-content/20">
            <h4 className="text-base font-semibold text-hyve-header mb-3">CFD Validation</h4>
            <p className="text-sm text-hyve-text/70 mb-3">
              High-cost CFD campaigns still require experimental validation. Hyve provides real-time validation with actual measured data.
            </p>
            <ul className="text-xs text-hyve-text/70 space-y-1">
              <li>• Identify correlation errors early</li>
              <li>• Reduce iteration cycles by 30-40%</li>
              <li>• Catch simulation errors before prototypes</li>
            </ul>
          </div>
          <div className="p-5 bg-white/70 rounded-xl border border-hyve-content/20">
            <h4 className="text-base font-semibold text-hyve-header mb-3">In-Flight Testing</h4>
            <p className="text-sm text-hyve-text/70 mb-3">
              Non-invasive bonding, rapid deployment for flight test campaigns, no structural modification required.
            </p>
            <ul className="text-xs text-hyve-text/70 space-y-1">
              <li>• New aircraft certification</li>
              <li>• Aerodynamic performance validation</li>
              <li>• Flutter testing</li>
            </ul>
          </div>
        </div>
      </div>
    </IndustryPageFocused>
  )
}
