/**
 * vite-plugin-save-posts
 *
 * Dev-only Vite plugin that adds a single endpoint:
 *   POST /__save-post   { filename: string, dataUrl: string }
 *
 * It decodes the data URL, validates the filename, and writes the PNG to
 * `outputDir`. Used by `src/pages/social/SocialPostsPage.tsx` so the LinkedIn
 * post composer can save each slide as a 1080×1350 PNG with one click.
 *
 * Production safety:
 *   - `apply: 'serve'` ensures this plugin only runs under `vite dev`
 *   - The middleware is never registered for `vite build` or `vite preview`
 *   - The endpoint path is namespaced with `__` so it can't collide with app
 *     routes
 *
 * Filename hardening:
 *   - Only [a-zA-Z0-9._-] permitted (no directory traversal, no spaces)
 *   - Forced `.png` extension
 *   - Resolved path is asserted to live inside outputDir (defence-in-depth)
 */

import fs from 'node:fs'
import path from 'node:path'

const ENDPOINT = '/__save-post'
const SAFE_NAME_RE = /^[a-zA-Z0-9._-]+$/

/**
 * @param {{ outputDir: string }} options
 */
export default function savePostsPlugin({ outputDir }) {
  if (!outputDir) {
    throw new Error('vite-plugin-save-posts: `outputDir` is required')
  }
  const resolvedRoot = path.resolve(outputDir)

  return {
    name: 'vite-plugin-save-posts',
    apply: 'serve',
    configureServer(server) {
      // Make sure the directory exists at startup — fail loud if we can't.
      try {
        fs.mkdirSync(resolvedRoot, { recursive: true })
      } catch (err) {
        server.config.logger.error(
          `[save-posts] cannot create output dir ${resolvedRoot}: ${err.message}`,
          { timestamp: true }
        )
      }

      server.middlewares.use(ENDPOINT, (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Allow', 'POST')
          return res.end('Method Not Allowed')
        }

        let body = ''
        req.on('data', chunk => {
          body += chunk
          // Hard cap at ~16 MB to avoid runaway memory in dev.
          if (body.length > 16 * 1024 * 1024) {
            res.statusCode = 413
            res.end('Payload too large')
            req.destroy()
          }
        })

        req.on('end', () => {
          let payload
          try {
            payload = JSON.parse(body)
          } catch {
            res.statusCode = 400
            return res.end('Invalid JSON')
          }

          const { filename, dataUrl } = payload ?? {}

          if (typeof filename !== 'string' || !SAFE_NAME_RE.test(filename)) {
            res.statusCode = 400
            return res.end(
              'Invalid filename — only letters, numbers, dot, dash and underscore allowed.'
            )
          }
          if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/png;base64,')) {
            res.statusCode = 400
            return res.end('Invalid dataUrl — expected PNG base64.')
          }

          const safeName = filename.endsWith('.png') ? filename : `${filename}.png`
          const target = path.resolve(resolvedRoot, safeName)

          // Defence-in-depth — the regex already prevents traversal, but
          // double-check the resolved path stays inside outputDir.
          if (!target.startsWith(resolvedRoot + path.sep)) {
            res.statusCode = 400
            return res.end('Refusing to write outside the configured output directory.')
          }

          const base64 = dataUrl.slice('data:image/png;base64,'.length)
          const buffer = Buffer.from(base64, 'base64')

          try {
            fs.writeFileSync(target, buffer)
          } catch (err) {
            server.config.logger.error(
              `[save-posts] failed to write ${target}: ${err.message}`,
              { timestamp: true }
            )
            res.statusCode = 500
            return res.end(`Failed to write file: ${err.message}`)
          }

          server.config.logger.info(
            `[save-posts] wrote ${target} (${buffer.length} bytes)`,
            { timestamp: true }
          )

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: true, path: target, bytes: buffer.length }))
        })
      })

      server.config.logger.info(
        `[save-posts] POST ${ENDPOINT} → ${resolvedRoot}`,
        { timestamp: true }
      )
    },
  }
}
