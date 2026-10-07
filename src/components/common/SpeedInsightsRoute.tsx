import { SpeedInsights } from '@vercel/speed-insights/react'
import { matchPath, useLocation } from 'react-router-dom'

/**
 * Vercel Speed Insights, mounted inside the router so every sample carries a
 * `route` value. Without it the dashboard's Routes tab groups everything
 * under "Unknown" and you cannot see which page is slow.
 *
 * - Skipped in dev: the package falls back to a debug script on
 *   va.vercel-scripts.com, which the dev server's CSP blocks anyway.
 * - Skipped during prerender: `page.content()` serialises the live DOM, so
 *   the injected <script> would be baked into every static snapshot.
 *
 * `routes` is the list of route patterns from App.tsx. Pathnames that match
 * none of them (the `*` catch-all) are reported as `/404` so random URLs do
 * not fan out into hundreds of one-hit routes.
 */
const isPrerender =
  typeof window !== 'undefined' && (window as { __PRERENDER__?: boolean }).__PRERENDER__ === true

const enabled = import.meta.env.PROD && !isPrerender

interface SpeedInsightsRouteProps {
  routes: readonly string[]
}

export const SpeedInsightsRoute = ({ routes }: SpeedInsightsRouteProps) => {
  const { pathname } = useLocation()

  if (!enabled) return null

  const matched = routes.find(pattern => matchPath({ path: pattern, end: true }, pathname))

  return <SpeedInsights route={matched ?? '/404'} />
}
