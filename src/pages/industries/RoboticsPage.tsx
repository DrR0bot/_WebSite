import { SEO } from '@/components/common/SEO'
import { IndustryPageFocused } from '@/components/pages/IndustryPageFocused'
import { getVideoPath } from '@/lib/assets'

const roboticsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Robotics tactile and surface sensing',
  provider: {
    '@type': 'Organization',
    name: 'Hyve Dynamics',
    url: 'https://www.hyvedynamics.com',
  },
  areaServed: 'Worldwide',
  audience: {
    '@type': 'BusinessAudience',
    audienceType: 'Robotics manufacturers, automation integrators, research institutions',
  },
  description:
    'High-density flexible sensor arrays providing pressure, temperature, and strain measurement across robotic end-effectors, structures, and operating environments for adaptive control, tactile sensing, and condition monitoring.',
}

const roboticsData = {
  id: 'robotics',
  title: 'Surface Intelligence for Next-Generation Robotics',
  badge: 'ROBOTICS',
  tagline: 'Surface Intelligence for Next-Generation Robotics',
  description:
    'High-density sensing that helps robots understand the surfaces they interact with.\n\nHyve\u2019s flexible sensor arrays capture pressure, temperature, and strain across complex surfaces. In robotics and automation environments, this type of sensing can provide new layers of environmental awareness, enabling robots to interpret contact, airflow, structural loads, and changing operating conditions.\n\nThis capability supports emerging approaches to tactile sensing, adaptive control, and intelligent robotic systems.',
  videoPath: getVideoPath('Robot.webm'),
  features: [
    {
      title: 'Environmental Awareness',
      description:
        'Surface measurements can provide robots with richer information about contact forces, surface interactions, and environmental conditions.',
    },
    {
      title: 'Adaptive Control Potential',
      description:
        'Real-time sensing enables feedback loops that could allow robotic systems to respond dynamically to changing conditions rather than relying solely on pre-programmed behaviours.',
    },
    {
      title: 'High-Density Surface Feedback',
      description:
        'Dense sensing networks capture detailed interaction data across robot end-effectors, structures, and operating environments.',
    },
    {
      title: 'Process Insight',
      description:
        'Monitoring surface interactions may reveal optimisation opportunities in automated processes such as assembly, manipulation, and material handling.',
    },
    {
      title: 'Condition Monitoring',
      description:
        'Surface strain and thermal trends can support monitoring of robotic systems for wear, load anomalies, or operational stress.',
    },
    {
      title: 'Safety Awareness',
      description:
        'Force and interaction sensing could contribute to improved situational awareness in human-robot collaborative environments.',
    },
  ],
  summary:
    'By extending sensing beyond traditional joint and motor feedback, surface-level measurements may provide robotic systems with a deeper understanding of how they interact with their environment. This type of data could support more intelligent automation across manufacturing, logistics, and service robotics.',
  cta: 'Exploring new sensing layers for intelligent robotics and automation systems.',
}

export const RoboticsPage = () => {
  return (
    <>
      <SEO
        title="Robotics Surface & Tactile Sensing"
        description="Hyve's flexible sensor arrays bring high-density surface sensing to robotics — capturing pressure, temperature, and strain across end-effectors and structures for adaptive control, tactile feedback, and condition monitoring."
        keywords="robotics sensors, tactile sensing, adaptive control, end-effector sensors, robot environmental awareness, human-robot collaboration, Haptic Matrix, Hyve Dynamics"
        jsonLd={roboticsJsonLd}
      />
      <IndustryPageFocused industry={roboticsData} />
    </>
  )
}
