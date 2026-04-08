import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, Calendar, Clock, FileText, Loader2, Newspaper, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { SEO } from '@/components/common/SEO'
import { ShareButtons } from '@/components/common/ShareButtons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { newsletterFormSchema, type NewsletterFormData } from '@/lib/form-schemas'
import { cn } from '@/lib/utils'

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

// Newsletter data
interface Newsletter {
  id: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  featured?: boolean
  href: string
}

const newsletters: Newsletter[] = [
  {
    id: 'aerodynamic-innovation-2024',
    title: 'Aerodynamic Innovation: 2024 Industry Outlook',
    description: 'Discover how Hyve\'s Haptic Matrix technology is revolutionizing aerodynamic testing across aerospace and automotive industries. From Formula 1 to commercial aviation, explore the latest advancements in real-time data acquisition.',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Industry Insights',
    featured: true,
    href: '/insights/newsletter/aerodynamic-innovation-2024',
  },
  {
    id: 'sensor-technology-trends',
    title: 'The Future of Sensor Technology: Trends Shaping 2024',
    description: 'Explore the cutting-edge developments in ultra-thin sensor technology and how IoT integration is transforming structural health monitoring, robotics, and energy systems.',
    date: '2023-12-20',
    readTime: '6 min read',
    category: 'Technology',
    featured: false,
    href: '/insights/newsletter/sensor-technology-trends',
  },
]

const SubscribeDialog: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
}> = ({ open, onOpenChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterFormSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, name: data.name }),
      })
      if (!response.ok) throw new Error('Server error')
      toast.success('Successfully subscribed!', {
        description: "You'll receive our latest insights directly to your inbox.",
        duration: 5000,
      })
      reset()
      onOpenChange(false)
    } catch {
      toast.error('Failed to subscribe', {
        description: 'Please try again or email us at info@hyvedynamics.com',
        duration: 5000,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) reset() }}>
      <DialogContent className="sm:max-w-[425px] bg-hyve-background" aria-describedby="subscribe-form-desc">
        <DialogHeader>
          <DialogTitle className="text-2xl font-body font-light text-hyve-header">
            Subscribe to Newsletter
          </DialogTitle>
          <DialogDescription id="subscribe-form-desc" className="text-hyve-text/70 font-body">
            Get the latest insights on sensor technology, aerodynamic innovation, and industry trends
            delivered directly to your inbox.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nl-email" className="text-sm font-body font-medium text-hyve-text">
              Email *
            </Label>
            <Input
              id="nl-email"
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              className={cn('font-body border-hyve-content focus:border-hyve-accent', errors.email && 'border-red-500 focus:border-red-500')}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nl-name" className="text-sm font-body font-medium text-hyve-text">
              Name (optional)
            </Label>
            <Input
              id="nl-name"
              {...register('name')}
              placeholder="Your name"
              className="font-body border-hyve-content focus:border-hyve-accent"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 font-body border-hyve-content text-hyve-text hover:bg-hyve-content"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-hyve-interactive hover:bg-hyve-interactive-dark text-white font-body"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subscribing...
                </span>
              ) : (
                'Subscribe'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const NewsletterCard: React.FC<{ newsletter: Newsletter; index: number }> = ({
  newsletter,
}) => {
  const formattedDate = new Date(newsletter.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        'group',
        newsletter.featured && 'lg:col-span-2'
      )}
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm border border-hyve-content hover:border-hyve-accent transition-all duration-300 hover:shadow-hyve-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="secondary"
              className="bg-hyve-accent/20 text-hyve-text hover:bg-hyve-accent/30"
            >
              {newsletter.category}
            </Badge>
            {newsletter.featured && (
              <Badge className="bg-hyve-interactive text-white">
                Featured
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl md:text-2xl font-heading font-semibold text-hyve-header group-hover:text-hyve-interactive transition-colors">
            {newsletter.title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-hyve-text/70 mt-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {newsletter.readTime}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-hyve-text/80 leading-relaxed mb-6 font-body">
            {newsletter.description}
          </CardDescription>
          <div className="flex items-center gap-2">
            <Link to={newsletter.href} className="flex-1">
              <Button 
                variant="outline" 
                className="w-full border-hyve-accent text-hyve-text hover:bg-hyve-interactive hover:text-white transition-all duration-200 group-hover:border-hyve-interactive group-hover:text-hyve-interactive"
              >
                <FileText className="h-4 w-4 mr-2" />
                Read Newsletter
              </Button>
            </Link>
            <ShareButtons
              url={newsletter.href}
              title={newsletter.title}
              description={newsletter.description}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const NewsletterPage = () => {
  const [subscribeOpen, setSubscribeOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SEO
        title="Newsletter Archive"
        description="Stay informed with Hyve Dynamics' latest insights on sensor technology, aerodynamic innovation, and industry trends. Access our newsletter archive covering aerospace, automotive, energy, and robotics sectors."
        keywords="newsletter, sensor technology, aerodynamic testing, aerospace insights, automotive innovation, IoT sensors, industry trends, Hyve Dynamics updates"
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
              className="text-center"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
                  INSIGHTS & UPDATES
                </Badge>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-hyve-header mb-4 font-heading"
              >
                Newsletter Archive
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-hyve-text font-light mb-6 max-w-3xl mx-auto"
              >
                Stay Informed with the Latest in Sensor Innovation
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-hyve-text/80 leading-relaxed max-w-4xl mx-auto"
              >
                Discover insights from Hyve Dynamics on cutting-edge sensor technology, aerodynamic 
                innovation, and industry trends across aerospace, automotive, energy, and robotics sectors.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Grid Section */}
        <section className="relative py-16 lg:py-20 pointer-events-auto">
          <div className="hyve-container">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3"
            >
              {newsletters.map((newsletter, index) => (
                <NewsletterCard
                  key={newsletter.id}
                  newsletter={newsletter}
                  index={index}
                />
              ))}
            </motion.div>

            {/* Subscription CTA */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="mt-16 text-center"
            >
              <Card className="bg-gradient-to-r from-hyve-interactive/10 to-hyve-accent/10 border-hyve-accent/30 max-w-2xl mx-auto">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-hyve-interactive/20">
                      <Newspaper className="h-6 w-6 text-hyve-interactive" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-heading text-hyve-header">
                    Subscribe to Our Newsletter
                  </CardTitle>
                  <CardDescription className="text-hyve-text/80 font-body">
                    Get the latest insights, industry trends, and technology updates delivered 
                    directly to your inbox.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="bg-hyve-interactive hover:bg-hyve-interactive-dark text-white"
                    onClick={() => setSubscribeOpen(true)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>

      <SubscribeDialog open={subscribeOpen} onOpenChange={setSubscribeOpen} />
    </>
  )
}
