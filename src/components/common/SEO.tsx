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

const SITE_URL = 'https://hyvedynamics.com'

const defaultSEO = {
  title: 'Hyve Dynamics - Transforming Industries Through Real-World Intelligence',
  description:
    'Conformable, high-density sensing arrays delivering real-time pressure, temperature and strain data. Proven in Tier 1 aerospace testing, built for every industry where surface behaviour matters.',
  keywords:
    'Haptic Matrix, sensor technology, aerodynamic testing, real-time data acquisition, structural health monitoring, digital twins, IoT sensors, aerospace sensors, automotive sensors, Hyve Dynamics',
  image: `${SITE_URL}/og-image.png`,
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

  const seo = {
    title: title ? `${title} | Hyve Dynamics` : defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: keywords || defaultSEO.keywords,
    image: image || defaultSEO.image,
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
