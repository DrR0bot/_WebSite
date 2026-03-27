import { Calendar, Clock, ExternalLink } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

type ArticleCategory = 'all' | 'news' | 'press' | 'blog'

interface ExternalLinkItem {
  label: string
  url: string
}

interface ArticleData {
  title: string
  description: string
  date: string
  readTime: string
  category: ArticleCategory
  categoryLabel: string
  content?: string[]
  image?: string
  externalLinks?: ExternalLinkItem[]
}

interface ArticleDrawerProps {
  article: ArticleData | null
  open: boolean
  onClose: () => void
}

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

export const ArticleDrawer: React.FC<ArticleDrawerProps> = ({ article, open, onClose }) => {
  if (!article) return null

  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto bg-white p-0"
      >
        {article.image && (
          <div className="w-full h-48 sm:h-56 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="px-6 sm:px-8 py-6">
          <SheetHeader className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="secondary" className={getCategoryColor(article.category)}>
                {article.categoryLabel}
              </Badge>
            </div>

            <SheetTitle className="text-2xl sm:text-3xl font-bold text-hyve-header font-heading leading-tight">
              {article.title}
            </SheetTitle>

            <div className="flex items-center gap-4 text-sm text-hyve-text/60 mt-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formattedDate}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime}
              </div>
            </div>

            <SheetDescription className="text-base text-hyve-text/80 leading-relaxed mt-4 font-medium">
              {article.description}
            </SheetDescription>
          </SheetHeader>

          {article.content && article.content.length > 0 && (
            <div className="space-y-4 mb-8">
              <div className="h-px bg-hyve-content/20" />
              {article.content.map((paragraph, index) => (
                <p key={index} className="text-sm sm:text-base text-hyve-text/80 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {article.externalLinks && article.externalLinks.length > 0 && (
            <div className="border-t border-hyve-content/20 pt-6">
              <h4 className="text-xs font-semibold text-hyve-text/50 uppercase tracking-wide mb-3">
                Related Links
              </h4>
              <div className="space-y-2">
                {article.externalLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-hyve-interactive hover:text-hyve-interactive-dark transition-colors group"
                  >
                    <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="group-hover:underline">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
