/**
 * Doctrine numbers: one value on every page that states it.
 *
 * Run: node --test tests/doctrine-numbers.test.mjs
 *
 * WHY THIS EXISTS. Two doctrine numbers are typed by hand in many places: the
 * aggregate Ballast ceiling (Part 5's posture hero and sizing key, the posture
 * chart, the change-governance list) and the Bitcoin reserve target (Part 3's
 * takeaways and sizing paragraph, the reserve chart, the glossary, Part 5's case
 * study). By October 2026 the copies disagreed. Part 5 called the 20 to 35
 * percent Ballast range doctrine while a 40 percent ceiling sat beside it and
 * again in the list of tunable parameters. Part 3 tied a 10 to 15 percent
 * target to moderate risk while Part 5's moderate-risk case study held 20
 * percent. The owner ruled on 2026-10-14: the Ballast ceiling is 35 percent
 * everywhere, and 15 to 20 percent is the moderate-risk Bitcoin target.
 *
 * If a check fails, a copy has drifted, or the doctrine itself changed. In that
 * case change every copy and this file in the same commit, with the owner's
 * ruling.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'public/site-b');
const ENTITIES = { '&ndash;': '–', '&rsquo;': '’', '&lsquo;': '‘', '&middot;': '·', '&amp;': '&', '&nbsp;': ' ' };

function read(rel) {
  let t = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  if (rel.endsWith('.html')) t = t.replace(/<[^>]+>/g, ' ');
  return t
    .replace(/&[a-zA-Z]+;/g, (e) => ENTITIES[e] ?? ' ')
    .replace(/\\u2013/g, '–')
    .replace(/\\u00b7|\\xB7/gi, '·')
    .replace(/\s+/g, ' ');
}

// Every page, the glossary data and the chart specs (the source of every chart's
// labels, alt text and generated fallback).
const CORPUS = [
  ...fs.readdirSync(SITE).filter((f) => f.endsWith('.html')).map((f) => `public/site-b/${f}`),
  'public/site-b/acf-glossary.json',
  'components/framework-charts/chart-specs.mjs',
].map((rel) => [rel, read(rel)]);

// Sentences, or string literals in the chart specs.
const pieces = (text) => text.split(/(?<=[.;])\s+|['"`],?\s/);

test('the aggregate Ballast ceiling is 35 percent wherever it is stated', () => {
  let seen = 0;
  for (const [rel, text] of CORPUS) {
    for (const piece of pieces(text)) {
      if (!/ballast|aggregate/i.test(piece) || !/floor/i.test(piece)) continue;
      for (const [, n] of piece.matchAll(/\b([a-z-]+|\d+)\s?(?:%|percent) ceiling/gi)) {
        seen++;
        assert.ok(['35', 'thirty-five'].includes(n.toLowerCase()),
          `${rel}: Ballast ceiling stated as "${n}" in "${piece.slice(0, 160)}"; doctrine is 35 percent`);
      }
    }
  }
  assert.ok(seen >= 8, `found only ${seen} Ballast ceiling statements; the check has lost its sentences`);
});

// Part 5's change-governance list and its exhibit (P5-10's Doctrine and Parameters
// nodes) classify the same rules, so both are checked.
test('the Ballast ceiling is doctrine, not a tunable parameter', () => {
  const part5 = read('public/site-b/part-5-portfolio-construction.html');
  const doctrine = (part5.match(/Doctrine: non-negotiable principles\.[^]*?(?=Parameters:)/) || [''])[0];
  const params = (part5.match(/Parameters: tunable thresholds\.[^]*?(?=Overrides:)/) || [''])[0];
  assert.ok(doctrine && params, 'Part 5 change-governance lists not found');
  assert.match(doctrine, /aggregate Ballast held between its 15% floor and 35% ceiling/,
    'Part 5 does not list the Ballast floor and ceiling as doctrine');
  assert.doesNotMatch(params, /ballast/i,
    'Part 5 lists a Ballast aggregate limit as a parameter, but the 20 to 35 percent range and its 35 percent ceiling are doctrine');

  const specs = read('components/framework-charts/chart-specs.mjs');
  const node = (id) => (specs.match(new RegExp(`\\{ id: '${id}', kind: 'node',[^}]*?why: '([^']*)'`)) || [])[1];
  const [docNode, paramNode] = [node('doctrine'), node('parameters')];
  assert.ok(docNode && paramNode, 'P5-10 Doctrine and Parameters nodes not found');
  assert.match(docNode, /aggregate Ballast held between its 15 percent floor and 35 percent ceiling/,
    'P5-10 Doctrine node does not name the Ballast floor and ceiling');
  assert.doesNotMatch(paramNode, /ballast/i,
    'P5-10 Parameters node calls a Ballast aggregate limit adjustable, but it is doctrine');
});

test('the Bitcoin reserve target is 15 to 20 percent wherever it is stated', () => {
  let seen = 0;
  const RANGE = /(\d+)\s?(?:–|-|to)\s?(\d+)\s?(?:%|percent)?\s?(?:percent )?target|target(?: reserve)?\s?·?\s?(\d+)\s?(?:–|-|to)\s?(\d+)/gi;
  for (const [rel, text] of CORPUS) {
    for (const m of text.matchAll(RANGE)) {
      const lo = m[1] ?? m[3], hi = m[2] ?? m[4];
      seen++;
      assert.equal(`${lo}–${hi}`, '15–20',
        `${rel}: Bitcoin target stated as ${lo}–${hi} in "${text.slice(Math.max(0, m.index - 60), m.index + m[0].length + 20)}"`);
    }
  }
  assert.ok(seen >= 8, `found only ${seen} target statements; the check has lost its sentences`);

  const glossary = read('public/site-b/acf-glossary.json');
  assert.match(glossary, /Part 3 suggests 15 to 20 percent for horizons of ten years or more and moderate risk capacity/,
    'the glossary states the moderate-risk target');
  const part5 = read('public/site-b/part-5-portfolio-construction.html');
  assert.match(part5, /Twenty percent is the top of Part 3’s 15–20 percent target for moderate risk capacity/,
    'the Part 5 case study ties its 20 percent Bitcoin to the moderate-risk target');
});
