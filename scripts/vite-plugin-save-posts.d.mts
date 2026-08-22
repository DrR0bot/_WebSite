/**
 * Type declarations for the plain-JS plugin in vite-plugin-save-posts.mjs.
 *
 * vite.config.ts is compiled by tsconfig.node.json, which is strict and has no
 * `allowJs`, so without this paired declaration the import resolves to an
 * implicit `any` and `tsc -b` fails with TS7016 — breaking `npm run build`.
 */
import type { Plugin } from 'vite'

export default function savePostsPlugin(options: { outputDir: string }): Plugin
