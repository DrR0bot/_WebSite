import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  ArrowRight,
  Newspaper,
  Megaphone,
  PenTool,
  Rss,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { SEO } from '@/components/common/SEO'
import { ArticleDrawer } from '@/components/ui/ArticleDrawer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

type ArticleCategory = 'all' | 'news' | 'press' | 'blog'

interface ExternalLinkItem {
  label: string
  url: string
}

interface NewsArticle {
  id: string
  title: string
  description: string
  date: string
  readTime: string
  category: ArticleCategory
  categoryLabel: string
  featured?: boolean
  content?: string[]
  image?: string
  externalLinks?: ExternalLinkItem[]
}

const newsArticles: NewsArticle[] = [
  {
    id: 'sustainable-skies-2026',
    title: 'Hyve Dynamics Returns to Sustainable Skies World Summit',
    description:
      'For the second consecutive year, Hyve Dynamics exhibited at the Sustainable Skies World Summit in Farnborough — selected by ATI for their Innovator Showcase alongside five other companies driving sustainable aviation forward.',
    date: '2026-03-17',
    readTime: '3 min read',
    category: 'news',
    categoryLabel: 'Company News',
    featured: true,
    content: [
      'Hyve Dynamics returned to the Sustainable Skies World Summit (SSWS) on 17\u201318 March 2026, held at the Farnborough International Exhibition & Conference Centre. For the second consecutive year, Hyve was selected by the Aerospace Technology Institute (ATI) to showcase our technology to the global aviation sustainability community.',
      'In 2026, Hyve was one of six companies chosen for the ATI\u2019s Innovator Showcase, alongside Jigsaw Structures, LAYRR, SHD Composite Materials, Conflux Technology, and Darvick. As described by ATI, Hyve is \u201cenabling a step-change in aerospace sustainability through real-time, high-resolution aerodynamic and structural data captured directly from the aircraft surface \u2014 even in extreme conditions such as wing icing or inside aero-engines.\u201d',
      'This builds on our first appearance in 2025, when Hyve was one of seven companies to exhibit in the ATI Start-Up Zone \u2014 a curated showcase run in collaboration with the ATI Hub. That year, we exhibited alongside 3T Additive Manufacturing, Alloyed, CirculAIRity, Sora Aviation, ToffeeX, and Ultima Forma.',
      'The Sustainable Skies World Summit brings together leaders from across the aerospace sector to address the industry\u2019s most pressing sustainability challenges \u2014 from non-CO\u2082 emissions and sustainable aviation fuels to next-generation aircraft design and operational efficiency. Partners and supporters include major industry names such as Embraer, IAG, Joby, Vertical Aerospace, NATS, and the Royal Aeronautical Society.',
      'Hyve\u2019s conformable sensing technology directly supports these goals. By providing dense, real-time aerodynamic and structural data during testing and operation, our sensing arrays help engineers optimise designs for fuel efficiency, validate sustainable materials, and reduce development cycles \u2014 all critical steps on the path to cleaner aviation.',
      'Being invited back for a second year \u2014 and elevated from the Start-Up Zone to the Innovator Showcase \u2014 reinforces the growing relevance of surface intelligence in the sustainability conversation.',
    ],
    externalLinks: [
      {
        label: 'ATI Innovator Showcase \u2014 SSWS 2026 (LinkedIn)',
        url: 'https://www.linkedin.com/posts/aerospace-technology-institute_sustainableskiesworldsummit-ssws26-aerospace-activity-7438150836029071360-fN6D/',
      },
      {
        label: 'Hyve Dynamics \u2014 SSWS 2026 Sponsors & Partners',
        url: 'https://sustainableskies.co.uk/sponsors-partners/',
      },
      {
        label: 'ATI Highlights from Sustainable Skies 2025',
        url: 'https://www.ati.org.uk/news-events/news/four-highlights-from-sustainable-skies-world-summit-2025-2/',
      },
      {
        label: 'Sustainable Skies World Summit',
        url: 'https://sustainableskies.world/',
      },
    ],
  },
  {
    id: 'nwtf-conference-2025',
    title: 'Hyve Dynamics at the National Wind Tunnel Conference 2025',
    description:
      'Hyve Dynamics sponsored and exhibited at the NWTF Conference 2025 in Birmingham, showcasing our flexible membrane sensor technology to over 100 delegates from across the UK wind tunnel community.',
    date: '2025-04-03',
    readTime: '2 min read',
    category: 'news',
    categoryLabel: 'Company News',
    image: `${import.meta.env.BASE_URL}NWTF-April2025.jpg`,
    content: [
      'Hyve Dynamics was proud to sponsor and exhibit at the National Wind Tunnel Facility (NWTF) Conference 2025, held in Birmingham. The event brought together over 100 delegates and featured 41 presentations, including 6 keynote speakers and 21 oral abstracts, alongside poster sessions and networking opportunities.',
      'As one of four sponsors — alongside ATE, Evolution Measurement, and Imetrum — Hyve demonstrated our Flexible Membrane Sensor technology, which replaces traditional pressure taps with thousands of live data points, delivering high-resolution pressure and strain maps in real time.',
      'The NWTF has also featured our technology on their New Technology page, recognising the Flexible Membrane Sensor as a significant advancement for the wind tunnel testing community. As described by the NWTF: "Hyve\'s flexible sensor skin replaces pressure taps with thousands of live data points, delivering high-resolution pressure and strain maps in real time — cutting test time, increasing accuracy, and unlocking true surface intelligence."',
      'Our technology has been proven to match the performance of traditional pressure taps while delivering up to 100 times the data density, enabling far more detailed surface mapping, faster iteration, and deeper aerodynamic insight across aerospace, automotive, and beyond.',
      'The conference provided an excellent opportunity to connect with wind tunnel operators, researchers, and industry professionals who are actively looking for next-generation instrumentation solutions. The next NWTF Conference will take place in 2027.',
    ],
    externalLinks: [
      {
        label: 'NWTF Conference 2025 Wrap-Up',
        url: 'https://www.nwtf.ac.uk/news/nwtf-conference-2025-wraps-up/',
      },
      {
        label: 'Hyve Flexible Membrane Sensor — NWTF New Technology',
        url: 'https://www.nwtf.ac.uk/new-technology/flexible-membrane-sensor/',
      },
    ],
  },
  {
    id: 'trl6-advancement',
    title: 'Advancing to TRL 6: Our Technology Readiness Journey',
    description:
      'A deep dive into our progression toward Technology Readiness Level 6, including the rigorous aerospace environmental testing protocols we\'re completing.',
    date: '2025-01-10',
    readTime: '6 min read',
    category: 'blog',
    categoryLabel: 'Blog',
  },
  {
    id: 'aerospace-innovation-award',
    title: 'Hyve Dynamics Recognized for Aerospace Innovation',
    description:
      'We\'re honored to be recognized by the Aerospace Technology Institute for our contributions to next-generation sensing technology.',
    date: '2024-12-15',
    readTime: '3 min read',
    category: 'news',
    categoryLabel: 'Company News',
  },
  {
    id: 'biomimicry-sensor-design',
    title: 'How Nature Inspired Our Sensor Technology',
    description:
      'Exploring the biomimetic principles behind the Haptic Matrix and how we replicated the peripheral nervous system\'s distributed sensing capabilities.',
    date: '2024-11-28',
    readTime: '8 min read',
    category: 'blog',
    categoryLabel: 'Blog',
  },
  {
    id: 'net-zero-aviation',
    title: 'Supporting Net-Zero Aviation Goals Through Real-Time Data',
    description:
      'How our sensor technology is helping aerospace manufacturers optimize fuel efficiency and reduce emissions in their development programs.',
    date: '2024-11-15',
    readTime: '5 min read',
    category: 'news',
    categoryLabel: 'Company News',
  },
]

const categoryFilters: { id: ArticleCategory; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All', icon: Rss },
  { id: 'news', label: 'Company News', icon: Newspaper },
  { id: 'press', label: 'Press Releases', icon: Megaphone },
  { id: 'blog', label: 'Blog', icon: PenTool },
]

const getCategoryColor = (category: ArticleCategory) => {
  switch (category) {
    case 'news':
      return 'bg-blue-100 text-blue-700'
    case 'press':
      return 'bg-purple-100 text-purple-700'
    case 'blog':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-hyve-accent/20 text-hyve-text'
  }
}

const FeaturedHero: React.FC<{ article: NewsArticle; onReadMore: (article: NewsArticle) => void }> = ({
  article,
  onReadMore,
}) => {
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const hasContent = article.content && article.content.length > 0

  return (
    <motion.div variants={itemVariants} className="group mb-2">
      <div
        role={hasContent ? 'button' : undefined}
        tabIndex={hasContent ? 0 : undefined}
        onClick={() => hasContent && onReadMore(article)}
        onKeyDown={(e) => { if (hasContent && (e.key === 'Enter' || e.key === ' ')) onReadMore(article) }}
        className={cn('block', hasContent && 'cursor-pointer')}
      >
        {article.image && (
          <div className="w-full h-64 md:h-80 overflow-hidden rounded-lg mb-6">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex items-center gap-3 mb-3">
          <Badge variant="secondary" className={getCategoryColor(article.category)}>
            {article.categoryLabel}
          </Badge>
          <Badge className="bg-hyve-interactive text-white">Featured</Badge>
        </div>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-hyve-header group-hover:text-hyve-interactive transition-colors mb-3 leading-tight">
          {article.title}
        </h2>
        <div className="flex items-center gap-4 text-sm text-hyve-text/60 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {article.readTime}
          </div>
        </div>
        <p className="text-base md:text-lg text-hyve-text/80 leading-relaxed max-w-3xl">
          {article.description}
        </p>
        {hasContent && (
          <div className="flex items-center text-hyve-interactive font-medium text-sm mt-4 group-hover:gap-2 transition-all">
            Read full article
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
      <div className="h-[2px] bg-hyve-header/20 mt-8" />
    </motion.div>
  )
}

const NewsCard: React.FC<{ article: NewsArticle; onReadMore: (article: NewsArticle) => void }> = ({
  article,
  onReadMore,
}) => {
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const hasContent = article.content && article.content.length > 0

  return (
    <motion.article variants={itemVariants} className="group pb-6 mb-6 border-b-2 border-hyve-header/15 last:border-b-0 last:mb-0 last:pb-0">
      <div
        role={hasContent ? 'button' : undefined}
        tabIndex={hasContent ? 0 : undefined}
        onClick={() => hasContent && onReadMore(article)}
        onKeyDown={(e) => { if (hasContent && (e.key === 'Enter' || e.key === ' ')) onReadMore(article) }}
        className={hasContent ? 'cursor-pointer' : ''}
      >
        {article.image && (
          <div className="w-full h-40 overflow-hidden rounded-lg mb-4">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}
        <Badge variant="secondary" className={cn('mb-2', getCategoryColor(article.category))}>
          {article.categoryLabel}
        </Badge>
        <h3 className="text-lg md:text-xl font-heading font-semibold text-hyve-header group-hover:text-hyve-interactive transition-colors mb-2 leading-snug">
          {article.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-hyve-text/60 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {article.readTime}
          </div>
        </div>
        <p className="text-sm text-hyve-text/70 leading-relaxed">
          {article.description}
        </p>
        {hasContent && (
          <div className="flex items-center text-hyve-interactive font-medium text-xs mt-3 group-hover:gap-1.5 transition-all">
            Read more
            <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </motion.article>
  )
}

export const NewsPage = () => {
  const [activeFilter, setActiveFilter] = useState<ArticleCategory>('all')
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filteredArticles =
    activeFilter === 'all'
      ? newsArticles
      : newsArticles.filter(article => article.category === activeFilter)

  const featuredArticle = filteredArticles.find(a => a.featured)
  const remainingArticles = filteredArticles.filter(a => !a.featured)
  const midpoint = Math.ceil(remainingArticles.length / 2)
  const leftColumn = remainingArticles.slice(0, midpoint)
  const rightColumn = remainingArticles.slice(midpoint)

  return (
    <>
      <SEO
        title="News & Blog"
        description="Stay updated with the latest news, press releases, and blog posts from Hyve Dynamics. Discover insights on sensor technology, aerospace innovation, and industry developments."
        keywords="Hyve Dynamics news, sensor technology blog, aerospace press releases, company updates, innovation insights, technology news"
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
                  INSIGHTS & UPDATES
                </Badge>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-hyve-header mb-4 font-heading"
              >
                News & Blog
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-hyve-text font-light mb-6 max-w-3xl mx-auto"
              >
                The Latest from Hyve Dynamics
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-hyve-text/80 leading-relaxed max-w-4xl mx-auto"
              >
                Stay informed with company news, press releases, and insights on sensor technology,
                aerospace innovation, and the future of real-world data acquisition.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="relative pb-8 pointer-events-auto">
          <div className="hyve-container">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-center gap-3"
            >
              {categoryFilters.map(filter => {
                const Icon = filter.icon
                return (
                  <motion.div key={filter.id} variants={itemVariants}>
                    <Button
                      variant={activeFilter === filter.id ? 'default' : 'outline'}
                      className={cn(
                        'flex items-center gap-2 transition-all',
                        activeFilter === filter.id
                          ? 'bg-hyve-interactive text-white hover:bg-hyve-interactive-dark'
                          : 'border-hyve-content text-hyve-text hover:border-hyve-interactive hover:text-hyve-interactive'
                      )}
                      onClick={() => setActiveFilter(filter.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {filter.label}
                    </Button>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Newspaper Layout */}
        <section className="relative py-8 lg:py-12 pointer-events-auto">
          <div className="hyve-container">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Featured Hero */}
              {featuredArticle && (
                <FeaturedHero article={featuredArticle} onReadMore={setSelectedArticle} />
              )}

              {/* Two-column newspaper layout */}
              {remainingArticles.length > 0 && (
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="md:pr-8 md:border-r-2 border-hyve-header/15">
                    {leftColumn.map(article => (
                      <NewsCard key={article.id} article={article} onReadMore={setSelectedArticle} />
                    ))}
                  </div>
                  <div className="md:pl-8">
                    {rightColumn.map(article => (
                      <NewsCard key={article.id} article={article} onReadMore={setSelectedArticle} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {filteredArticles.length === 0 && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="text-center py-16"
              >
                <Newspaper className="h-16 w-16 text-hyve-content mx-auto mb-4" />
                <p className="text-hyve-text/70 text-lg">
                  No articles found in this category.
                </p>
              </motion.div>
            )}

            {/* Newsletter CTA */}
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
                      <Rss className="h-6 w-6 text-hyve-interactive" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-heading text-hyve-header">
                    Stay Updated
                  </CardTitle>
                  <CardDescription className="text-hyve-text/80 font-body">
                    Subscribe to receive the latest news and insights directly to your inbox.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/insights/newsletter">
                    <Button
                      variant="outline"
                      className="border-hyve-interactive text-hyve-interactive hover:bg-hyve-interactive hover:text-white"
                    >
                      <Newspaper className="h-4 w-4 mr-2" />
                      View Newsletters
                    </Button>
                  </Link>
                  <Button className="bg-hyve-interactive hover:bg-hyve-interactive-dark text-white">
                    <Rss className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <div className="h-16" />
      </div>

      {/* Article Drawer */}
      <ArticleDrawer
        article={selectedArticle}
        open={selectedArticle !== null}
        onClose={() => setSelectedArticle(null)}
      />
    </>
  )
}
