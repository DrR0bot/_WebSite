import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Download, Plane, Car, Combine } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { SEO } from '@/components/common/SEO'
import { ShareButtons } from '@/components/common/ShareButtons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { generateNewsletterPDF } from '@/lib/pdf-utils'
import { toast } from 'sonner'

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

export const AerodynamicInnovation2024 = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generateNewsletterPDF(
        'newsletter-content',
        'Aerodynamic Innovation 2024 Industry Outlook',
        '2024-01'
      )
      toast.success('PDF downloaded successfully!', {
        description: 'The newsletter has been saved to your downloads folder.',
      })
    } catch (error) {
      console.error('PDF generation failed:', error)
      toast.error('Failed to generate PDF', {
        description: 'Please try again or contact support if the issue persists.',
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <>
      <SEO
        title="Aerodynamic Innovation: 2024 Industry Outlook"
        description="Discover how Hyve's Haptic Matrix technology is revolutionizing aerodynamic testing across aerospace and automotive industries. Insights on Formula 1, commercial aviation, and real-time data acquisition."
        keywords="aerodynamic testing, haptic matrix, aerospace innovation, automotive aerodynamics, Formula 1, commercial aviation, sensor technology"
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Aerodynamic Innovation: 2024 Industry Outlook',
          description:
            "Discover how Hyve's Haptic Matrix technology is revolutionizing aerodynamic testing across aerospace and automotive industries.",
          datePublished: '2024-01-15',
          dateModified: '2024-01-15',
          inLanguage: 'en-GB',
          image: 'https://www.hyvedynamics.com/og_image.png',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://www.hyvedynamics.com/insights/newsletter/aerodynamic-innovation-2024',
          },
          author: { '@type': 'Organization', name: 'Hyve Dynamics', url: 'https://www.hyvedynamics.com' },
          publisher: {
            '@type': 'Organization',
            name: 'Hyve Dynamics',
            url: 'https://www.hyvedynamics.com',
            logo: { '@type': 'ImageObject', url: 'https://www.hyvedynamics.com/HD-Logo-dk.svg' },
          },
        }}
      />

      <div className="min-h-screen bg-hyve-background">
        {/* Header Section */}
        <section className="relative py-16 lg:py-20 pointer-events-auto">
          <div className="hyve-container">
            <div id="newsletter-content">
            {/* Back Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
              data-exclude-from-pdf
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
                  INDUSTRY INSIGHTS
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-hyve-header mb-6 font-heading">
                  Aerodynamic Innovation: 2024 Industry Outlook
                </h1>

                <div className="flex items-center gap-6 text-sm text-hyve-text/70 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    January 15, 2024
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    8 min read
                  </div>
                </div>

                <div className="flex items-center gap-3" data-exclude-from-pdf>
                  <ShareButtons
                    url="/insights/newsletter/aerodynamic-innovation-2024"
                    title="Aerodynamic Innovation: 2024 Industry Outlook"
                    description="Discover how Hyve's Haptic Matrix technology is revolutionizing aerodynamic testing across aerospace and automotive industries."
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-hyve-accent text-hyve-text hover:bg-hyve-accent hover:text-white"
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                  </Button>
                </div>
              </motion.div>

              <Separator className="mb-8" />

              {/* Article Content */}
              <motion.div variants={itemVariants} className="prose prose-lg max-w-none">
                <div className="space-y-8 text-hyve-text font-body leading-relaxed">
                  
                  {/* Introduction */}
                  <div className="text-xl text-hyve-text/90 font-light leading-relaxed bg-hyve-content/30 p-6 rounded-lg border-l-4 border-hyve-interactive">
                    As we enter 2024, the aerodynamics industry stands at the precipice of a technological revolution. 
                    Hyve Dynamics' Haptic Matrix technology is leading this transformation, providing unprecedented 
                    real-time data acquisition capabilities that are reshaping how we understand and optimize 
                    aerodynamic performance across multiple industries.
                  </div>

                  {/* Section 1: Industry Landscape */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      The Current Industry Landscape
                    </h2>
                    <p className="mb-4">
                      The global aerodynamics testing market is experiencing unprecedented growth, driven by 
                      increasing demands for fuel efficiency, performance optimization, and sustainability across 
                      aerospace and automotive sectors. Traditional wind tunnel testing, while still valuable, 
                      is being supplemented and enhanced by real-world data acquisition technologies.
                    </p>
                    <p>
                      <span className="font-semibold text-hyve-header">Key market drivers include:</span>
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>Regulatory pressure for reduced emissions and improved fuel efficiency</li>
                      <li>Competitive demands in motorsports for marginal performance gains</li>
                      <li>Growing adoption of electric vehicles requiring optimized aerodynamics</li>
                      <li>Advancement in sensor miniaturization and data processing capabilities</li>
                    </ul>
                  </div>

                  {/* Industry Applications */}
                  <div className="grid md:grid-cols-3 gap-6 my-8">
                    <Card className="bg-white/80 backdrop-blur-sm border border-hyve-content">
                      <CardHeader className="pb-4">
                        <div className="p-2 rounded-md bg-hyve-accent/20 w-fit">
                          <Plane className="h-6 w-6 text-hyve-interactive" />
                        </div>
                        <CardTitle className="text-lg font-heading text-hyve-header">Aerospace</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-hyve-text/80">
                          Commercial aviation focuses on fuel efficiency improvements of 2-5% through 
                          real-time wing surface monitoring and optimization.
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-hyve-content">
                      <CardHeader className="pb-4">
                        <div className="p-2 rounded-md bg-hyve-accent/20 w-fit">
                          <Car className="h-6 w-6 text-hyve-interactive" />
                        </div>
                        <CardTitle className="text-lg font-heading text-hyve-header">Automotive</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-hyve-text/80">
                          Formula 1 and electric vehicle manufacturers leverage real-time data for 
                          aerodynamic optimization and battery efficiency improvements.
                        </CardDescription>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-hyve-content">
                      <CardHeader className="pb-4">
                        <div className="p-2 rounded-md bg-hyve-accent/20 w-fit">
                          <Combine className="h-6 w-6 text-hyve-interactive" />
                        </div>
                        <CardTitle className="text-lg font-heading text-hyve-header">Digital Twinning & IHM</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-hyve-text/80">
                          Digital twins powered by real-time surface monitoring enable 15-20% 
                          efficiency improvements and predictive health management across energy and infrastructure.
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section 2: Haptic Matrix Technology */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      Haptic Matrix: Redefining Real-World Testing
                    </h2>
                    <p className="mb-4">
                      Hyve Dynamics' Haptic Matrix technology represents a paradigm shift from traditional 
                      testing methodologies. Our ultra-thin sensor arrays, measuring less than 100 microns 
                      in thickness, can be seamlessly integrated into any surface without affecting 
                      aerodynamic properties.
                    </p>
                    <p className="mb-4">
                      <span className="font-semibold text-hyve-header">Key technological advantages:</span>
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>High-density data acquisition:</strong> Up to 10,000 sensors per square meter</li>
                      <li><strong>Real-time processing:</strong> Sub-millisecond response times for critical applications</li>
                      <li><strong>Environmental resilience:</strong> Operational in extreme conditions (-40°C to +150°C)</li>
                      <li><strong>Wireless connectivity:</strong> Seamless data transmission without additional wiring</li>
                    </ul>
                  </div>

                  {/* Section 3: 2024 Predictions */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      2024 Industry Predictions
                    </h2>
                    <div className="bg-hyve-content/20 p-6 rounded-lg border border-hyve-content">
                      <h3 className="text-xl font-semibold text-hyve-header mb-3">Market Expansion</h3>
                      <p className="mb-4">
                        We predict a 40% growth in real-time aerodynamic testing adoption across motorsports, 
                        with Formula 1 teams increasingly relying on live race data for strategic decisions.
                      </p>
                      
                      <h3 className="text-xl font-semibold text-hyve-header mb-3">Technology Integration</h3>
                      <p className="mb-4">
                        Integration with AI and machine learning algorithms will enable predictive aerodynamic 
                        optimization, reducing development cycles by up to 30%.
                      </p>

                      <h3 className="text-xl font-semibold text-hyve-header mb-3">Sustainability Focus</h3>
                      <p>
                        Environmental regulations will drive increased adoption of efficiency-optimizing 
                        technologies, with sensor-based aerodynamic improvements contributing to net-zero goals.
                      </p>
                    </div>
                  </div>

                  {/* Conclusion */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      Looking Forward
                    </h2>
                    <p className="mb-4">
                      The convergence of advanced sensor technology, real-time data processing, and AI-driven 
                      optimization is creating unprecedented opportunities for aerodynamic innovation. As we 
                      move through 2024, organizations that embrace these technologies will gain significant 
                      competitive advantages in performance, efficiency, and sustainability.
                    </p>
                    <p>
                      Hyve Dynamics remains committed to pushing the boundaries of what's possible in 
                      real-world data acquisition, enabling our partners to transform how they understand 
                      and optimize aerodynamic performance.
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
                      Stay Updated with Hyve Dynamics
                    </CardTitle>
                    <CardDescription className="text-hyve-text/80 font-body">
                      Subscribe to our newsletter for the latest insights in sensor technology and aerodynamic innovation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3 justify-center">
                      <Link to="/insights/newsletter">
                        <Button variant="outline" className="border-hyve-accent text-hyve-text hover:bg-hyve-accent hover:text-white">
                          View More Newsletters
                        </Button>
                      </Link>
                      <Button className="bg-hyve-interactive hover:bg-hyve-interactive-dark text-white">
                        Subscribe Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </motion.div>
            </div> {/* End PDF Content Wrapper */}
          </div>
        </section>
      </div>
    </>
  )
}
