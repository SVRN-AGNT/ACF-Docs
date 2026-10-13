/**
 * Voice locks: the owner's own lines that carry the book's character.
 *
 * Run: node --test tests/voice-locks.test.mjs
 *
 * WHY THIS EXISTS. The framework pages have been through several correction
 * passes, and each one tends to sand the prose a little flatter. One of them
 * dropped a line the owner had locked verbatim (Part 1's "The problem was not
 * bad luck." triple), and nothing noticed. These lines are the owner's own
 * sentences, restored in the July 2026 voice pass and the October 2026
 * character pass (VOICE_CHARACTER_PASS_v1.md). A later pass may still change
 * one, but only on purpose: if a check below fails, either put the line back or
 * get the owner's sign-off and update this list in the same commit.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENTITIES = { '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”', '&ndash;': '–', '&amp;': '&', '&nbsp;': ' ' };
const text = (file) => fs.readFileSync(path.join(ROOT, 'public/site-b', file), 'utf8')
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<[^>]+>/g, '')
  .replace(/&[a-zA-Z]+;/g, (e) => ENTITIES[e] ?? e)
  .replace(/\s+/g, ' ');

const LOCKS = {
  'part-1-foundation.html': [
    'The problem was not bad luck. The problem was not “this time was different.” The problem was that the portfolio was not designed for the regime it inhabited.',
    'The objective of portfolio management is not prediction. It is survivable compounding under uncertainty.',
    'Fragility is not volatility.',
  ],
  'part-2-lineage-macro.html': [
    'The engine persists; the fuel changes.',
    'Price is a participant, not an observer.',
  ],
  'part-3-bitcoin-convexity.html': [
    'Maximum exposure wins in ideal conditions. Structured architecture wins across uncertain conditions.',
    'That is not faith. That is architecture.',
  ],
  'part-4-tax-architecture.html': [
    'Compound interest has been called the eighth wonder of the world. Tax-free compound interest is the ninth.',
    'Consider the mathematics.',
  ],
  'part-5-portfolio-construction.html': [
    'The difference between speculation and gambling is governance.',
    'never allowed to become load-bearing',
  ],
  'part-6-convexity-scoring.html': [
    'Discipline includes restraint.',
    'Absence of triggers means hold.',
    'Fix the penalty, recover the points',
  ],
};

for (const [file, lines] of Object.entries(LOCKS)) {
  test(`voice locks: ${file}`, () => {
    const page = text(file);
    for (const line of lines) {
      assert.ok(page.includes(line),
        `${file} no longer carries the owner's line "${line}". Restore it, or update tests/voice-locks.test.mjs with the owner's sign-off.`);
    }
  });
}
