/**
 * Dev-only LinkedIn post composer.
 *
 * Mirrors the architecture of src/pages/deck/PitchDeckPage.tsx:
 *  - Mounted only when import.meta.env.DEV (dead-code-eliminated in prod)
 *  - <NoIndex> meta so it never gets indexed if it ever does ship
 *  - Swiper with keyboard nav so navigating between post templates is fast
 *
 * Workflow:
 *  1. Run `npm run dev` and open http://localhost:5173/posts
 *  2. Navigate slides with arrow keys, pagination dots, or nav arrows
 *  3. Click "Save PNG" to export the active slide at exact 1080×1350
 *     directly into the Social_Posts folder (see scripts/vite-plugin-save-posts.mjs)
 *     OR screenshot the framed 4:5 canvas region and paste into LinkedIn
 *
 * Adding a new post template:
 *  - Drop a component into ./posts/MyPost.tsx
 *  - Import it below and append to POSTS with a unique id + variant
 *  - That's it — Swiper picks it up automatically
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { Download, Loader2, Maximize2, Minimize2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import { toast } from 'sonner'

import { NoIndex } from '@/components/common/NoIndex'

import { ThesisCover } from './posts/ThesisCover'
import { BigQuote } from './posts/BigQuote'
import { AudienceOEM } from './posts/AudienceOEM'
import { IndustryDigitalTwin } from './posts/IndustryDigitalTwin'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import './SocialPosts.css'

// LinkedIn portrait post canvas — exact pixel dimensions used by LinkedIn's
// 4:5 mobile feed render. Keep these constants in sync with SocialPosts.css.
const CANVAS_W = 1080
const CANVAS_H = 1350

type Variant = 'light' | 'dark' | 'accent'

interface PostConfig {
  id: string
  label: string
  variant: Variant
  Component: React.FC
}

const POSTS: PostConfig[] = [
  { id: 'thesis-cover',         label: 'Thesis Cover',         variant: 'light',  Component: ThesisCover },
  { id: 'big-quote',            label: 'Big Quote',            variant: 'dark',   Component: BigQuote },
  { id: 'audience-oem',         label: 'For OEM R&D Leaders',  variant: 'light',  Component: AudienceOEM },
  { id: 'industry-digitaltwin', label: 'Digital Twin / IVHM',  variant: 'accent', Component: IndustryDigitalTwin },
]

/**
 * Calculate the largest `transform: scale()` that fits the 1080×1350 canvas
 * into the viewport while leaving ~120 px breathing room for Swiper nav and
 * the bottom hint strip. Recomputed on resize.
 */
const useFitScale = () => {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const HORIZONTAL_PAD = 160 // arrows + side margin
    const VERTICAL_PAD = 140   // counter, pagination, hint
    const calc = () => {
      const sx = (window.innerWidth - HORIZONTAL_PAD) / CANVAS_W
      const sy = (window.innerHeight - VERTICAL_PAD) / CANVAS_H
      setScale(Math.min(sx, sy, 1))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  return scale
}

export const SocialPostsPage = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const scale = useFitScale()

  // While capturing, force scale=1 so html2canvas sees the canvas at its
  // native 1080×1350 pixel dimensions instead of the scaled-to-fit preview.
  const renderScale = isCapturing ? 1 : scale

  // One ref per slide index — populated via ref-callback when Swiper mounts
  // the SwiperSlide. We use this to find the active slide's DOM node at
  // capture time (Swiper keeps all slides in the DOM, just translated).
  const canvasRefs = useRef<Array<HTMLDivElement | null>>([])

  const active = POSTS[activeIndex]

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  /**
   * Capture the active slide at exact 1080×1350 and POST it to the dev-only
   * `/__save-post` endpoint, which writes the PNG into the configured
   * Social_Posts folder (see `scripts/vite-plugin-save-posts.mjs`).
   */
  const savePng = useCallback(async () => {
    if (isSaving) return
    const node = canvasRefs.current[activeIndex]
    if (!node) {
      toast.error('Cannot find the slide canvas — try navigating away and back.')
      return
    }

    setIsSaving(true)
    setIsCapturing(true)

    try {
      // Wait for the unscaled layout + custom fonts to be ready before
      // we hand the node to html2canvas. Two RAFs guarantee that the
      // scale=1 transform has been applied to the DOM.
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
      if (document.fonts && typeof document.fonts.ready?.then === 'function') {
        await document.fonts.ready
      }

      // Capture the actual rendered pixel size of every <img> in the live
      // canvas. html2canvas otherwise falls back to an SVG's intrinsic
      // viewBox dimensions and ignores CSS sizing (e.g. `h-16 w-auto`),
      // which makes images render at the wrong size in the export.
      // We re-apply these as explicit width/height HTML attributes on the
      // cloned tree via the onclone hook below.
      // (Brand SVGs are rendered via the <Logo> component as inline SVG
      // and so are not <img> elements — this fix mostly protects PNG
      // assets like MatrixMesh-r5.png in ThesisCover.)
      const imageSizes = Array.from(node.querySelectorAll('img')).map(img => {
        const rect = img.getBoundingClientRect()
        return { width: Math.round(rect.width), height: Math.round(rect.height) }
      })

      const canvas = await html2canvas(node, {
        width: CANVAS_W,
        height: CANVAS_H,
        scale: 1,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        onclone: (_doc, clonedNode) => {
          const clonedImgs = (clonedNode as HTMLElement).querySelectorAll('img')
          clonedImgs.forEach((img, idx) => {
            const size = imageSizes[idx]
            if (!size) return
            img.setAttribute('width', String(size.width))
            img.setAttribute('height', String(size.height))
            img.style.width = `${size.width}px`
            img.style.height = `${size.height}px`
          })
        },
      })

      const dataUrl = canvas.toDataURL('image/png')
      const ts = new Date()
        .toISOString()
        .replace(/[:T]/g, '-')
        .replace(/\..+$/, '')
      const filename = `hyve-${active.id}-${ts}.png`

      const res = await fetch('/__save-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, dataUrl }),
      })

      if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText)
        throw new Error(msg || `HTTP ${res.status}`)
      }

      const { path: writtenPath } = (await res.json()) as { path: string }
      toast.success(`Saved ${filename}`, {
        description: writtenPath,
        duration: 5000,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error('Save failed', { description: message })
      console.error('[social-posts] save failed:', err)
    } finally {
      setIsCapturing(false)
      setIsSaving(false)
    }
  }, [activeIndex, active.id, isSaving])

  return (
    <>
      <NoIndex
        title="Social Post Composer"
        description="Hyve Dynamics internal LinkedIn post composer (dev-only)."
      />

      <div className="social-composer">
        {/* Overlay HUD */}
        <div className="composer-ui inset-0">
          <Link
            to="/"
            className="fixed top-5 left-6 opacity-60 hover:opacity-90 transition-all duration-300"
            aria-label="Back to home"
          >
            <img src="/logo_white.svg" alt="Hyve Dynamics" className="h-6 md:h-7 w-auto" />
          </Link>

          <div className="fixed top-5 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.2em] text-white/45">
            <span>{active.label}</span>
            <span className="text-white/25">·</span>
            <span>{active.variant}</span>
          </div>

          <span className="fixed top-5 right-6 text-xs font-mono tabular-nums text-white/45">
            {String(activeIndex + 1).padStart(2, '0')} / {String(POSTS.length).padStart(2, '0')}
          </span>

          <div className="fixed bottom-5 right-6 flex items-center gap-4">
            <button
              onClick={savePng}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/15 bg-white/5 text-white/80 hover:text-hyve-accent hover:border-hyve-accent/60 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-[12px] font-mono uppercase tracking-[0.15em]"
              aria-label="Save current slide as 1080×1350 PNG"
              title="Save current slide as PNG → Social_Posts folder"
            >
              {isSaving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              <span>{isSaving ? 'Saving…' : 'Save PNG'}</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="text-white/35 hover:text-hyve-accent transition-colors duration-300"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        <p className="composer-hint">
          Click <strong className="text-white/55">Save PNG</strong> for crisp 1080×1350 export to your Social_Posts folder · or screenshot the frame
        </p>

        {/* Swiper of post canvases */}
        <Swiper
          modules={[Pagination, Navigation, Keyboard]}
          direction="horizontal"
          slidesPerView={1}
          spaceBetween={0}
          speed={400}
          pagination={{ clickable: true }}
          navigation
          keyboard={{ enabled: true }}
          onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.activeIndex)}
          className="w-full h-full"
        >
          {POSTS.map(({ id, variant, Component }, idx) => (
            <SwiperSlide key={id}>
              <div
                ref={node => {
                  canvasRefs.current[idx] = node
                }}
                className={`social-canvas social-canvas--${variant}`}
                style={{ transform: `scale(${renderScale})` }}
              >
                <Component />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
}
