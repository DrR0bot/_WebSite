import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

const defaultSEO = {
  title: 'Hyve Dynamics - Pioneering Real-World Data Acquisition',
  description:
    'Revolutionary ultra-thin sensor technology transforming aerospace, automotive, and energy industries with real-time data acquisition.',
  keywords:
    'aerospace sensors, haptic matrix, real-time data, aerodynamic testing, structural health monitoring, IoT sensors',
  image: '/og-image.png', // You'll need to add this image
  url: 'https://hyvedynamics.com',
  type: 'website',
}

export const SEO: React.FC<SEOProps> = ({ title, description, keywords, image, url, type }) => {
  const seo = {
    title: title ? `${title} | Hyve Dynamics` : defaultSEO.title,
    description: description || defaultSEO.description,
    keywords: keywords || defaultSEO.keywords,
    image: image || defaultSEO.image,
    url: url || defaultSEO.url,
    type: type || defaultSEO.type,
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seo.type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seo.url} />
      <meta property="twitter:title" content={seo.title} />
      <meta property="twitter:description" content={seo.description} />
      <meta property="twitter:image" content={seo.image} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="Hyve Dynamics" />
      <link rel="canonical" href={seo.url} />
    </Helmet>
  )
}
