/**
 * Logo — fetches an SVG file and renders its markup INLINE in the DOM.
 *
 * Why not just <img src="...svg">?
 *
 * html2canvas rasterises <img> elements via a canvas drawImage path that
 * does NOT honour <style> blocks inside SVG files. Both of Hyve's logo
 * files (HD-Logo-dk2.svg and logo_white.svg) define their fills via
 * `<style>.cls-N { fill: ... }</style>` + `class="cls-N"` on each path
 * (the standard Adobe Illustrator / Inkscape export pattern). When
 * html2canvas processes these as <img>s, the class-based fills are lost
 * and every path falls back to black — which happens to look ok-ish for
 * the dark logo on a light background, but makes the white logo's
 * wordmark vanish on a dark background.
 *
 * Inlining the SVG fixes this because html2canvas walks the SVG DOM and
 * applies the cloned <style> block correctly, preserving every fill.
 *
 * The component caches each SVG so we only fetch once per URL. It also
 * extracts the viewBox to apply the right CSS `aspect-ratio`, so a
 * sizing class like `h-14 w-auto` works exactly as it would on an <img>.
 */

import { useEffect, useMemo, useState } from 'react'

interface LogoProps {
  src: string
  /** Sizing classes (e.g. "h-14 w-auto"). Width is derived from the SVG
   *  viewBox via CSS `aspect-ratio`, so `w-auto` works as expected. */
  className?: string
  alt?: string
}

// Module-scoped cache so each SVG file is only fetched once per session.
const svgCache = new Map<string, string>()

/**
 * Namespace class names and ids inside an SVG so two inlined logos can
 * coexist in one document.
 *
 * Both brand files (HD-Logo-dk2.svg and logo_white.svg) are Illustrator
 * exports that use the SAME generic names: `.cls-1 … .cls-8` and gradient
 * ids `linear-gradient`, `linear-gradient-2`, … When both are inlined on
 * the same page (e.g. the leaflet, which has a dark front and a white
 * back), the second <style> block overrides the first and `url(#id)`
 * references resolve to whichever element appeared first — the dark
 * logo's "H" picked up the white logo's fill and vanished in print.
 */
const namespaceSvg = (svg: string, key: string) => {
  const ns = `l${hashString(key)}`
  return (
    svg
      // class names: in the <style> block (.cls-3) and in class="" attrs
      .replace(/\.cls-(\d+)/g, `.cls-${ns}-$1`)
      .replace(
        /class="([^"]*)"/g,
        (_m, classes: string) => `class="${classes.replace(/\bcls-(\d+)\b/g, `cls-${ns}-$1`)}"`
      )
      // ids and every way of referencing them
      .replace(/\bid="([^"]+)"/g, `id="$1-${ns}"`)
      .replace(/url\(#([^)]+)\)/g, `url(#$1-${ns})`)
      .replace(/(xlink:href|href)="#([^"]+)"/g, `$1="#$2-${ns}"`)
  )
}

const hashString = (s: string) => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

export const Logo = ({ src, className = '', alt = '' }: LogoProps) => {
  const [content, setContent] = useState<string | null>(() => svgCache.get(src) ?? null)

  useEffect(() => {
    if (svgCache.has(src)) {
      setContent(svgCache.get(src)!)
      return
    }
    let cancelled = false
    fetch(src)
      .then(r => r.text())
      .then(raw => {
        const text = namespaceSvg(raw, src)
        svgCache.set(src, text)
        if (!cancelled) setContent(text)
      })
      .catch(() => {
        if (!cancelled) setContent('')
      })
    return () => {
      cancelled = true
    }
  }, [src])

  const aspectRatio = useMemo(() => {
    if (!content) return undefined
    const m = content.match(/viewBox=["']([\d.\s-]+)["']/)
    if (!m) return undefined
    const parts = m[1].trim().split(/\s+/).map(Number)
    if (parts.length !== 4) return undefined
    const [, , w, h] = parts
    return w && h ? w / h : undefined
  }, [content])

  // Until the fetch resolves, render as <img> so something is visible.
  // The export should never hit this fallback because SocialPostsPage
  // mounts all post components on first paint (Swiper keeps every slide
  // in the DOM), so all logo fetches kick off well before the user
  // clicks Save PNG.
  if (!content) {
    return <img src={src} alt={alt} className={className} />
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`logo-inline ${className}`}
      style={aspectRatio ? { aspectRatio: String(aspectRatio) } : undefined}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
