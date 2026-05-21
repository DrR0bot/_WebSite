import * as path from 'path'

import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
// import createSitemap from 'vite-plugin-sitemap'
import { defineConfig } from 'vite'

// Dev-only plugin that lets the LinkedIn post composer (src/pages/social)
// save each slide as a 1080×1350 PNG into a local folder. Apply: 'serve'
// inside the plugin ensures it never runs in `vite build`.
// Default writes into the brand's Social_Posts OneDrive folder; override
// with `SOCIAL_POSTS_DIR=<absolute path>` env var if you're another dev.
// eslint-disable-next-line import/no-unresolved
import savePostsPlugin from './scripts/vite-plugin-save-posts.mjs'

const SOCIAL_POSTS_OUTPUT_DIR =
  process.env.SOCIAL_POSTS_DIR ??
  'C:/Users/jtobo/OneDrive/Documents/04_Hyve_Dynamics/07_Brand_and_Web/Social_Posts'

// Enhanced security headers for production
const getSecurityHeaders = (isProduction = false) => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'accelerometer=()',
    'gyroscope=()',
    'magnetometer=()',
    'usb=()',
    'serial=()',
    'bluetooth=()',
  ].join(', '),
  ...(isProduction && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Expect-CT': 'max-age=86400, enforce',
  }),
  'Content-Security-Policy': [
    "default-src 'self'",
    isProduction
      ? "script-src 'self'"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://api.hyvedynamics.com",
    "media-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    'upgrade-insecure-requests',
    'block-all-mixed-content',
  ].join('; '),
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
})

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/_WebSite/' : '/',
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
    savePostsPlugin({ outputDir: SOCIAL_POSTS_OUTPUT_DIR }),
    // Note: Sitemap created manually in public/sitemap.xml
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    headers: getSecurityHeaders(false), // Development headers
  },
  preview: {
    headers: getSecurityHeaders(true), // Production-like headers for preview
  },
  build: {
    // Optimize build
    rollupOptions: {
      output: {
manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            'framer-motion',
            '@radix-ui/react-dialog',
            '@radix-ui/react-navigation-menu',
          ],
          'three-vendor': ['three'],
          'swiper-vendor': ['swiper'],
        },
      },
    },
  },
})
