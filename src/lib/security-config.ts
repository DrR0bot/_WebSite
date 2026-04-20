// Production security configuration and utilities

import { env } from './env'

/**
 * Security configuration for different environments
 */
export const securityConfig = {
  /**
   * Content Security Policy configuration
   */
  csp: {
    // Base CSP that works across environments
    base: [
      "default-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "frame-src 'none'",
      'upgrade-insecure-requests',
      'block-all-mixed-content',
    ],

    // Development CSP (more permissive for dev tools)
    development: [
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com", // Allow HMR, dev tools, and Three.js CDN
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' ws: wss:", // Allow WebSocket for HMR
      "media-src 'self' blob:",
    ],

    // Production CSP (strict)
    production: [
      "script-src 'self' https://cdnjs.cloudflare.com", // Allow Three.js from CDN
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com", // Still need unsafe-inline for Tailwind
      "font-src 'self' fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:", // Allow external images over HTTPS
      `connect-src 'self' ${env.API_URL} https://api.hyvedynamics.com`,
      "media-src 'self' blob:",
    ],

    // Additional CSP directives for analytics and monitoring
    withAnalytics: [
      "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
      "img-src 'self' data: blob: https: https://www.google-analytics.com",
    ],

    withSentry: [`connect-src 'self' https://sentry.io https://*.ingest.sentry.io`],
  },

  /**
   * Security headers configuration
   */
  headers: {
    // Always applied security headers
    base: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
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
    },

    // Production-only headers
    production: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Expect-CT': 'max-age=86400, enforce',
    },
  },

  /**
   * Rate limiting configuration
   */
  rateLimiting: {
    // Form submission limits
    forms: {
      maxAttempts: env.IS_PRODUCTION ? 3 : 10,
      windowMs: 60000, // 1 minute
    },

    // API request limits
    api: {
      maxAttempts: env.IS_PRODUCTION ? 100 : 1000,
      windowMs: 60000, // 1 minute
    },

    // Authentication attempts
    auth: {
      maxAttempts: 5,
      windowMs: 300000, // 5 minutes
    },
  },

  /**
   * Input validation settings
   */
  validation: {
    // Maximum input lengths
    maxLengths: {
      name: 100,
      email: 254, // RFC 5321 limit
      subject: 200,
      message: 5000,
      url: 2048, // Common browser limit
    },

    // Allowed file types for uploads
    allowedFileTypes: {
      images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      documents: ['application/pdf', 'text/plain'],
    },

    // Maximum file sizes (in bytes)
    maxFileSizes: {
      image: 5 * 1024 * 1024, // 5MB
      document: 10 * 1024 * 1024, // 10MB
    },
  },
}

/**
 * Generate environment-appropriate CSP string
 */
export function generateCSP(): string {
  const csp = [...securityConfig.csp.base]

  // Add environment-specific directives
  if (env.IS_DEVELOPMENT) {
    csp.push(...securityConfig.csp.development)
  } else {
    csp.push(...securityConfig.csp.production)
  }

  // Add analytics directives if enabled
  if (env.ENABLE_ANALYTICS && env.GA_MEASUREMENT_ID) {
    csp.push(...securityConfig.csp.withAnalytics)
  }

  // Add Sentry directives if configured
  if (env.SENTRY_DSN) {
    csp.push(...securityConfig.csp.withSentry)
  }

  // Add CSP reporting if enabled
  if (env.ENABLE_CSP_REPORTS && env.CSP_REPORT_URI) {
    csp.push(`report-uri ${env.CSP_REPORT_URI}`)
    csp.push(`report-to csp-endpoint`)
  }

  return csp.join('; ')
}

/**
 * Generate environment-appropriate security headers
 */
export function generateSecurityHeaders(): Record<string, string> {
  const headers: Record<string, string> = { ...securityConfig.headers.base }

  // Add production-only headers
  if (env.IS_PRODUCTION) {
    Object.assign(headers, securityConfig.headers.production)
  }

  // Add CSP header
  headers['Content-Security-Policy'] = generateCSP()

  return headers
}

/**
 * Validate if current environment meets security requirements
 */
export function validateSecurityRequirements(): {
  valid: boolean
  warnings: string[]
  errors: string[]
} {
  const warnings: string[] = []
  const errors: string[] = []

  // Allow local hosts to bypass the HTTPS gate. This covers:
  //   - `vite preview` runs (used by the build-time prerender pass)
  //   - `npm run preview` for local production smoke testing
  //   - any localhost/127.0.0.1 staging context
  // Production deploys hit a real domain over HTTPS and still enforce.
  const hostname = window.location.hostname
  const isLocalHost =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname.endsWith('.local')

  // Check HTTPS requirement in production (skip for local hosts)
  if (
    env.IS_PRODUCTION &&
    !isLocalHost &&
    !window.location.protocol.startsWith('https:')
  ) {
    errors.push('HTTPS is required in production')
  }

  // Check for secure context (skip for local hosts)
  if (!window.isSecureContext && env.IS_PRODUCTION && !isLocalHost) {
    errors.push('Secure context (HTTPS) is required for security features')
  }

  // Check environment variables
  if (env.IS_PRODUCTION) {
    if (!env.SENTRY_DSN) {
      warnings.push('Error tracking (Sentry) not configured')
    }

    if (env.ENABLE_DEBUG_TOOLS) {
      errors.push('Debug tools should be disabled in production')
    }

    if (!env.GA_MEASUREMENT_ID && env.ENABLE_ANALYTICS) {
      warnings.push('Analytics enabled but GA_MEASUREMENT_ID not set')
    }
  }

  // Check browser security features
  if (!window.crypto || !window.crypto.getRandomValues) {
    warnings.push('Crypto API not available - using fallback random generation')
  }

  // Check for modern security APIs
  if (!('navigator' in window) || !navigator.userAgent) {
    warnings.push('Navigator API not available - some security features may not work')
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  }
}

/**
 * Initialize security configuration on app startup
 */
export function initializeSecurity(): void {
  const validation = validateSecurityRequirements()

  // Log security status
  if (env.IS_DEVELOPMENT) {
    // Security configuration loaded for development
  }

  // Handle validation results
  validation.warnings.forEach(warning => {
    console.warn('⚠️ Security Warning:', warning)
  })

  validation.errors.forEach(error => {
    console.error('🚨 Security Error:', error)
  })

  if (!validation.valid && env.IS_PRODUCTION) {
    throw new Error(`Security validation failed: ${validation.errors.join(', ')}`)
  }

  // Set up CSP violation reporting if configured
  if (env.ENABLE_CSP_REPORTS && window.addEventListener) {
    window.addEventListener('securitypolicyviolation', event => {
      console.warn('CSP Violation:', {
        blockedURI: event.blockedURI,
        directive: event.effectiveDirective,
        originalPolicy: event.originalPolicy,
        violatedDirective: event.violatedDirective,
        sourceFile: event.sourceFile,
        lineNumber: event.lineNumber,
      })

      // Send to reporting endpoint if configured
      if (env.CSP_REPORT_URI) {
        fetch(env.CSP_REPORT_URI, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            'csp-report': {
              'blocked-uri': event.blockedURI,
              'effective-directive': event.effectiveDirective,
              'original-policy': event.originalPolicy,
              'violated-directive': event.violatedDirective,
              'source-file': event.sourceFile,
              'line-number': event.lineNumber,
              timestamp: new Date().toISOString(),
              'user-agent': navigator.userAgent,
            },
          }),
        }).catch(error => {
          console.error('Failed to report CSP violation:', error)
        })
      }
    })
  }
}
