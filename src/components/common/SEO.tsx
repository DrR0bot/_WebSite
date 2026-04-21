import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown>
}

const SITE_URL = 'https://www.hyvedynamics.com'

const defaultSEO = {
  title: 'Hyve Dynamics - The Physical Data Layer for AI',
  description:
    'Hyve Dynamics is the nervous system for machines in the AI era — flexible, high-density sensor arrays giving AI systems real-time perception of the physical world. Validated in Tier 1 aerospace testing. Also known as the physical data layer for AI.',
  keywords:
    'nervous system for machines, sensing for AI, physical-world perception for AI, embodied AI, ground truth data for AI, Haptic Matrix, flexible sensor arrays, high-density pressure sensors, real-time aerodynamic data, digital twin sensor data, structural health monitoring, aerospace sensors, physical data layer for AI, Hyve Dynamics',
  image: `${SITE_URL}/og_image.png`,
  type: 'website',
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type,
  noindex = false,
  jsonLd,
}) => {
  const location = useLocation()

  const pageTitle = title ? `${title} | Hyve Dynamics` : defaultSEO.title
  const pageDescription = description || defaultSEO.description

  const ogImageUrl = image || defaultSEO.image

  const seo = {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords || defaultSEO.keywords,
    image: ogImageUrl,
    url: url || `${SITE_URL}${location.pathname}`,
    type: type || defaultSEO.type,
  }

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />

      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:site_name" content="Hyve Dynamics" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="language" content="English" />
      <meta name="author" content="Hyve Dynamics" />
      <link rel="canonical" href={seo.url} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
