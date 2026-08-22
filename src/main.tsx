import { SpeedInsights } from '@vercel/speed-insights/react'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'

import './index.css'
import './styles/responsive-fixes.css'
import App from './App.tsx'
import { setupAxe } from './lib/axe-setup'
import { validateEnvironment } from './lib/env'
import { initializeSecurity } from './lib/security-config'
import { reportWebVitals } from './lib/web-vitals'

/**
 * Inject Google Fonts stylesheet asynchronously after first paint.
 * The CSS itself is preloaded from index.html; here we just attach it
 * once the browser is idle, so it never blocks FCP/LCP. CSP-safe
 * (no inline handlers — runs from the bundled, same-origin script).
 */
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&family=JetBrains+Mono&display=swap'

const loadFonts = () => {
  if (document.querySelector(`link[rel="stylesheet"][href="${FONTS_HREF}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = FONTS_HREF
  document.head.appendChild(link)
}

type RIC = (cb: () => void, opts?: { timeout: number }) => number
const ric = (window as Window & { requestIdleCallback?: RIC }).requestIdleCallback
if (typeof ric === 'function') {
  ric(loadFonts, { timeout: 2000 })
} else {
  window.setTimeout(loadFonts, 800)
}

// Validate environment variables at startup
try {
  validateEnvironment()
  initializeSecurity()
} catch (error) {
  console.error('Failed to start application:', error)
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
      <div style="text-align: center; padding: 2rem; border: 1px solid #ef4444; border-radius: 8px; background: #fef2f2;">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Configuration Error</h1>
        <p style="color: #7f1d1d;">Please check your environment variables and try again.</p>
        <pre style="margin-top: 1rem; padding: 1rem; background: #fff; border-radius: 4px; text-align: left; overflow: auto;">
          ${error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    </div>
  `
  throw error
}

/**
 * Vercel Speed Insights is mounted only for real production page loads.
 *
 * - Skipped in dev because the package falls back to a debug script on
 *   va.vercel-scripts.com, which the dev server's CSP (`script-src 'self'`
 *   plus unsafe-inline/eval) blocks anyway.
 * - Skipped during prerender because `page.content()` serialises the whole
 *   live DOM, so the script tag the component injects into <head> would be
 *   baked into every static snapshot. See scripts/prerender.js.
 *
 * All routes in App.tsx are static paths, so the default pathname grouping
 * matches the route patterns and no `route` prop is needed.
 */
const isPrerender =
  typeof window !== 'undefined' && (window as { __PRERENDER__?: boolean }).__PRERENDER__ === true
const enableSpeedInsights = import.meta.env.PROD && !isPrerender

const rootElement = document.getElementById('root')!
const appTree = (
  <StrictMode>
    <HelmetProvider>
      <App />
      {enableSpeedInsights && <SpeedInsights />}
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast: 'bg-white border-gray-200 shadow-lg',
            title: 'text-gray-900 font-medium',
            description: 'text-gray-600',
            success: 'bg-green-50 border-green-200',
            error: 'bg-red-50 border-red-200',
            warning: 'bg-yellow-50 border-yellow-200',
            info: 'bg-blue-50 border-blue-200',
          },
        }}
        richColors
        closeButton
      />
    </HelmetProvider>
  </StrictMode>
)

// If the snapshot prerender has populated #root with real HTML, hydrate it
// in place to avoid a flash of empty content. Otherwise fall back to the
// regular client render. See scripts/prerender.js.
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, appTree)
} else {
  createRoot(rootElement).render(appTree)
}

// Report web vitals
reportWebVitals()

// Setup accessibility checks in development
setupAxe()

// Register service worker for PWA support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}
