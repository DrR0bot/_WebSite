import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  Download,
  FileText,
  Loader2,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import * as z from 'zod'

import { SEO } from '@/components/common/SEO'
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
import { cn } from '@/lib/utils'

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

const downloadFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
})

type DownloadFormData = z.infer<typeof downloadFormSchema>

interface WhitePaper {
  id: string
  title: string
  description: string
  date: string
  category: string
  fileSize: string
  downloadUrl: string
  featured?: boolean
}

const whitePapers: WhitePaper[] = [
  {
    id: 'nervous-system-for-machines',
    title: 'Nervous System for Machines',
    description:
      'An in-depth look at how Hyve Dynamics is building the nervous system for machines — conformable, high-density sensing arrays that deliver real-time pressure, temperature and strain data across any surface. This paper explores the architecture, applications and transformative potential of the Haptic Matrix platform.',
    date: '2025-01-01',
    category: 'Technology Overview',
    fileSize: '2.4 MB',
    downloadUrl: '/white-papers/hyve-dynamics-nervous-system-for-machines.pdf',
    featured: true,
  },
]

const DownloadDialog: React.FC<{
  open: boolean
  onOpenChange: (open: boolean) => void
  paper: WhitePaper | null
}> = ({ open, onOpenChange, paper }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DownloadFormData>({
    resolver: zodResolver(downloadFormSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: DownloadFormData) => {
    if (!paper) return

    try {
      const response = await fetch('/api/whitepaper-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          paperTitle: paper.title,
        }),
      })

      if (!response.ok) {
        throw new Error('Server error')
      }

      const link = document.createElement('a')
      link.href = paper.downloadUrl
      link.download = ''
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Download starting...', {
        description: 'Your white paper download should begin shortly.',
        duration: 5000,
      })

      reset()
      onOpenChange(false)
    } catch {
      toast.error('Failed to process download', {
        description: 'Please try again or email us at info@hyvedynamics.com',
        duration: 5000,
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={value => {
        onOpenChange(value)
        if (!value) reset()
      }}
    >
      <DialogContent
        className="sm:max-w-[425px] bg-hyve-background"
        aria-describedby="download-form-description"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-body font-light text-hyve-header">
            Download White Paper
          </DialogTitle>
          <DialogDescription id="download-form-description" className="text-hyve-text/70 font-body">
            {paper && (
              <>
                <strong>{paper.title}</strong>
                <br /><br />
                Please enter your details to download this white paper. We respect your privacy and
                will not share your information.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="dl-name" className="text-sm font-body font-medium text-hyve-text">
              Name
            </Label>
            <Input
              id="dl-name"
              {...register('name')}
              placeholder="Your name"
              className={cn(
                'font-body border-hyve-content focus:border-hyve-accent',
                errors.name && 'border-red-500 focus:border-red-500'
              )}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'dl-name-error' : undefined}
            />
            {errors.name && (
              <p id="dl-name-error" className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dl-email" className="text-sm font-body font-medium text-hyve-text">
              Email
            </Label>
            <Input
              id="dl-email"
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              className={cn(
                'font-body border-hyve-content focus:border-hyve-accent',
                errors.email && 'border-red-500 focus:border-red-500'
              )}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'dl-email-error' : undefined}
            />
            {errors.email && (
              <p id="dl-email-error" className="text-sm text-red-500 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </p>
            )}
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
              className="flex-1 bg-hyve-text hover:bg-hyve-text-dark text-white font-body"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const WhitePaperCard: React.FC<{
  paper: WhitePaper
  onDownload: (paper: WhitePaper) => void
}> = ({ paper, onDownload }) => {
  const formattedDate = new Date(paper.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <motion.div
      variants={itemVariants}
      className={cn('group', paper.featured && 'lg:col-span-2')}
    >
      <Card className="h-full bg-white/80 backdrop-blur-sm border border-hyve-content hover:border-hyve-accent transition-all duration-300 hover:shadow-hyve-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <Badge
              variant="secondary"
              className="bg-hyve-accent/20 text-hyve-text hover:bg-hyve-accent/30"
            >
              {paper.category}
            </Badge>
            {paper.featured && (
              <Badge className="bg-hyve-interactive text-white">Featured</Badge>
            )}
          </div>
          <CardTitle className="text-xl md:text-2xl font-heading font-semibold text-hyve-header group-hover:text-hyve-interactive transition-colors">
            {paper.title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-hyve-text/70 mt-2">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              PDF &middot; {paper.fileSize}
            </div>
            <span>{formattedDate}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-hyve-text/80 leading-relaxed mb-6 font-body">
            {paper.description}
          </CardDescription>
          <Button
            variant="outline"
            className="w-full border-hyve-accent text-hyve-text hover:bg-hyve-interactive hover:text-white transition-all duration-200 group-hover:border-hyve-interactive group-hover:text-hyve-interactive"
            onClick={() => onDownload(paper)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download White Paper
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const WhitePapersPage = () => {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)
  const [selectedPaper, setSelectedPaper] = useState<WhitePaper | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleDownload = (paper: WhitePaper) => {
    setSelectedPaper(paper)
    setDownloadDialogOpen(true)
  }

  return (
    <>
      <SEO
        title="White Papers"
        description="Download technical white papers from Hyve Dynamics covering sensing technology, the Haptic Matrix platform, and applications across aerospace, automotive, energy, and robotics."
        keywords="white papers, sensor technology, Haptic Matrix, aerodynamic sensing, surface monitoring, IoT, digital twins, Hyve Dynamics"
      />

      <div className="min-h-screen bg-hyve-background">
        {/* Header Section */}
        <section className="relative py-16 lg:py-20 pointer-events-auto">
          <div className="hyve-container">
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
                  TECHNICAL RESOURCES
                </Badge>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-hyve-header mb-4 font-heading"
              >
                White Papers
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-hyve-text font-light mb-6 max-w-3xl mx-auto"
              >
                In-Depth Technical Insights
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-hyve-text/80 leading-relaxed max-w-4xl mx-auto"
              >
                Explore our collection of white papers covering the architecture, applications and
                transformative potential of real-time sensing technology across industries.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* White Papers Grid */}
        <section className="relative py-16 lg:py-20 pointer-events-auto">
          <div className="hyve-container">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3"
            >
              {whitePapers.map(paper => (
                <WhitePaperCard
                  key={paper.id}
                  paper={paper}
                  onDownload={handleDownload}
                />
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      <DownloadDialog
        open={downloadDialogOpen}
        onOpenChange={setDownloadDialogOpen}
        paper={selectedPaper}
      />
    </>
  )
}
