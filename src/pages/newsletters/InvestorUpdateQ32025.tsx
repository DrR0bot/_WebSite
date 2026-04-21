import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Share2, Download, Lock, TrendingUp, DollarSign, Users, Target } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { NoIndex } from '@/components/common/NoIndex'
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

export const InvestorUpdateQ32025 = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generateNewsletterPDF(
        'investor-newsletter-content',
        'Investor Update Q3 2025',
        '2025-Q3'
      )
      toast.success('PDF downloaded successfully!', {
        description: 'The investor update has been saved to your downloads folder.',
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
      <NoIndex
        title="Q3 2025 Investor Update - Confidential"
        description="Confidential investor update for Hyve Dynamics."
      />

      <div className="min-h-screen bg-hyve-background">
        {/* Header Section */}
        <section className="relative py-16 lg:py-20 pointer-events-auto">
          <div className="hyve-container">
            {/* PDF Content Wrapper - This will be captured for PDF generation */}
            <div id="investor-newsletter-content">
            {/* Confidential Notice */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-800">
                <Lock className="h-5 w-5" />
                <span className="font-semibold">CONFIDENTIAL - INVESTORS ONLY</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                This document contains confidential and proprietary information. Distribution is restricted to authorized investors only.
              </p>
            </motion.div>

            {/* Back Navigation - Excluded from PDF */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 back-navigation"
              data-exclude-from-pdf
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-hyve-text hover:text-hyve-interactive transition-colors font-body"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
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
                <Badge variant="secondary" className="px-4 py-1 text-sm font-medium mb-4 bg-red-100 text-red-800">
                  INVESTOR CONFIDENTIAL
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-hyve-header mb-6 font-heading">
                  Q3 2025 Investor Update
                </h1>

                <div className="flex items-center gap-6 text-sm text-hyve-text/70 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    August 15, 2025
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    10 min read
                  </div>
                </div>

                <div className="flex gap-3" data-exclude-from-pdf>
                  <Button variant="outline" size="sm" className="border-hyve-accent text-hyve-text hover:bg-hyve-accent hover:text-white">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share (Authorized Only)
                  </Button>
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
                  
                  {/* Executive Summary */}
                  <div className="text-xl text-hyve-text/90 font-light leading-relaxed bg-hyve-content/30 p-6 rounded-lg border-l-4 border-hyve-interactive">
                    As we cross the halfway mark of 2025, Hyve Dynamics stands at an exciting inflection point. 
                    Over the past 12 months, we've made foundational advances across our technology, leadership, 
                    and funding strategy - each laying the groundwork for scaled commercialization of our sensor platform.
                  </div>

                  {/* Key Highlights Dashboard */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
                    <Card className="bg-white/80 backdrop-blur-sm border border-hyve-content text-center">
                      <CardHeader className="pb-2">
                        <div className="p-2 rounded-md bg-green-100 w-fit mx-auto">
                          <Target className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-lg font-heading text-hyve-header">10x10</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-hyve-text/80 font-semibold">
                          Sensor Array
                        </CardDescription>
                        <p className="text-sm text-green-600 font-medium">Field Testing</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-hyve-content text-center">
                      <CardHeader className="pb-2">
                        <div className="p-2 rounded-md bg-blue-100 w-fit mx-auto">
                          <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg font-heading text-hyve-header">TRL 6</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-hyve-text/80 font-semibold">
                          Target Level
                        </CardDescription>
                        <p className="text-sm text-blue-600 font-medium">Active Funding</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-hyve-content text-center">
                      <CardHeader className="pb-2">
                        <div className="p-2 rounded-md bg-purple-100 w-fit mx-auto">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <CardTitle className="text-lg font-heading text-hyve-header">Co-CEO</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-hyve-text/80 font-semibold">
                          Leadership Model
                        </CardDescription>
                        <p className="text-sm text-purple-600 font-medium">+ New CTO</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 backdrop-blur-sm border border-hyve-content text-center">
                      <CardHeader className="pb-2">
                        <div className="p-2 rounded-md bg-orange-100 w-fit mx-auto">
                          <DollarSign className="h-6 w-6 text-orange-600" />
                        </div>
                        <CardTitle className="text-lg font-heading text-hyve-header">ATI</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-hyve-text/80 font-semibold">
                          Grant Application
                        </CardDescription>
                        <p className="text-sm text-orange-600 font-medium">Submitted</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Opening Note from Leadership Team */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      Opening Note from the Leadership Team
                    </h2>
                    <div className="bg-hyve-content/20 p-6 rounded-lg border border-hyve-content mb-6 italic">
                      <p className="mb-4 text-hyve-text/90">
                        <strong>Dear Investors,</strong>
                      </p>
                      <p className="mb-4">
                        Over the past year, Hyve Dynamics has transformed from a bold vision into a platform with 
                        real-world traction and strategic momentum. As we continue to grow and mature, we believe 
                        it's essential to keep our shareholders informed, aligned, and engaged with our progress and priorities.
                      </p>
                      <p className="mb-4">
                        That's why, starting today, we're introducing a quarterly investor newsletter. Each edition 
                        will provide you with a transparent view into what we've achieved, what we're building, and 
                        where we're heading next - from major technical milestones to leadership developments, funding 
                        strategy, and commercial traction.
                      </p>
                      <p className="mb-4">
                        We're excited about the road ahead and look forward to sharing our progress with you each quarter. 
                        As always, we're deeply grateful for your continued support and belief in Hyve's mission to give 
                        the physical world a sense of touch.
                      </p>
                      <p className="text-hyve-header font-semibold">
                        With appreciation,<br />
                        Hristiana Georgieva & Jonathan Theodore<br />
                        Co-CEOs, Hyve Dynamics
                      </p>
                    </div>
                  </div>

                  {/* Year in Review */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      Year in Review: Technical Progress
                    </h2>
                    
                    <h3 className="text-xl font-semibold text-hyve-header mb-3">10x10 Sensor Array Testing</h3>
                    <p className="mb-4">
                      We deployed and validated our most advanced array to date, enabling detailed surface data 
                      capture across pressure, strain, and heat - marking a critical leap toward real-world applications. 
                      Our next-gen sensor array is now heading for live field testing, validating real-time 
                      high-resolution surface data across multiple domains.
                    </p>

                    <h3 className="text-xl font-semibold text-hyve-header mb-3">Wind Tunnel Test Preparation</h3>
                    <p className="mb-4">
                      We've been working closely with leading aerospace partners to integrate Hyve arrays into 
                      controlled test environments, with real tunnel trials scheduled for late 2025. We've initiated 
                      pre-integration efforts for wind tunnel testing, with real-world trials scheduled for later this year.
                    </p>

                    <h3 className="text-xl font-semibold text-hyve-header mb-3">R&D and Commercial Maturity</h3>
                    <p className="mb-4">
                      Our next funding round is now underway, focused on scaling the platform to Technology Readiness 
                      Level 6. The goal is to demonstrate our full system in relevant, high-demand environments. We 
                      submitted a proposal to the UK's Aerospace Technology Institute, seeking matched funding to 
                      accelerate technology development and commercial pilot programs.
                    </p>
                  </div>

                  {/* Team & Leadership Growth */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      Team & Leadership Growth
                    </h2>
                    
                    <div className="bg-hyve-content/20 p-6 rounded-lg border border-hyve-content">
                      <h3 className="text-xl font-semibold text-hyve-header mb-3">Executive Leadership Expansion</h3>
                      <ul className="space-y-3">
                        <li>
                          <strong className="text-hyve-header">Co-CEO Model Introduced:</strong> Hristiana Georgieva 
                          and Jonathan Theodore now serve as Co-CEOs, bringing dual strengths in vision and operational excellence.
                        </li>
                        <li>
                          <strong className="text-hyve-header">New CTO Appointed:</strong> Parker Webb-Mitchell joins 
                          as CTO, leading software architecture and platform development to power our next generation 
                          of data and insights.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Road Ahead: Q3-Q4 2025 Priorities */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      Road Ahead: Q3–Q4 2025 Priorities
                    </h2>
                    
                    <p className="mb-4">
                      Looking to the second half of 2025, our focus includes:
                    </p>

                    <ul className="list-disc pl-6 space-y-2 mb-6">
                      <li><strong>Executing Live Wind Tunnel Campaigns:</strong> Our most public and rigorous validation phase to date.</li>
                      <li><strong>Software Stack Expansion:</strong> Including multi-tenant architecture, real-time data dashboards, and API integrations for test environments.</li>
                      <li><strong>Fundraising Momentum:</strong> Engaging early with strategic investors aligned with our technical and commercial goals.</li>
                      <li><strong>Strategic Hiring:</strong> Across engineering, customer success, and business development functions to support pilot projects and product readiness.</li>
                    </ul>
                  </div>

                  {/* Spotlight: Hyve in Motion */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      Spotlight: Hyve in Motion
                    </h2>
                    
                    <div className="bg-hyve-content/20 p-6 rounded-lg border border-hyve-content">
                      <p className="mb-4">
                        This quarter's spotlight is on the <strong>10x10 Sensor Array</strong>, our most versatile and 
                        compact form factor to date. Designed with scalability in mind, this flexible, peel-and-stick 
                        mesh captures dynamic data across high-speed motion environments—making it ideal for use on 
                        aircraft surfaces, automotive exteriors, and wind turbine blades.
                      </p>
                      <p>
                        With Juan at the helm of development, early test results have confirmed consistent accuracy, 
                        low-latency feedback, and environmental durability, validating our approach for mission-critical applications.
                      </p>
                    </div>
                  </div>

                  {/* Investor Brief */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      Investor Brief
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="border-l-4 border-hyve-interactive pl-4">
                        <h4 className="font-semibold text-hyve-header mb-2">Funding Round</h4>
                        <p className="text-sm text-hyve-text/80">
                          Actively raising to support TRL 6 readiness, infrastructure build-out, and initial customer programs.
                        </p>
                      </div>
                      <div className="border-l-4 border-hyve-interactive pl-4">
                        <h4 className="font-semibold text-hyve-header mb-2">Public Grant Application</h4>
                        <p className="text-sm text-hyve-text/80">
                          ATI grant currently under review—success here would double the impact of our R&D investment 
                          and fast-track real-world demonstrations.
                        </p>
                      </div>
                      <div className="border-l-4 border-hyve-interactive pl-4">
                        <h4 className="font-semibold text-hyve-header mb-2">Partnership Discussions</h4>
                        <p className="text-sm text-hyve-text/80">
                          Ongoing conversations with global aerospace and defense contractors to explore pilot integrations in 2026.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Behind the Scenes */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      Behind the Scenes
                    </h2>
                    
                    <p className="mb-4">The past quarter has also been about building the right foundations. We've:</p>
                    
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Completed our cloud roadmap for Hyve's software and analytics stack.</li>
                      <li>Designed customer login portals and test visualization dashboards.</li>
                      <li>Defined our go-to-market strategy with a focus on aerospace, defense, and renewables.</li>
                      <li>Hired top-tier engineering talent with experience in multi-sensor data systems, ML, and industrial-scale monitoring.</li>
                    </ul>
                  </div>

                  {/* Stay Connected */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-hyve-header mb-4 font-heading">
                      Stay Connected
                    </h2>
                    
                    <div className="bg-hyve-content/20 p-6 rounded-lg border border-hyve-content">
                      <p className="mb-4">
                        We'll continue to share quarterly updates, with deeper dives into new technologies, 
                        team growth, customer partnerships, and fundraising activity.
                      </p>
                      <p className="mb-4">
                        If you'd like to see a live demo, meet the leadership team, or join a wind tunnel 
                        test day later this year - please get in touch.
                      </p>
                      <p className="text-hyve-header font-semibold">
                        Thank you for being part of our journey.
                      </p>
                      <p className="text-hyve-text/80 mt-4">
                        — The Hyve Dynamics Team<br />
                        📧 hello@hyvedynamics.com | 🌍 www.hyvedynamics.com
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>

              <Separator className="my-8" />

              {/* Footer CTA */}
              <motion.div variants={itemVariants} className="text-center">
                <Card className="bg-gradient-to-r from-hyve-interactive/10 to-hyve-accent/10 border-hyve-accent/30">
                  <CardHeader>
                    <CardTitle className="text-xl font-heading text-hyve-header">
                      Investor Relations
                    </CardTitle>
                    <CardDescription className="text-hyve-text/80 font-body">
                      For additional information or questions regarding this update, please contact our investor relations team.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" className="border-hyve-accent text-hyve-text hover:bg-hyve-accent hover:text-white">
                        Previous Updates
                      </Button>
                      <Button className="bg-hyve-interactive hover:bg-hyve-interactive-dark text-white">
                        Contact IR Team
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
