/**
 * Ma — a beat of stillness before the brush draws in (owner decision 0036,
 * second-brain `decisions/0036-house-style-signature-ideas.md`).
 *
 * Run: node --test tests/chart-ma.test.mjs
 *
 * The time-series exhibits used to start their sweep 120ms after entering the
 * viewport. Ma lengthens that beat to 200ms for the families whose first
 * entrance is a brush draw-in, and leaves the scenario update alone: it
 * replays on the reader's input, where a pause reads as lag. The value is
 * governed in MOTION_TIMING, read by PlotSvg, and shipped in the static
 * site-b bundle, so all three are pinned.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MOTION_TIMING } from '../components/framework-charts/chart-specs.mjs';

const chart = readFileSync(new URL('../components/framework-charts/FrameworkChart.jsx', import.meta.url), 'utf8');
const bundle = readFileSync(new URL('../public/site-b/site-b-charts.js', import.meta.url), 'utf8');

test('the brush draw-in families carry a 200ms ma; the scenario update carries none', () => {
  assert.equal(MOTION_TIMING.timeSweep.maMs, 200);
  assert.equal(MOTION_TIMING.reveal.maMs, 200);
  assert.equal(MOTION_TIMING.scenarioUpdate.maMs, undefined);
});

test('PlotSvg starts its sweep, bands and marks after ma, not after a literal', () => {
  const plot = chart.slice(chart.indexOf('function PlotSvg('), chart.indexOf('function QuadrantSvg('));
  assert.match(plot, /const MA = \(motion && Number\.isFinite\(motion\.maMs\)\) \? motion\.maMs : 120;/);
  assert.match(plot, /sweep\(TM\.path, MA\)/);
  assert.doesNotMatch(plot, /sweep\(TM\.path, 120\)/);
  assert.doesNotMatch(plot, /Math\.round\(120 \+ TM\.path/);
});

test('the static site-b bundle was rebuilt with ma', () => {
  assert.match(bundle, /maMs:200/);
});
