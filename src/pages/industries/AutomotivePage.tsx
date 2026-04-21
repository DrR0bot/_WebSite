import { Car } from 'lucide-react'

import { SEO } from '@/components/common/SEO'
import { IndustryPageFocused } from '@/components/pages/IndustryPageFocused'
import { getVideoPath } from '@/lib/assets'

const automotiveJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Automotive and motorsport surface instrumentation',
  provider: {
    '@type': 'Organization',
    name: 'Hyve Dynamics',
    url: 'https://www.hyvedynamics.com',
  },
  areaServed: 'Worldwide',
  audience: {
    '@type': 'BusinessAudience',
    audienceType: 'Automotive OEMs, motorsport teams (including Formula 1), EV manufacturers, vehicle aerodynamics teams',
  },
  description:
    'Real-time pressure, temperature, and strain mapping across vehicle surfaces for aerodynamic development, downforce mapping, EV thermal management, and tunnel-to-track correlation.',
}

const automotiveData = {
  id: 'automotive',
  title: 'Continuous Surface Monitoring for Vehicle Aerodynamics & Performance Development',
  badge: 'AUTOMOTIVE & HIGH-PERFORMANCE VEHICLES',
  tagline: '',
  description:
    'Hyve provides dense, real-time pressure, temperature, and strain data across vehicle surfaces — enabling faster aerodynamic development, improved wind tunnel correlation, and real-world performance validation.',
  videoPath: getVideoPath('F1-Car.webm'),
  featuresHeading: 'Key Features & Benefits',
  features: [
    {
      title: 'Real-Time Surface Data',
      description:
        'High-frequency measurement of aerodynamic pressure, thermal behaviour, and structural loads during wind tunnel or track testing.',
    },
    {
      title: 'Ultra-Thin & Non-Intrusive',
      description:
        '0.33 mm flexible sensor arrays conform to vehicle surfaces without affecting airflow or structural integrity.',
    },
    {
      title: 'High-Density Measurement',
      description:
        '100+ sensing nodes per array capture continuous pressure distribution rather than discrete measurement points.',
    },
    {
      title: 'Accelerated Development Cycles',
      description:
        'Reduce iteration time between CFD, wind tunnel testing, and track validation.',
    },
    {
      title: 'EV Efficiency Insights',
      description:
        'Identify aerodynamic drag sources and thermal inefficiencies affecting vehicle range and cooling performance.',
    },
  ],
  summary:
    'Hyve enables high-resolution surface instrumentation for automotive aerodynamics, motorsport development, and EV efficiency optimisation. Non-invasive sensor arrays deploy in under an hour, delivering real-time pressure, thermal, and structural data across complex vehicle geometries.',
  cta: 'Hyve enables faster aerodynamic development across motorsport, EV platforms, and next-generation high-performance vehicles.',
}

export const AutomotivePage = () => {
  return (
    <>
      <SEO
        title="Automotive & Motorsport Aerodynamic Sensing"
        description="Hyve's Haptic Matrix delivers real-time pressure, thermal, and strain data across vehicle surfaces — for motorsport aerodynamic development, EV efficiency optimisation, downforce mapping, and tunnel-to-track correlation."
        keywords="automotive aerodynamics, motorsport sensors, Formula 1 sensors, EV efficiency, downforce mapping, brake duct, active aero, tunnel-to-track, Haptic Matrix, Hyve Dynamics"
        jsonLd={automotiveJsonLd}
      />
      <IndustryPageFocused industry={automotiveData}>
      {/* Motorsport Aerodynamic Development */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-hyve-content/20 p-8 lg:p-10 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
            <Car className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-hyve-header font-heading">
            Motorsport Aerodynamic Development
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { title: 'Real-Time Downforce Mapping', desc: 'Measure pressure distribution across wings, floor, and bodywork during track testing.' },
            { title: 'Brake Duct Optimisation', desc: 'Simultaneous temperature and pressure measurement to validate cooling airflow.' },
            { title: 'Active Aero Validation', desc: 'Quantify pressure changes during aerodynamic state transitions.' },
            { title: 'Tunnel-to-Track Correlation', desc: 'Use identical instrumentation across wind tunnel and on-track testing.' },
          ].map((item, index) => (
            <div key={index} className="p-4 bg-hyve-content/10 rounded-xl">
              <h4 className="text-sm font-semibold text-hyve-header mb-2">{item.title}</h4>
              <p className="text-xs text-hyve-text/70">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-red-500/5 to-orange-500/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-hyve-header mb-3">
            Regulation Cycle Development Advantage
          </h4>
          <p className="text-sm text-hyve-text/70 mb-4">
            Major regulation changes across motorsport categories trigger rapid aerodynamic development cycles. Faster iteration between CFD, wind tunnel testing, and track validation creates measurable performance advantage.
          </p>
          <div className="text-center">
            <div className="text-2xl font-bold text-hyve-header">£14M+ potential performance value</div>
            <div className="text-xs text-hyve-text/70">Estimated impact from aerodynamic performance gains across regulation cycles.</div>
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
            <h4 className="text-base font-semibold text-hyve-header mb-3">EV Range Optimisation</h4>
            <p className="text-sm text-hyve-text/70 mb-3">
              Aerodynamic drag directly affects vehicle range. Continuous pressure mapping identifies drag sources across mirrors, pillars, underbody, and cooling systems.
            </p>
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-lg font-bold text-hyve-header">2-5% drag reduction</div>
              <div className="text-xs text-hyve-text/70">= 10-25 miles additional range</div>
            </div>
          </div>

          <div className="p-5 bg-hyve-content/10 rounded-xl">
            <h4 className="text-base font-semibold text-hyve-header mb-3">Thermal Management</h4>
            <p className="text-sm text-hyve-text/70 mb-3">
              Battery cooling, motor thermal limits, and cabin HVAC efficiency require detailed airflow understanding. Hyve enables simultaneous pressure and temperature mapping across thermal systems.
            </p>
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-lg font-bold text-hyve-header">Optimised airflow</div>
              <div className="text-xs text-hyve-text/70">Without weight penalty</div>
            </div>
          </div>

          <div className="p-5 bg-hyve-content/10 rounded-xl">
            <h4 className="text-base font-semibold text-hyve-header mb-3">High-Speed Stability</h4>
            <p className="text-sm text-hyve-text/70 mb-3">
              Quantified lift and downforce distribution at speed. Identify flow separation zones and instability across bodywork and aerodynamic devices.
            </p>
            <div className="text-center p-3 bg-white/70 rounded-lg">
              <div className="text-lg font-bold text-hyve-header">Improved safety</div>
              <div className="text-xs text-hyve-text/70">Reduced warranty claims</div>
            </div>
          </div>
        </div>
      </div>
    </IndustryPageFocused>
    </>
  )
}
