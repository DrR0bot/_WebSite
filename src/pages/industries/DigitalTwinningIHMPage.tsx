import { Shield } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { IndustryPageFocused } from '@/components/pages/IndustryPageFocused'
import { getVideoPath } from '@/lib/assets'

const digitalTwinningIHMData = {
  id: 'digital-twinning-ihm',
  title: 'Digital Twinning & IHM',
  badge: 'DIGITAL TWINS & INTEGRATED HEALTH MONITORING',
  tagline: 'Real-Time Digital Twins Powered by High-Density Sensing',
  description:
    'Hyve Dynamics bridges the gap between simulation and reality by delivering real-time, high-density data that fuels accurate digital twins and integrated health monitoring. From wind turbines to bridges, our Haptic Matrix enables continuous structural intelligence — transforming how operators predict failures, optimise maintenance, and extend asset lifecycles across energy and infrastructure.',
  videoPath: getVideoPath('Wind-Turbine.webm'),
  videoPaths: [
    getVideoPath('Wind-Turbine.webm'),
    getVideoPath('Structural-Health.webm'),
  ],
  features: [
    {
      title: 'Live Digital Twin Correlation',
      description:
        'Real-time validation of computational models (FEA, CFD) under actual operating conditions — bridging the gap between simulation and reality for energy systems and infrastructure.',
    },
    {
      title: 'Predictive Failure Intelligence',
      description:
        'Identifies stress concentrations, fatigue initiation points, thermal anomalies, and aerodynamic inefficiencies before critical failure occurs.',
    },
    {
      title: 'Pinpoint Spatial Accuracy',
      description:
        'Over 100 sensors per 24 cm² provide exact location data for maintenance interventions — you know precisely where to inspect and repair.',
    },
    {
      title: 'Multi-Modal Sensing',
      description:
        'Simultaneously captures wind flow, mechanical stress, temperature variations, and dynamic responses across complex geometries on turbines, blades, and structures.',
    },
    {
      title: 'Optimised Maintenance & Yield',
      description:
        'Transforms reactive maintenance into data-driven, scheduled interventions — reducing downtime, maximising energy output, and extending asset life.',
    },
    {
      title: 'Ultra-Thin & Non-Intrusive',
      description:
        'At just 0.33 mm, the Haptic Matrix integrates seamlessly with turbine blades, bridge decks, and building facades without affecting structural or aerodynamic properties.',
    },
  ],
  summary:
    'By replacing periodic inspections and static monitoring systems, Hyve Dynamics delivers continuous, real-world structural and aerodynamic intelligence — enabling operators to build accurate digital twins, prevent failures, optimise maintenance budgets, and drive sustainability across energy and infrastructure assets.',
  cta: 'Enable intelligent digital twins and predictive health monitoring with Hyve Dynamics.',
}

export const DigitalTwinningIHMPage = () => {
  return (
    <IndustryPageFocused industry={digitalTwinningIHMData}>
      <div className="bg-gradient-to-br from-white/95 to-hyve-accent/10 backdrop-blur-xl rounded-3xl shadow-xl border border-hyve-content/20 p-8 lg:p-12">
        <div className="mb-8">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-medium mb-4">
            UNDERDEVELOPED OPPORTUNITY
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-hyve-header mb-4 font-heading">
            Structural Health Monitoring (IVHM)
          </h2>
          <p className="text-base md:text-lg text-hyve-text/80 max-w-3xl">
            Shift from reactive maintenance (fix after failure) to predictive maintenance (detect before failure).
          </p>
        </div>

        {/* The Problem */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-hyve-header mb-4">
            The Problem: Unscheduled Maintenance Costs Billions
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {[
              { value: '$15-20B', label: 'Annual unscheduled maintenance (global fleet)' },
              { value: '$150K-$500K', label: 'AOG cost per day (wide-body)' },
              { value: '40-60%', label: 'Inspected components with no degradation' },
              { value: '$500K-$2M', label: 'Per C-check (heavy maintenance)' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-3 bg-white/70 rounded-lg">
                <div className="text-xl font-bold text-red-600">{stat.value}</div>
                <div className="text-xs text-hyve-text/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-hyve-text/70">
            Current inspection methods (visual, scheduled tear-down) miss internal damage. Failure modes like delamination, fatigue cracks, and impact damage often go undetected until catastrophic.
          </p>
        </div>

        {/* How Hyve Enables IVHM */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-hyve-header mb-4">How Hyve Enables IVHM</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-5 bg-white/70 rounded-xl border border-hyve-content/20">
              <h4 className="text-base font-semibold text-hyve-header mb-3">Composite Integration</h4>
              <ul className="space-y-2 text-sm text-hyve-text/70">
                <li><strong className="text-hyve-header">Embedding during layup:</strong> Sensors placed between composite layers</li>
                <li><strong className="text-hyve-header">Zero weight penalty:</strong> Thinner than resin-rich layer</li>
                <li><strong className="text-hyve-header">Permanent monitoring:</strong> First flight through end of service life</li>
              </ul>
            </div>
            <div className="p-5 bg-white/70 rounded-xl border border-hyve-content/20">
              <h4 className="text-base font-semibold text-hyve-header mb-3">What Gets Detected</h4>
              <ul className="space-y-2 text-sm text-hyve-text/70">
                <li><strong className="text-hyve-header">Delamination:</strong> Strain changes indicate layer separation</li>
                <li><strong className="text-hyve-header">Impact detection:</strong> Bird strikes, hail, debris signatures</li>
                <li><strong className="text-hyve-header">Fatigue:</strong> Micro-strain precedes visible cracks by thousands of cycles</li>
                <li><strong className="text-hyve-header">Degradation:</strong> Moisture ingress, thermal cycling effects</li>
              </ul>
            </div>
          </div>
        </div>

        {/* IVHM Business Case */}
        <div className="bg-gradient-to-r from-emerald-500/5 to-teal-500/10 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-hyve-header mb-4">IVHM Business Case</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-hyve-text/60 mb-3">With Hyve IVHM</h4>
              <ul className="space-y-2 text-sm text-hyve-text/70">
                <li>• <strong>Condition-based maintenance:</strong> Inspect only when sensors indicate degradation</li>
                <li>• <strong>Avoided AOG events:</strong> Early detection prevents in-service failures</li>
                <li>• <strong>Extended service life:</strong> Operate to actual limits, not assumptions</li>
              </ul>
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-center p-4 bg-white/70 rounded-xl">
                <div className="text-3xl font-bold text-emerald-600">30-40%</div>
                <div className="text-sm text-hyve-text/70 mt-1">Reduction in unscheduled maintenance costs</div>
                <div className="text-xs text-hyve-text/50 mt-2">3-5x ROI over 10-year aircraft service life</div>
              </div>
            </div>
          </div>
        </div>

        {/* Defense Applications */}
        <div>
          <h3 className="text-xl font-semibold text-hyve-header mb-4">Defense Applications</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'UAV Structural Monitoring', desc: 'Track cumulative damage in lightweight composites, predict remaining service life' },
              { title: 'Hypersonic Instrumentation', desc: 'Real-time temperature + strain on leading edges, validate thermal protection' },
              { title: 'Impact Detection', desc: 'Instant detection of small-arms, shrapnel, debris impacts; assess structural integrity' },
            ].map((item, index) => (
              <div key={index} className="p-4 bg-white/70 rounded-xl border border-hyve-content/20">
                <h4 className="text-sm font-semibold text-hyve-header mb-2">{item.title}</h4>
                <p className="text-xs text-hyve-text/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </IndustryPageFocused>
  )
}
