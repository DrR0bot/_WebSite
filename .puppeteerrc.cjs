const { join } = require('path');

/**
 * Puppeteer config.
 *
 * Stores the downloaded Chrome binary inside the project (`<root>/.cache/puppeteer`)
 * instead of `~/.cache/puppeteer`. Vercel's build cache preserves project-relative
 * paths between deploys, so Chrome only has to be downloaded once.
 *
 * Required for the post-build prerender step (scripts/prerender.js).
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
