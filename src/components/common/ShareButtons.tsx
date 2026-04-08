import { Check, Copy, Linkedin, Twitter } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const SITE_URL = 'https://hyvedynamics.com'

interface ShareButtonsProps {
  url?: string
  title: string
  description?: string
  className?: string
  size?: 'sm' | 'default'
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  description,
  className,
  size = 'sm',
}) => {
  const [copied, setCopied] = useState(false)

  const shareUrl = url?.startsWith('http') ? url : `${SITE_URL}${url || ''}`
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedDesc = encodeURIComponent(description || title)

  const handleLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      '_blank',
      'noopener,noreferrer,width=600,height=600'
    )
  }

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedDesc}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const btnSize = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(btnSize, 'text-hyve-text/50 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10')}
        onClick={handleLinkedIn}
        title="Share on LinkedIn"
      >
        <Linkedin className={iconSize} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(btnSize, 'text-hyve-text/50 hover:text-black hover:bg-black/10')}
        onClick={handleTwitter}
        title="Share on X"
      >
        <Twitter className={iconSize} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(btnSize, 'text-hyve-text/50 hover:text-hyve-interactive hover:bg-hyve-interactive/10')}
        onClick={handleCopy}
        title="Copy link"
      >
        {copied ? <Check className={iconSize} /> : <Copy className={iconSize} />}
      </Button>
    </div>
  )
}
