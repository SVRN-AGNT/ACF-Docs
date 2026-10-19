/**
 * Framed contract — what the ACF dashboard relies on when it shows these pages
 *
 * Run: npm run test:framed-contract
 *
 * The dashboard's Framework Docs pages frame this site live instead of carrying
 * a copy of its text (ACFDashboard src/features/framework/data/docsSite.ts), so
 * a docs edit reaches the app the moment it deploys. Four things on this side
 * keep that working, and a change to any of them breaks the app silently,
 * because nothing in this repository renders inside it:
 *
 *   1. No response header refuses framing. An X-Frame-Options or a CSP
 *      frame-ancestors would blank every Framework Docs page in the app.
 *   2. Every page that sets its theme before paint takes the app's theme from
 *      ?theme= when framed, and keeps it for the session so links inside the
 *      frame keep it too.
 *   3. The framed theme switch belongs to the app: the page hides its own
 *      toggle and follows the parent frame's acf-docs:theme message, and
 *      nothing else's.
 *   4. The routes and section ids the app links to still exist. The app's
 *      Attention panel deep-links a signal to the section that explains it;
 *      DEEP_LINKS below mirrors docsSite.ts, and a renamed id or route goes
 *      red here before it turns into a link that lands at the top of a page.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import nextConfig from '../next.config.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SITE_B = path.join(ROOT, 'public', 'site-b');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// Mirrors DOCS_PAGES and the deep-link anchors in the dashboard's docsSite.ts.
const DEEP_LINKS = {
  '/part-1-foundation': [],
  '/part-2-lineage-macro-thesis': ['macro-thesis'],
  '/part-3-bitcoin-convexity-backbone': [],
  '/part-4-tax-architecture-roc-strategy': [],
  '/part-5-portfolio-construction-position-management': ['management', 'exhibit-p5-earnings-window'],
  '/part-6-convexity-framework-integrity-scoring': ['cis', 'failure'],
};

test('framed: no response header refuses framing', async () => {
  const rules = await nextConfig.headers();
  for (const rule of rules) {
    for (const { key, value } of rule.headers) {
      assert.notEqual(key.toLowerCase(), 'x-frame-options', `${rule.source} sets X-Frame-Options`);
      if (key.toLowerCase() === 'content-security-policy') {
        assert.doesNotMatch(value, /frame-ancestors/, `${rule.source} sets frame-ancestors`);
      }
    }
  }
  assert.ok(!fs.existsSync(path.join(ROOT, 'vercel.json')), 'a vercel.json could add headers this test does not read');
});

test('framed: every pre-paint theme script takes the app theme when framed', () => {
  const pages = fs.readdirSync(SITE_B)
    .filter((f) => f.endsWith('.html'))
    .filter((f) => read(`public/site-b/${f}`).includes('Set the theme BEFORE first paint'));
  assert.ok(pages.length >= 12, `found ${pages.length} themed pages`);
  for (const f of pages) {
    const html = read(`public/site-b/${f}`);
    assert.match(html, /framed = window\.self !== window\.top/, `${f} detects the frame`);
    assert.match(html, /classList\.add\('is-framed'\)/, `${f} marks the frame`);
    assert.match(html, /\[\?&\]theme=\(light\|dark\)/, `${f} reads ?theme= (light or dark only)`);
    assert.match(html, /sessionStorage\.setItem\('acf-framed-theme'/, `${f} keeps it for the session`);
  }
});

test('framed: the app owns the theme switch', () => {
  const css = read('public/site-b/reading-system.css');
  assert.match(css, /html\.is-framed \.theme-toggle \{ display: none; \}/, 'the page hides its own toggle');
  const core = read('public/site-b/reading-core.js');
  assert.match(core, /\n  framedTheme\(\);\n/, 'the listener is wired');
  const body = core.slice(core.indexOf('function framedTheme()'));
  assert.match(body, /event\.source !== window\.parent/, 'only the parent frame is heard');
  assert.match(body, /data\.theme !== 'light' && data\.theme !== 'dark'/, 'only the two theme names are accepted');
});

test('framed: every route and section the app links to exists', async () => {
  const { beforeFiles } = await nextConfig.rewrites();
  for (const [route, anchors] of Object.entries(DEEP_LINKS)) {
    const rewrite = beforeFiles.find((r) => r.source === route);
    assert.ok(rewrite, `${route} is still a route`);
    const html = read(path.join('public', rewrite.destination));
    for (const id of anchors) {
      assert.match(html, new RegExp(`id="${id}"`), `${route}#${id} exists`);
    }
  }
});
