import { SEO } from '@/components/common/SEO'
import { Badge } from '@/components/ui/badge'
import { IndustryPageFocused } from '@/components/pages/IndustryPageFocused'
import { getVideoPath } from '@/lib/assets'

const digitalTwinningJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Digital twin correlation and integrated health monitoring',
  provider: {
    '@type': 'Organization',
    name: 'Hyve Dynamics',
    url: 'https://hyvedynamics.com',
  },
  areaServed: 'Worldwide',
  audience: {
    '@type': 'BusinessAudience',
    audienceType: 'Aerospace operators, energy infrastructure owners, industrial asset managers, digital twin teams',
  },
  description:
    'High-density surface measurements that correlate digital twins with real operating conditions and support condition-based maintenance, anomaly detection, and integrated vehicle health monitoring (IVHM).',
}

const digitalTwinningIHMData = {
  id: 'digital-twinning-ihm',
  title: 'Digital Twin Correlation & Surface Health Monitoring',
  badge: 'DIGITAL TWINNING & INTEGRATED HEALTH MONITORING',
  tagline: 'Real-time surface data to improve model fidelity, detect anomalies earlier, and support condition-based maintenance strategies.',
  description:
    'Hyve provides high-density pressure, temperature, and strain measurements across complex surfaces. This data can be used to correlate CFD/FEA models with real operating conditions and to support integrated health monitoring workflows across aerospace, energy, and industrial assets.',
  videoPath: getVideoPath('Wind-Turbine.webm'),
  videoPaths: [
    getVideoPath('Wind-Turbine.webm'),
    getVideoPath('Structural-Health.webm'),
  ],
  features: [
    {
      title: 'Live Digital Twin Correlation',
      description:
        'Supports real-time correlation of computational models (CFD/FEA) using measured surface data in representative operating conditions.',
    },
    {
      title: 'Early Anomaly Detection',
      description:
        'Surface strain and thermal patterns can indicate emerging issues earlier than periodic inspections, supporting earlier investigation and maintenance planning.',
    },
    {
      title: 'High-Density Spatial Insight',
      description:
        'Dense sensing enables localisation of changes across a surface, helping teams focus inspections and diagnostics where it matters.',
    },
    {
      title: 'Multi-Modal Sensing',
      description:
        'Simultaneous pressure, temperature, and strain sensing supports combined aerodynamic + thermal + structural interpretation.',
    },
  ],
  summary:
    'Hyve is designed to complement periodic inspection and existing monitoring systems by adding continuous, high-density surface measurements. This supports more accurate model correlation, earlier diagnostics, and a clearer understanding of how assets behave in real operating conditions.',
  cta: 'Build digital twins on measured surface data — not assumptions.',
}

export const DigitalTwinningIHMPage = () => {
  return (
    <>
      <SEO
        title="Digital Twinning & Integrated Health Monitoring"
        description="Hyve provides high-density pressure, temperature, and strain measurements that correlate CFD/FEA digital twins with real operating conditions and support condition-based maintenance, anomaly detection, and IVHM workflows."
        keywords="digital twin, IVHM, integrated health monitoring, CFD correlation, FEA correlation, condition-based maintenance, anomaly detection, structural health monitoring, Haptic Matrix, Hyve Dynamics"
        jsonLd={digitalTwinningJsonLd}
      />
      <IndustryPageFocused industry={digitalTwinningIHMData}>
      <div className="bg-gradient-to-br from-white/95 to-hyve-accent/10 backdrop-blur-xl rounded-3xl shadow-xl border border-hyve-content/20 p-8 lg:p-12">
        <div className="mb-8">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-medium mb-4">
            EMERGING CAPABILITY
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-hyve-header mb-4 font-heading">
            Structural Health Monitoring (IVHM)
          </h2>
          <p className="text-base md:text-lg text-hyve-text/80 max-w-3xl">
            Move from scheduled inspection to data-informed maintenance decisions — starting with better surface measurements.
          </p>
        </div>

        {/* The Challenge */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-hyve-header mb-4">
            The Challenge: Unscheduled Maintenance and Inspection Burden
          </h3>
          <p className="text-sm text-hyve-text/70 mb-4">
            Across aerospace and industrial infrastructure, unplanned maintenance events create significant operational and financial impact. Current inspection approaches rely heavily on periodic checks and manual diagnostics, which can miss early-stage degradation or require unnecessary maintenance interventions.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { value: 'Unscheduled maintenance impact', label: 'Unexpected failures can disrupt operations and create significant repair costs.' },
              { value: 'Aircraft-on-ground events', label: 'Unplanned downtime affects fleet availability and operational schedules.' },
              { value: 'Inspection inefficiency', label: 'Many scheduled inspections confirm no degradation, consuming time and resources.' },
              { value: 'Heavy maintenance cycles', label: 'Major inspections involve extensive labour and downtime.' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-3 bg-white/70 rounded-lg">
                <div className="text-sm font-bold text-hyve-header">{stat.value}</div>
                <div className="text-xs text-hyve-text/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-hyve-text/70">
            Continuous surface measurements can help identify changes earlier and support more targeted inspection strategies.
          </p>
        </div>

        {/* How Hyve Enables IVHM */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-hyve-header mb-4">How Hyve Enables IVHM</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-5 bg-white/70 rounded-xl border border-hyve-content/20">
              <h4 className="text-base font-semibold text-hyve-header mb-3">Composite Integration (Roadmap / Program-specific)</h4>
              <p className="text-xs text-hyve-text/60 mb-3">
                Embedding during layup is a potential integration route for certain composite structures, depending on certification, manufacturing workflow, and program requirements.
              </p>
              <ul className="space-y-2 text-sm text-hyve-text/70">
                <li><strong className="text-hyve-header">Integration route:</strong> Between composite layers (program-dependent)</li>
                <li><strong className="text-hyve-header">Low profile:</strong> Designed to minimise impact on structure and mass</li>
                <li><strong className="text-hyve-header">Lifecycle monitoring concept:</strong> Supports continuous measurement approaches</li>
              </ul>
            </div>
            <div className="p-5 bg-white/70 rounded-xl border border-hyve-content/20">
              <h4 className="text-base font-semibold text-hyve-header mb-3">What Surface Data Can Indicate</h4>
              <ul className="space-y-2 text-sm text-hyve-text/70">
                <li><strong className="text-hyve-header">Delamination indicators:</strong> Local strain pattern changes consistent with layer separation</li>
                <li><strong className="text-hyve-header">Impact signatures:</strong> Rapid strain transients consistent with impact events</li>
                <li><strong className="text-hyve-header">Fatigue progression:</strong> Micro-strain shifts that may precede visible damage</li>
                <li><strong className="text-hyve-header">Environmental degradation:</strong> Trends consistent with moisture/thermal cycling effects</li>
              </ul>
            </div>
          </div>
        </div>

        {/* IVHM Business Case */}
        <div className="bg-gradient-to-r from-emerald-500/5 to-teal-500/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-hyve-header mb-4">IVHM Value Potential (Program-dependent)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-hyve-text/60 mb-3">With Hyve IVHM</h4>
              <ul className="space-y-2 text-sm text-hyve-text/70">
                <li>• <strong>Condition-based maintenance:</strong> Inspect when data indicates change</li>
                <li>• <strong>Earlier investigation:</strong> Identify changes sooner to reduce downstream impact</li>
                <li>• <strong>Operate with evidence:</strong> Maintenance decisions informed by measured trends</li>
              </ul>
            </div>
            <div className="flex flex-col justify-center">
              <div className="p-4 bg-white/70 rounded-xl">
                <h4 className="text-sm font-semibold text-hyve-header mb-2">Value Potential (Program-dependent)</h4>
                <p className="text-sm text-hyve-text/70">
                  Condition-based maintenance concepts can reduce unscheduled events and improve asset availability over time. Quantification depends on platform, duty cycle, and integration scope.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dual-Use Applications */}
        <div>
          <h3 className="text-xl font-semibold text-hyve-header mb-4">Dual-Use Applications (Program-dependent)</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {[
              { title: 'UAV Structural Monitoring (Concept)', desc: 'Surface strain trending to support structural usage monitoring on composite airframes.' },
              { title: 'High-Speed / Thermal Instrumentation (Concept)', desc: 'Combined temperature + strain measurement for test and evaluation on high-speed structures.' },
              { title: 'Impact Event Indication (Concept)', desc: 'High-rate strain signatures that can support event detection and post-event inspection planning.' },
            ].map((item, index) => (
              <div key={index} className="p-4 bg-white/70 rounded-xl border border-hyve-content/20">
                <h4 className="text-sm font-semibold text-hyve-header mb-2">{item.title}</h4>
                <p className="text-xs text-hyve-text/70">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white/70 rounded-xl border border-hyve-content/20">
              <h4 className="text-sm font-semibold text-hyve-header mb-2">Maintenance Planning Support</h4>
              <p className="text-xs text-hyve-text/70">Enables condition-based monitoring concepts that can reduce unplanned downtime and improve maintenance scheduling over time.</p>
            </div>
            <div className="p-4 bg-white/70 rounded-xl border border-hyve-content/20">
              <h4 className="text-sm font-semibold text-hyve-header mb-2">Ultra-Thin & Non-Intrusive</h4>
              <p className="text-xs text-hyve-text/70">Ultra-thin flexible arrays are designed to conform to complex geometries without structural penetration.</p>
            </div>
          </div>
        </div>
      </div>
    </IndustryPageFocused>
    </>
  )
}
