/**
 * Dev-only banner composer.
 *
 * Renders the Home page's Three.js mesh background (CustomMeshBackground)
 * on its own, at an exact pixel size driven by `?w=` and `?h=` query params,
 * with no header, content or HUD. Nothing else is on the page, so a
 * screenshot of the viewport is a clean brand asset.
 *
 * Why a dedicated route instead of screenshotting `/`:
 *  - On the Home page the mesh canvas spans the full document (~1400×3544),
 *    so the grid and horizon sit far below the fold and the hero region is
 *    almost flat gradient. Sizing the stage ourselves puts the horizon
 *    where we want it.
 *  - The mesh camera has a fixed 60° vertical FOV, so the stage aspect
 *    ratio — not a crop — is what controls the composition.
 *
 * Capture is done by scripts/capture-banner.mjs (`npm run banner`), which
 * screenshots a horizontal band out of this stage. Direct in-page canvas
 * capture is not possible: the renderer is created without
 * `preserveDrawingBuffer`, so html2canvas/toDataURL both return blank.
 *
 * Dev-only, following the same pattern as /deck and /posts — the route is
 * registered behind `import.meta.env.DEV` in src/App.tsx and the module is
 * dead-code-eliminated from production builds.
 */

import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { NoIndex } from '@/components/common/NoIndex'
import { CustomMeshBackground } from '@/components/ui/CustomMeshBackground'

const DEFAULT_W = 1128
const DEFAULT_H = 634

export const BannerPage = () => {
  const [params] = useSearchParams()

  const width = Number(params.get('w')) || DEFAULT_W
  const height = Number(params.get('h')) || DEFAULT_H

  // Signal to the capture script that the stage is mounted at its final
  // size. The script still waits out a settle period afterwards so the
  // wave animation and streamlines are in a pleasing position.
  useEffect(() => {
    document.documentElement.dataset.bannerReady = 'true'
    return () => {
      delete document.documentElement.dataset.bannerReady
    }
  }, [width, height])

  return (
    <>
      <NoIndex
        title="Banner Composer"
        description="Hyve Dynamics internal brand banner composer (dev-only)."
      />

      {/* Pinned to the viewport origin so the capture script can use plain
          clip coordinates without compensating for page margins or scroll. */}
      <div
        id="banner-stage"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${width}px`,
          height: `${height}px`,
          overflow: 'hidden',
        }}
      >
        <CustomMeshBackground enabled className="w-full h-full" />
      </div>
    </>
  )
}
