import { Plane } from 'lucide-react'

import { SEO } from '@/components/common/SEO'
import { IndustryPageFocused } from '@/components/pages/IndustryPageFocused'
import { getVideoPath } from '@/lib/assets'

const aerospaceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Aerospace surface instrumentation and structural monitoring',
  provider: {
    '@type': 'Organization',
    name: 'Hyve Dynamics',
    url: 'https://hyvedynamics.com',
  },
  areaServed: 'Worldwide',
  audience: {
    '@type': 'BusinessAudience',
    audienceType: 'Aerospace OEMs, defence contractors, wind tunnel operators, flight test programmes',
  },
  description:
    'Real-time, high-density pressure, temperature, and strain measurement on aerodynamic and structural surfaces for aerospace wind tunnel testing, CFD validation, flight test, and structural health monitoring.',
}

const aerospaceData = {
  id: 'aerospace',
  title: 'Continuous Surface Monitoring for Aerospace Testing & Flight Validation',
  badge: 'AEROSPACE',
  tagline: '',
  description:
    'Hyve provides dense, real-time pressure, temperature, and strain data across aerodynamic and structural surfaces — enabling faster wind tunnel campaigns, improved CFD correlation, and rapid non-invasive instrumentation for aerospace, defence, and advanced air mobility programmes.',
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
        'Non-invasive surface deployment enabling rapid aerodynamic and structural measurement during flight campaigns.',
    },
    {
      title: 'Defence & Unmanned Aerial Systems Testing',
      description:
        'Surface monitoring for UAV platforms, advanced air mobility vehicles, and defence test programmes.',
    },
    {
      title: 'Composite & Structural Monitoring',
      description:
        'Surface strain and load mapping without embedded gauges or structural modification.',
    },
  ],
  summary:
    'By simplifying instrumentation setup and increasing measurement density, Hyve reduces the time and cost of aerodynamic testing while improving experimental fidelity across wind tunnel and flight test environments.',
  cta: 'A new standard for real-time aerodynamic and structural measurement.',
}

export const AerospacePage = () => {
  return (
    <>
      <SEO
        title="Aerospace Sensing & Instrumentation"
        description="Hyve's Haptic Matrix delivers dense real-time pressure, temperature, and strain data on aerodynamic and structural surfaces — for wind tunnel testing, CFD correlation, flight test, defence UAS, and composite structural monitoring."
        keywords="aerospace sensors, wind tunnel instrumentation, CFD validation, flight test, structural health monitoring, composite monitoring, UAV sensing, Haptic Matrix, Hyve Dynamics"
        jsonLd={aerospaceJsonLd}
      />
      <IndustryPageFocused industry={aerospaceData}>
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-hyve-content/20 p-8 lg:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <Plane className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-hyve-header font-heading">
            Measured Impact in Aerospace Test Campaigns
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
            High-Density Wind Tunnel Instrumentation
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
            <h4 className="text-base font-semibold text-hyve-header mb-3">CFD Correlation & Validation</h4>
            <p className="text-sm text-hyve-text/70 mb-3">
              High-cost CFD campaigns still require experimental validation. Hyve provides dense, real-time surface measurement to strengthen model correlation and identify aerodynamic discrepancies earlier in the development cycle.
            </p>
            <ul className="text-xs text-hyve-text/70 space-y-1">
              <li>• Identify correlation errors early</li>
              <li>• Reduce iteration cycles by 30–40%</li>
              <li>• Validate simulation assumptions before prototype build</li>
            </ul>
          </div>
          <div className="p-5 bg-white/70 rounded-xl border border-hyve-content/20">
            <h4 className="text-base font-semibold text-hyve-header mb-3">Flight Test Instrumentation</h4>
            <p className="text-sm text-hyve-text/70 mb-3">
              Hyve enables rapid deployment of surface instrumentation without drilling or structural modification, making it suitable for temporary or campaign-based flight testing.
            </p>
            <p className="text-xs text-hyve-text/60 mb-2 font-medium">Applications include:</p>
            <ul className="text-xs text-hyve-text/70 space-y-1">
              <li>• Aircraft certification campaigns</li>
              <li>• Aerodynamic performance validation</li>
              <li>• Flutter and structural load testing</li>
            </ul>
          </div>
        </div>
      </div>
    </IndustryPageFocused>
    </>
  )
}
