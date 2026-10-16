// The root icon files are copies of the brand set, not a second drawing.
//
// Browsers, crawlers and Vercel's project card ask for /favicon.ico and
// /apple-touch-icon.png at the site root without reading any <link> tag. The
// pages point at /site-b/brand/, so without these copies the root paths 404
// and Vercel falls back to the default Next.js icon. Byte equality keeps the
// copies from drifting when the brand set is regenerated.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC = path.resolve(import.meta.dirname, '..', 'public');

for (const name of ['favicon.ico', 'apple-touch-icon.png']) {
  test(`/${name} is the brand set's ${name}`, () => {
    const root = fs.readFileSync(path.join(PUBLIC, name));
    const brand = fs.readFileSync(path.join(PUBLIC, 'site-b', 'brand', name));
    assert.ok(root.equals(brand), `public/${name} differs from public/site-b/brand/${name}; copy it again`);
  });
}

// The SVG favicon is parsed as XML when a tab loads it as an image, and XML
// forbids "--" inside a comment. The generated banner once named its --token,
// which left this file malformed: loaded as an image, Chromium drew nothing.
test('the brand favicon.svg is well-formed (no "--" inside a comment)', () => {
  const svg = fs.readFileSync(path.join(PUBLIC, 'site-b', 'brand', 'favicon.svg'), 'utf8');
  const comments = svg.match(/<!--([\s\S]*?)-->/g) || [];
  assert.ok(comments.every((c) => !c.slice(4, -3).includes('--')), 'an XML comment in favicon.svg contains "--"');
});
