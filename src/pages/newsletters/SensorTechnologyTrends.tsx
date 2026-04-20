import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Download, Zap, Shield, Brain, Network } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { SEO } from '@/components/common/SEO'
import { ShareButtons } from '@/components/common/ShareButtons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Animation variants
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export const SensorTechnologyTrends = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SEO
        title="The Future of Sensor Technology: Trends Shaping 2024"
        description="Explore cutting-edge developments in ultra-thin sensor technology and IoT integration transforming structural health monitoring, robotics, and energy systems."
        keywords="sensor technology, IoT sensors, ultra-thin sensors, structural health monitoring, robotics sensors, energy systems, smart sensors"
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'The Future of Sensor Technology: Trends Shaping 2024',
          description:
            'Explore cutting-edge developments in ultra-thin sensor technology and IoT integration transforming structural health monitoring, robotics, and energy systems.',
          datePublished: '2023-12-20',
          dateModified: '2023-12-20',
          inLanguage: 'en-GB',
          image: 'https://hyvedynamics.com/og_image.png',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://hyvedynamics.com/insights/newsletter/sensor-technology-trends',
          },
          author: { '@type': 'Organization', name: 'Hyve Dynamics', url: 'https://hyvedynamics.com' },
          publisher: {
            '@type': 'Organization',
            name: 'Hyve Dynamics',
            url: 'https://hyvedynamics.com',
            logo: { '@type': 'ImageObject', url: 'https://hyvedynamics.com/HD-Logo-dk.svg' },
          },
        }}
      />

      <div className="min-h-screen bg-hyve-background">
        {/* Header Section */}
        <section className="relative py-16 lg:py-20 pointer-events-auto">
          <div className="hyve-container">
            {/* Back Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link
                to="/insights/newsletter"
                className="inline-flex items-center gap-2 text-hyve-text hover:text-hyve-interactive transition-colors font-body"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Newsletter Archive
              </Link>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto"
            >
              {/* Article Header */}
              <motion.div variants={itemVariants} className="mb-8">
                <Badge variant="secondary" className="px-4 py-1 text-sm font-medium mb-4">
                  TECHNOLOGY
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-hyve-header mb-6 font-heading">
                  The Future of Sensor Technology: Trends Shaping 2024
                </h1>

                <div className="flex items-center gap-6 text-sm text-hyve-text/70 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    December 20, 2023
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    6 min read
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ShareButtons
                    url="/insights/newsletter/sensor-technology-trends"
                    title="The Future of Sensor Technology: Trends Shaping 2024"
                    description="Explore cutting-edge developments in ultra-thin sensor technology and IoT integration."
                  />
                  <Button variant="outline" size="sm" className="border-hyve-accent text-hyve-text hover:bg-hyve-accent hover:text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </motion.div>

              <Separator className="mb-8" />

              {/* Article Content */}
              <motion.div variants={itemVariants} className="prose prose-lg max-w-none">
                <div className="space-y-8 text-hyve-text font-body leading-relaxed">
                  
                  {/* Introduction */}
                  <div className="text-xl text-hyve-text/90 font-light leading-relaxed bg-hyve-content/30 p-6 rounded-lg border-l-4 border-hyve-interactive">
                    The sensor technology landscape is evolving at an unprecedented pace, driven by advancements 
                    in materials science, miniaturization, and connectivity. As we approach 2024, several key 
                    trends are reshaping how we collect, process, and utilize sensor data across industries.
                  </div>

                  {/* Section 1: Market Overview */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      The €106 Billion IoT Sensor Market
                    </h2>
                    <p className="mb-4">
                      The global IoT sensor market is projected to reach €106 billion by 2030, with industrial 
                      applications driving the majority of growth. This expansion is fueled by increasing demand 
                      for real-time monitoring, predictive maintenance, and autonomous systems across multiple sectors.
                    </p>
                    <p className="mb-4">
                      <span className="font-semibold text-hyve-header">Key growth drivers include:</span>
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Industrial 4.0 transformation and smart manufacturing initiatives</li>
                      <li>Growing emphasis on structural health monitoring and predictive maintenance</li>
                      <li>Expansion of autonomous vehicle and robotics applications</li>
                      <li>Environmental monitoring and sustainability requirements</li>
                    </ul>
                  </div>

                  {/* Trend Cards */}
                  <div className="grid md:grid-cols-2 gap-6 my-8">
                    <Card className="bg-white/80 backdrop-blur-sm border border-hyve-content">
                      <CardHeader className="pb-4">
                        <div className="p-2 rounded-md bg-hyve-accent/20 w-fit">
                          <Zap className="h-6 w-6 text-hyve-interactive" />
                        </div>
                        <CardTitle className="text-lg font-heading text-hyve-header">Ultra-Low Power</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-hyve-text/80">
                          Energy-harvesting sensors operating for decades without battery replacement, 
                          enabling truly autonomous monitoring systems.
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-hyve-content">
                      <CardHeader className="pb-4">
                        <div className="p-2 rounded-md bg-hyve-accent/20 w-fit">
                          <Shield className="h-6 w-6 text-hyve-interactive" />
                        </div>
                        <CardTitle className="text-lg font-heading text-hyve-header">Edge Security</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-hyve-text/80">
                          Hardware-based security features protecting sensor data from edge to cloud, 
                          ensuring integrity in critical applications.
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-hyve-content">
                      <CardHeader className="pb-4">
                        <div className="p-2 rounded-md bg-hyve-accent/20 w-fit">
                          <Brain className="h-6 w-6 text-hyve-interactive" />
                        </div>
                        <CardTitle className="text-lg font-heading text-hyve-header">AI Integration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-hyve-text/80">
                          On-sensor machine learning enabling real-time decision making and 
                          reducing data transmission requirements by up to 90%.
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-hyve-content">
                      <CardHeader className="pb-4">
                        <div className="p-2 rounded-md bg-hyve-accent/20 w-fit">
                          <Network className="h-6 w-6 text-hyve-interactive" />
                        </div>
                        <CardTitle className="text-lg font-heading text-hyve-header">Mesh Networking</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-hyve-text/80">
                          Self-organizing sensor networks providing resilient communication 
                          and extended range without additional infrastructure.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section 2: Ultra-Thin Technology */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      The Ultra-Thin Revolution
                    </h2>
                    <p className="mb-4">
                      Hyve Dynamics is at the forefront of ultra-thin sensor technology, with our Haptic Matrix 
                      sensors measuring less than 100 microns in thickness. This breakthrough enables integration 
                      into surfaces without affecting their structural or aesthetic properties.
                    </p>
                    
                    <div className="bg-hyve-content/20 p-6 rounded-lg border border-hyve-content mb-6">
                      <h3 className="text-xl font-semibold text-hyve-header mb-3">Technical Specifications</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-hyve-header">Thickness:</strong> &lt; 100 microns
                        </div>
                        <div>
                          <strong className="text-hyve-header">Sensor Density:</strong> Up to 10,000/m²
                        </div>
                        <div>
                          <strong className="text-hyve-header">Response Time:</strong> &lt; 1 millisecond
                        </div>
                        <div>
                          <strong className="text-hyve-header">Temperature Range:</strong> -40°C to +150°C
                        </div>
                        <div>
                          <strong className="text-hyve-header">Power Consumption:</strong> &lt; 100 µW per sensor
                        </div>
                        <div>
                          <strong className="text-hyve-header">Connectivity:</strong> Wireless mesh protocols
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Industry Applications */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      Transforming Industries
                    </h2>
                    
                    <h3 className="text-xl font-semibold text-hyve-header mb-3">Digital Twinning & Integrated Health Monitoring</h3>
                    <p className="mb-4">
                      The €36 billion digital twinning and integrated health monitoring market is being revolutionized 
                      by continuous, real-time sensing capabilities. Ultra-thin sensors embedded in wind turbines, 
                      bridges, buildings, and critical infrastructure provide live digital twin correlation and 
                      early warning of fatigue, stress concentration, and potential failures — while also enabling 
                      15-20% efficiency improvements in energy generation through blade surface monitoring.
                    </p>

                    <h3 className="text-xl font-semibold text-hyve-header mb-3">Robotics and Automation</h3>
                    <p className="mb-4">
                      Advanced tactile sensing is enabling robots to interact safely and precisely with their 
                      environment. High-density sensor arrays provide the "sense of touch" necessary for 
                      delicate manipulation tasks and human-robot collaboration.
                    </p>
                  </div>

                  {/* Section 4: 2024 Outlook */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      2024 Technology Outlook
                    </h2>
                    <div className="bg-hyve-content/20 p-6 rounded-lg border border-hyve-content">
                      <h3 className="text-xl font-semibold text-hyve-header mb-3">Emerging Trends</h3>
                      <ul className="space-y-3">
                        <li>
                          <strong className="text-hyve-header">Biodegradable Sensors:</strong> Environmentally 
                          friendly sensors for temporary monitoring applications, dissolving safely after use.
                        </li>
                        <li>
                          <strong className="text-hyve-header">Quantum Sensors:</strong> Ultra-precise measurement 
                          capabilities for scientific and industrial applications requiring extreme accuracy.
                        </li>
                        <li>
                          <strong className="text-hyve-header">Self-Healing Materials:</strong> Sensors with 
                          autonomous repair capabilities, extending operational lifetime in harsh environments.
                        </li>
                        <li>
                          <strong className="text-hyve-header">6G Integration:</strong> Ultra-low latency 
                          communication enabling real-time control applications and massive sensor deployments.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Conclusion */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      The Path Forward
                    </h2>
                    <p className="mb-4">
                      As sensor technology continues to evolve, the integration of AI, advanced materials, and 
                      ultra-low power designs will create new possibilities for monitoring and control across 
                      industries. The convergence of these technologies will enable truly intelligent, 
                      autonomous systems that can adapt and optimize their performance in real-time.
                    </p>
                    <p>
                      Hyve Dynamics remains committed to pushing the boundaries of what's possible in sensor 
                      technology, developing solutions that transform how we understand and interact with the 
                      physical world. Our ultra-thin Haptic Matrix technology represents just the beginning 
                      of this exciting journey.
                    </p>
                  </div>

                </div>
              </motion.div>

              <Separator className="my-8" />

              {/* Footer CTA */}
              <motion.div variants={itemVariants} className="text-center">
                <Card className="bg-gradient-to-r from-hyve-interactive/10 to-hyve-accent/10 border-hyve-accent/30">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading text-hyve-header">
                      Explore Hyve's Sensor Solutions
                    </CardTitle>
                    <CardDescription className="text-hyve-text/80 font-body">
                      Discover how our ultra-thin sensor technology can transform your industry applications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3 justify-center">
                      <Link to="/haptic-matrix">
                        <Button variant="outline" className="border-hyve-accent text-hyve-text hover:bg-hyve-accent hover:text-white">
                          Haptic Matrix Technology
                        </Button>
                      </Link>
                      <Button
                        className="bg-hyve-interactive hover:bg-hyve-interactive-dark text-white"
                        onClick={() => {
                          const contactButton = document.querySelector(
                            '[data-contact-trigger]'
                          ) as HTMLButtonElement
                          if (contactButton) contactButton.click()
                        }}
                      >
                        Book Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}
