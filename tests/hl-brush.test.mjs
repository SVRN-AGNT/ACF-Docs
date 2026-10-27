/**
 * Key-phrase brush stroke, washi grain and ink dash: one brush engine, seeded
 *
 * Run: node --test tests/hl-brush.test.mjs
 *
 * Three owner picks from the Japanese craft verdict board (2026-10-20) share a
 * promise: the organic marks are the docs' own brush engine, seeded, so every
 * render is identical. Each test below pins a way that promise could quietly
 * stop being true:
 *
 *   1. reading-core.js carries a browser copy of brushSegment. A copy drifts;
 *      the stroke would then be "a brush" but not THE brush.
 *   2. tokens.css carries the JS-off fallback stroke as a data URI, with its
 *      fill written out because an SVG image cannot read a custom property. The
 *      path could go stale and the fill could disagree with the accent.
 *   3. The grain tiles must be what their seed draws, and never louder than the
 *      strength the owner picked ("barely there").
 *   4. The ink dash must reach only U+2014, from the stacks every page reads.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { brushSegment, brushLine } from '../components/framework-charts/brush.js';
import { grainField, tileAlpha, decodePng, greyFor, TILES, SIZE, OUT_DIR } from '../scripts/build-washi-grain.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const CORE = read('public/site-b/reading-core.js');
const TOKENS = read('public/site-b/tokens.css');
const CSS = read('public/site-b/reading-system.css');

function portedBrush() {
  const m = CORE.match(/\/\* BEGIN brush port[\s\S]*?\*\/([\s\S]*?)\/\* END brush port \*\//);
  assert.ok(m, 'reading-core.js marks its brush port with BEGIN/END');
  return new Function(`${m[1]}; return inkBrush;`)();
}

test('the browser stroke is brush.js brushSegment, point for point', () => {
  const port = portedBrush();
  const cases = [
    [2, 8, 198, 9.4, 21], [2, 8, 412.6, 9.4, 22], [2, 8, 30, 9.4, 26], [4, 8, 196, 9.4, 21],
  ];
  for (const [x1, y1, x2, y2, seed] of cases) {
    const o = { seed, weight: 2.6, waver: 0.7, intensity: 0.8 };
    assert.equal(port.brushSegment(x1, y1, x2, y2, o), brushSegment(x1, y1, x2, y2, o),
      `seed ${seed}, ${x2 - x1} units long`);
  }
});

test('the JS-off fallback stroke is the board pick, filled in each surface accent', () => {
  const want = brushSegment(4, 8, 196, 9.4, { seed: 21, weight: 2.6, waver: 0.7, intensity: 0.8 });
  const accent = (block) => block.match(/--accent:\s*(#[0-9a-f]{6})/i)[1].slice(1).toLowerCase();
  const feature = TOKENS.match(/--feature-accent:\s*(#[0-9a-f]{6})/i)[1].slice(1).toLowerCase();
  const light = TOKENS.slice(TOKENS.indexOf(':root {'), TOKENS.indexOf('[data-theme="dark"] {'));
  const dark = TOKENS.slice(TOKENS.indexOf('[data-theme="dark"] {'));
  const stroke = (block, name) => {
    const m = block.match(new RegExp(`${name}:\\s*url\\("data:image/svg\\+xml,([^"]+)"\\)`));
    assert.ok(m, `${name} is a data-URI stroke`);
    const svg = decodeURIComponent(m[1]);
    return { d: svg.match(/ d='([^']+)'/)[1], fill: svg.match(/fill='#([0-9a-f]{6})'/i)[1].toLowerCase() };
  };
  for (const [block, name, fill] of [
    [light, '--hl-brush-paper', accent(light)],
    [light, '--hl-brush-feature', feature],
    [dark, '--hl-brush-paper', accent(dark)],
  ]) {
    const s = stroke(block, name);
    assert.equal(s.d, want, `${name}: the path is brushSegment's, not a hand edit`);
    assert.equal(s.fill, fill, `${name}: the fill is the accent of the surface it sits on`);
  }
});

test('the base state is the end state: stroke drawn and phrase lit without JS', () => {
  const base = CSS.match(/\n\.hl \{([\s\S]*?)\n\}/);
  assert.ok(base, 'a base .hl rule exists');
  assert.match(base[1], /background-image:\s*var\(--hl-brush, var\(--hl-brush-fallback\)\)/);
  assert.match(base[1], /background-size:\s*100% 0\.42em/, 'drawn in full at rest');
  assert.match(base[1], /font-weight:\s*var\(--hl-weight\)/);
  const motion = CSS.match(/@media \(prefers-reduced-motion: no-preference\) \{\s*html\.js \.hl \{([\s\S]*?)\}/);
  assert.ok(motion, 'the undrawn start state exists only for JS + motion');
  assert.match(motion[1], /background-size var\(--motion-draw\) var\(--ease-emphasis\) 450ms/,
    'the stroke rests 450ms, then draws for 1100ms on the decelerate curve');
});

test('the grain tiles are what seed 1987 draws, and no louder than picked', () => {
  const field = grainField();
  for (const t of TILES) {
    const png = decodePng(fs.readFileSync(path.join(OUT_DIR, t.file)));
    assert.equal(png.w, SIZE); assert.equal(png.h, SIZE);
    const alpha = tileAlpha(field, t);
    assert.ok(png.alpha.every((v, i) => v === alpha[i]), `${t.file} matches its seed`);
    assert.ok(png.grey.every((v) => v === greyFor(t.blend)), `${t.file} is pure ${t.blend === 'multiply' ? 'black' : 'white'}`);
    const max = Math.max(...png.alpha);
    assert.ok(max > 0, `${t.file} carries some grain`);
    assert.ok(max <= Math.round(t.opacity * 255), `${t.file} never exceeds its ${t.opacity * 100}% strength`);
  }
});

test('the grain tile repeats without a seam', () => {
  // Fibres wrap round the tile edge, so the last column continues into the
  // first. Compare the step across the seam with steps inside the tile.
  const f = grainField(), N = SIZE;
  const step = (a, b) => { let s = 0; for (let y = 0; y < N; y++) s += Math.abs(f[y * N + a] - f[y * N + b]); return s / N; };
  const inner = (step(10, 11) + step(100, 101) + step(200, 201)) / 3;
  assert.ok(step(N - 1, 0) < inner * 1.5, 'the seam is no rougher than the paper itself');
});

test('the ink dash leads both stacks and draws only U+2014', () => {
  const faces = [...TOKENS.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => m[1]);
  for (const fam of ['ACF Ink Dash', 'ACF Ink Dash Mono']) {
    const face = faces.find((f) => f.includes(`font-family: '${fam}';`));
    assert.ok(face, `${fam} is declared`);
    assert.match(face, /unicode-range:\s*U\+2014;/, `${fam} reaches the em dash and nothing else`);
    const src = face.match(/url\('\/site-b\/([^']+)'\)/)[1];
    assert.ok(fs.existsSync(path.join(ROOT, 'public/site-b', src)), `${src} ships`);
  }
  assert.match(TOKENS, /--font-sans:\s*'ACF Ink Dash', 'Inter'/);
  assert.match(TOKENS, /--font-mono:\s*'ACF Ink Dash Mono', 'JetBrains Mono'/);
});

// Round 2 (owner picks 2026-10-21): the ensō frame round each chart card is
// drawn with a browser copy of brushLine. Same promise as brushSegment above:
// the copy must be THE brush, point for point.
test('the browser frame line is brush.js brushLine, point for point', () => {
  const port = portedBrush();
  const box = (w, h, r) => [{ x: 12 + r, y: 12 }, { x: 12 + w - r, y: 12 }, { x: 12 + w, y: 12 + r },
    { x: 12 + w, y: 12 + h - r }, { x: 12 + w - r, y: 12 + h }, { x: 12 + r, y: 12 + h }, { x: 12, y: 12 + h - r }, { x: 12, y: 12 + r }];
  for (const [w, h, seed] of [[893, 740, 30], [358, 1100, 31], [600, 420, 37]]) {
    const o = { seed, weight: 0.75, intensity: 0.5, taper: 0.012, modulate: 0.22, step: 5 };
    assert.equal(port.brushLine(box(w, h, 7), o), brushLine(box(w, h, 7), o), `${w}x${h}, seed ${seed}`);
  }
});

// An old line may go only behind the class inkMarks() adds after drawing its
// replacement, so a reader without JS (or before the script runs) keeps it.
test('old lines are hidden only once their ink mark is drawn', () => {
  const rules = [...CSS.matchAll(/([^{}]+)\{([^}]*)\}/g)];
  const frame = rules.find(([, sel]) => /\.acf-chart-build\.ink-framed/.test(sel));
  assert.ok(frame && /border-color:\s*transparent/.test(frame[2]), 'the card drops its hairline only as .ink-framed');
  const marker = rules.find(([, sel]) => /\.side-part\.current\.ink-current::before/.test(sel));
  assert.ok(marker && /opacity:\s*0/.test(marker[2]), 'the contents bar hides only as .ink-current');
  for (const cls of ['ink-title', 'ink-takeaways', 'ink-current', 'ink-framed']) {
    assert.ok(CORE.includes(`'${cls}'`), `inkMarks() adds .${cls} after it draws`);
  }
});
