#!/usr/bin/env node
/**
 * Washi grain: the seeded paper texture under the page ground and the exhibits.
 *
 * Run:   npm run build:grain        (writes the tiles)
 *        npm run audit:grain        (refuses tiles that are not what the seed draws)
 *
 * WHAT IT IS. One 240px tileable field of paper noise and short fibres, drawn
 * from mulberry32(1987), the generator and seed of the "Grain, barely there"
 * specimen on the Japanese craft verdict board (2026-10-20, owner pick B). The
 * same seed draws the same paper on every build, so every render is identical.
 *
 * WHY FOUR FILES FOR ONE GRAIN. The specimen laid the grain over the page with
 * mix-blend-mode at 5% opacity: multiply on light grounds, screen on dark ones.
 * Both blends have an exact plain-alpha equivalent, so the tiles bake the blend
 * in and the page needs no overlay element at all:
 *
 *   multiply by grey g at opacity o  ==  black at alpha o * (1 - g)
 *   screen   by grey g at opacity o  ==  white at alpha o * g
 *
 * A background layer can therefore carry the grain UNDER the text (it is the
 * ground, not a film over it), scroll with the page, and never take a pointer
 * event or a stacking context. One tile per blend and per strength:
 *
 *   washi-grain-multiply.png       light paper, 5%
 *   washi-grain-screen.png         dark paper, 5%
 *   washi-grain-multiply-soft.png  light exhibit card, 3.5%
 *   washi-grain-screen-soft.png    dark exhibit panel, 3.5%
 *
 * THE FLAT PART IS DROPPED. The specimen's noise sits around mid-grey, so most
 * of what a 5% multiply does is darken the whole sheet evenly. That even part is
 * a tint, not texture, and a tint is exactly what lowers text contrast. The
 * tiles keep the variation (the texture you can see) and drop the floor: the
 * lightest pixel of the field blends to nothing. The grain reads the same; the
 * ground stays as close to its token colour as a texture allows.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { mulberry32 } from '../components/framework-charts/brush.js';

const ROOT = path.resolve(import.meta.dirname, '..');
export const OUT_DIR = path.join(ROOT, 'public', 'site-b', 'brand');
export const SIZE = 240;
export const SEED = 1987;
export const TILES = [
  { file: 'washi-grain-multiply.png', blend: 'multiply', opacity: 0.05 },
  { file: 'washi-grain-screen.png', blend: 'screen', opacity: 0.05 },
  { file: 'washi-grain-multiply-soft.png', blend: 'multiply', opacity: 0.035 },
  { file: 'washi-grain-screen-soft.png', blend: 'screen', opacity: 0.035 },
];

/** The grain field, 0..1 per pixel, row-major. Same RNG stream as the board. */
export function grainField() {
  const N = SIZE, r = mulberry32(SEED);
  const px = new Float64Array(N * N);
  for (let i = 0; i < px.length; i++) px[i] = (128 + (r() - 0.5) * 90) / 255;

  // 70 fibres: a short quadratic curve each, drawn at 35% over the noise. The
  // board drew them on a canvas that clipped at the edge, which leaves a seam
  // where the tile repeats; these wrap round, so the tile has none.
  for (let f = 0; f < 70; f++) {
    const x = r() * N, y = r() * N, a = r() * Math.PI, l = 6 + r() * 26;
    // The board picked each RGB channel apart (60 or 200); the grain is grey,
    // so the fibre takes their mean. Three draws, as the board made them.
    const grey = ((r() < 0.5 ? 60 : 200) + (r() < 0.5 ? 60 : 200) + (r() < 0.5 ? 60 : 200)) / 3 / 255;
    const lw = 0.4 + r() * 0.8;
    const cx = x + Math.cos(a) * l / 2 + (r() - 0.5) * 4, cy = y + Math.sin(a) * l / 2 + (r() - 0.5) * 4;
    const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l;
    const steps = Math.ceil(l * 10);
    const pts = [];
    for (let s = 0; s <= steps; s++) {
      const t = s / steps, u = 1 - t;
      pts.push([u * u * x + 2 * u * t * cx + t * t * ex, u * u * y + 2 * u * t * cy + t * t * ey]);
    }
    const half = lw / 2, reach = half + 1;
    const minX = Math.floor(Math.min(x, cx, ex) - reach), maxX = Math.ceil(Math.max(x, cx, ex) + reach);
    const minY = Math.floor(Math.min(y, cy, ey) - reach), maxY = Math.ceil(Math.max(y, cy, ey) + reach);
    for (let py = minY; py <= maxY; py++) {
      for (let pxl = minX; pxl <= maxX; pxl++) {
        const sx = pxl + 0.5, sy = py + 0.5;
        let d = Infinity;
        for (const [qx, qy] of pts) { const dd = (qx - sx) ** 2 + (qy - sy) ** 2; if (dd < d) d = dd; }
        const cov = Math.max(0, Math.min(1, half + 0.5 - Math.sqrt(d)));
        if (!cov) continue;
        const k = (((py % N) + N) % N) * N + (((pxl % N) + N) % N);
        px[k] = px[k] * (1 - 0.35 * cov) + grey * 0.35 * cov;
      }
    }
  }
  return px;
}

/** 8-bit alpha per pixel for one tile: the blend baked in, the flat floor dropped. */
export function tileAlpha(field, { blend, opacity }) {
  let lo = Infinity, hi = -Infinity;
  for (const v of field) { if (v < lo) lo = v; if (v > hi) hi = v; }
  const a = new Uint8Array(field.length);
  for (let i = 0; i < field.length; i++) {
    const strength = blend === 'multiply' ? hi - field[i] : field[i] - lo;
    a[i] = Math.round(opacity * strength * 255);
  }
  return a;
}

/** Grey+alpha PNG: constant grey (black for multiply, white for screen). */
export function encodePng(alpha, grey) {
  const N = SIZE;
  const raw = Buffer.alloc(N * (1 + N * 2));
  for (let y = 0; y < N; y++) {
    const row = y * (1 + N * 2);
    raw[row] = 0;
    for (let x = 0; x < N; x++) { raw[row + 1 + x * 2] = grey; raw[row + 2 + x * 2] = alpha[y * N + x]; }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(N, 0); ihdr.writeUInt32BE(N, 4);
  ihdr[8] = 8; ihdr[9] = 4; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Pixels back out of a tile this script wrote (grey+alpha, filter 0). */
export function decodePng(buf) {
  let off = 8, w = 0, h = 0;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off), type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); if (data[9] !== 4) throw new Error('not grey+alpha'); }
    if (type === 'IDAT') idat.push(data);
    off += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const grey = new Uint8Array(w * h), alpha = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const row = y * (1 + w * 2);
    if (raw[row] !== 0) throw new Error('unexpected PNG filter');
    for (let x = 0; x < w; x++) { grey[y * w + x] = raw[row + 1 + x * 2]; alpha[y * w + x] = raw[row + 2 + x * 2]; }
  }
  return { w, h, grey, alpha };
}

export const greyFor = (blend) => (blend === 'multiply' ? 0 : 255);

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes('--check');
  const field = grainField();
  const problems = [];
  for (const t of TILES) {
    const alpha = tileAlpha(field, t);
    const file = path.join(OUT_DIR, t.file);
    if (check) {
      if (!fs.existsSync(file)) { problems.push(`${t.file} is missing`); continue; }
      const got = decodePng(fs.readFileSync(file));
      const same = got.w === SIZE && got.h === SIZE &&
        got.alpha.every((v, i) => v === alpha[i]) && got.grey.every((v) => v === greyFor(t.blend));
      if (!same) problems.push(`${t.file} is not what seed ${SEED} draws`);
    } else {
      fs.writeFileSync(file, encodePng(alpha, greyFor(t.blend)));
      console.log(`wrote ${path.relative(ROOT, file)} (${fs.statSync(file).size} bytes)`);
    }
  }
  if (problems.length) {
    console.error('Grain audit failed:\n  ' + problems.join('\n  ') + '\n  Run `npm run build:grain`.');
    process.exit(1);
  }
  if (check) console.log(`Grain audit passed: ${TILES.length} tiles match seed ${SEED}.`);
}
