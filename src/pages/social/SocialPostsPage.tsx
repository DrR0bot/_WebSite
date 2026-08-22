/**
 * Dev-only LinkedIn post composer.
 *
 * Mirrors the architecture of src/pages/deck/PitchDeckPage.tsx:
 *  - Mounted only when import.meta.env.DEV (dead-code-eliminated in prod)
 *  - <NoIndex> meta so it never gets indexed if it ever does ship
 *  - Swiper with keyboard nav so navigating between post templates is fast
 *
 * Each post template exports both its `Component` and a `caption` string
 * (the 2–3 line "hook" that goes above the image on LinkedIn). The
 * composer surfaces the active post's caption in a small panel at the
 * bottom of the viewport with a Copy button, so the workflow is:
 *
 *   1. Pick the post visually
 *   2. Screenshot the framed 4:5 canvas
 *   3. Click "Copy" → paste the caption into LinkedIn → attach the image
 *
 * Adding a new post template:
 *  - Drop a component into ./posts/MyPost.tsx with named exports
 *      `Component` and `caption`
 *  - Import both below and append to POSTS with a unique id + variant
 *  - That's it — Swiper picks it up automatically
 */

import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Navigation, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { Check, Copy, Maximize2, MessageSquare, MessageSquareOff, Minimize2 } from 'lucide-react'

import { NoIndex } from '@/components/common/NoIndex'

import { ThesisCover, caption as thesisCoverCaption } from './posts/ThesisCover'
import { ClosedLoop, caption as closedLoopCaption } from './posts/ClosedLoop'
import { NoHallucinations, caption as noHallucinationsCaption } from './posts/NoHallucinations'
import { BigQuote, caption as bigQuoteCaption } from './posts/BigQuote'
import { AudienceOEM, caption as audienceOEMCaption } from './posts/AudienceOEM'
import { IndustryDigitalTwin, caption as industryDigitalTwinCaption } from './posts/IndustryDigitalTwin'
import { DefenseCover, caption as defenseCoverCaption } from './posts/DefenseCover'

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
  caption: string
}

// Order is intentional: thesis → close-the-loop manifesto → grounded-AI
// counterpoint → big-quote thought leadership → OEM audience → digital
// twin → defence cover. Reorder freely; pagination + navigation follow.
const POSTS: PostConfig[] = [
  { id: 'thesis-cover',         label: 'Thesis Cover',         variant: 'light',  Component: ThesisCover,         caption: thesisCoverCaption },
  { id: 'closed-loop',          label: 'Close the Loop',       variant: 'accent', Component: ClosedLoop,          caption: closedLoopCaption },
  { id: 'no-hallucinations',    label: 'No Hallucinations',    variant: 'dark',   Component: NoHallucinations,    caption: noHallucinationsCaption },
  { id: 'big-quote',            label: 'Big Quote',            variant: 'dark',   Component: BigQuote,            caption: bigQuoteCaption },
  { id: 'audience-oem',         label: 'For OEM R&D Leaders',  variant: 'light',  Component: AudienceOEM,         caption: audienceOEMCaption },
  { id: 'industry-digitaltwin', label: 'Digital Twin / IVHM',  variant: 'accent', Component: IndustryDigitalTwin, caption: industryDigitalTwinCaption },
  { id: 'defense-cover',        label: 'Defence Cover',        variant: 'dark',   Component: DefenseCover,        caption: defenseCoverCaption },
]

/**
 * Calculate the largest `transform: scale()` that fits the 1080×1350 canvas
 * into the viewport while leaving room for Swiper nav, the pagination dots,
 * and (optionally) the bottom caption panel.
 *
 * When the caption panel is visible we reserve ~400 px of vertical space
 * so the panel sits *below* the canvas rather than overlapping it. When
 * the panel is hidden we drop back to a tight ~160 px pad so the canvas
 * can fill the screen for clean screenshots.
 */
const useFitScale = (captionVisible: boolean) => {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const HORIZONTAL_PAD = 160 // arrows + side margin
    const VERTICAL_PAD = captionVisible ? 400 : 160
    const calc = () => {
      const sx = (window.innerWidth - HORIZONTAL_PAD) / CANVAS_W
      const sy = (window.innerHeight - VERTICAL_PAD) / CANVAS_H
      setScale(Math.min(sx, sy, 1))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [captionVisible])

  return scale
}

/**
 * Floating panel showing the active post's LinkedIn caption + a Copy
 * button. Lives at the bottom of the viewport (above Swiper pagination).
 *
 * Clipboard API is available on localhost (treated as a secure context),
 * so no fallback is wired. If the write fails we just log it.
 */
const CaptionPanel: React.FC<{ caption: string }> = ({ caption }) => {
  const [copied, setCopied] = useState(false)

  // Reset the "Copied" state when the caption itself changes (i.e. the
  // user navigates between posts), so the next post always shows "Copy".
  useEffect(() => {
    setCopied(false)
  }, [caption])

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(caption)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn('[social-posts] clipboard write failed', err)
    }
  }, [caption])

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[min(720px,92vw)] z-[120] rounded-xl border border-white/10 bg-black/55 backdrop-blur-md px-5 py-4 flex items-start gap-4 shadow-lg">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/40 mb-1.5">
          LinkedIn caption
        </p>
        <p className="text-[13px] leading-snug text-white/85 whitespace-pre-line">
          {caption}
        </p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-md border border-white/15 bg-white/5 text-white/80 hover:text-hyve-accent hover:border-hyve-accent/60 transition-colors duration-200 text-[11px] font-mono uppercase tracking-[0.15em]"
        aria-label="Copy caption to clipboard"
        title="Copy the caption to paste into LinkedIn"
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  )
}

export const SocialPostsPage = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // Caption panel can be hidden so the user can take a clean screenshot of
  // the canvas without the panel covering the bottom of the design.
  // Default true so the feature is discoverable.
  const [captionVisible, setCaptionVisible] = useState(true)
  const scale = useFitScale(captionVisible)

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

  const toggleCaption = useCallback(() => {
    setCaptionVisible(v => !v)
  }, [])

  // Press "C" (no modifiers) to toggle the caption panel. Skip when the
  // user is typing into an input/textarea so we don't hijack normal text
  // entry, and ignore Cmd/Ctrl+C so native copy still works.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault()
        toggleCaption()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleCaption])

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
              onClick={toggleCaption}
              className="text-white/35 hover:text-hyve-accent transition-colors duration-300"
              aria-label={captionVisible ? 'Hide caption panel' : 'Show caption panel'}
              title={captionVisible ? 'Hide caption (C)' : 'Show caption (C)'}
            >
              {captionVisible ? <MessageSquare size={18} /> : <MessageSquareOff size={18} />}
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

        {/* Caption panel — surfaces the active post's LinkedIn copy.
            Toggle off with the MessageSquare button or "C" key to take a
            clean screenshot of the canvas without the panel in the way. */}
        {captionVisible && <CaptionPanel caption={active.caption} />}

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
          {POSTS.map(({ id, variant, Component }) => (
            <SwiperSlide key={id}>
              <div
                className={`social-canvas social-canvas--${variant}`}
                style={{ transform: `scale(${scale})` }}
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
