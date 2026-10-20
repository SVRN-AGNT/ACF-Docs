#!/usr/bin/env node
/**
 * Build public/site-b/framework-in-math.html — the mathematical companion.
 *
 * SOURCE + SCOPE. The quantities here are transcribed from the owner-chartered
 * extraction track in the ACFDashboard repo (`docs/FRAMEWORK_IN_MATH_v1.md`),
 * which reads the live engine first and the specs second. That document is an
 * internal, RIA/PM-defensible reference; this page is its PUBLISHABLE SUBSET.
 *
 * CHAPTER SCOPE (owner decision, 2026-08-11): publish the chapters the book
 * already teaches — 1 CIS, 2 FIS, 3 Allocation & Sizing, 4 Governance, 8 Bitcoin,
 * 9 Tax architecture, 10 Decay & confidence, 11 Next Dollar Score. HELD pending a
 * separate owner call: 5 Projections & parameter estimation (forecast-adjacent),
 * 6 Earnings & forward valuation, 7 Performance accounting & NAV (track-record
 * adjacent), 12 Margin, borrowing & leverage.
 *
 * This page deliberately omits, from every chapter:
 *
 *   - engine file paths and line numbers, branch names, and commit context
 *   - the verification command logs
 *   - the spec-vs-engine divergence registers ("flags, not fixes")
 *   - internal enforcement posture, storage keys, and environment gating
 *
 * Rule of thumb: publish the mathematics, not the audit apparatus. Where the
 * extraction track records a live/spec fork, this page states the live value and
 * says plainly that it is the live one, rather than silently picking a side.
 *
 * The doctrine-vs-live distinction IS published where it describes what the
 * system does and does not do to a portfolio — that boundary is a feature of the
 * framework, not an internal defect note.
 *
 * Content here is authored, not derived, so it does not auto-update: when the
 * extraction track ships a new chapter, this page is edited deliberately.
 *
 * Run: npm run build:math
 */
import fs from 'node:fs';
import path from 'node:path';
import { stripSeriesChain } from './site-b-shell.mjs';
import { stampSocialMeta } from './social-meta.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SITE = path.join(ROOT, 'public', 'site-b');
const DONOR = path.join(SITE, 'part-6-convexity-scoring.html');
const OUT = path.join(SITE, 'framework-in-math.html');

const main = `<main class="shell-main">

    <header class="doc-header">
      <div class="measure">
        <div class="doc-signal" data-glyph-text>Framework Reference</div>
        <p class="doc-kicker">The mathematical companion &middot; for readers who want the arithmetic</p>
        <h1 class="doc-title">The Framework in Math</h1>
      </div>
      <div class="measure prose">
        <p class="prose-lead">The Parts explain what the framework believes and why. This page states what it computes. Every computed quantity below is taken from the dashboard&rsquo;s code and written as a formula, so a practitioner, an advisor or a skeptic can check the arithmetic. Where the code has no input yet, where a number is doctrine a person follows, or where it is illustrative, the page says so.</p>
        <p><a class="part-ref" href="#reading">How to read this</a> <a class="part-ref" href="#cis-math">The position score</a> <a class="part-ref" href="#fis-math">The construction score</a> <a class="part-ref" href="#sizing-math">Score to size</a> <a class="part-ref" href="#governance-math">What fires, and what it does</a> <a class="part-ref" href="#bitcoin-math">The backbone</a> <a class="part-ref" href="#tax-math">Wrappers and basis</a> <a class="part-ref" href="#evidence-math">Evidence and confidence</a> <a class="part-ref" href="#nds-math">The next dollar</a></p>
      </div>
    </header>

    <section class="section" id="reading" aria-labelledby="reading-title">
      <div class="measure">
        <p class="section-eyebrow section-signal" data-glyph-text>Ground Rules</p>
        <h2 class="section-title" id="reading-title">How to read this page.</h2>
      </div>
      <div class="measure prose">
        <p>A formula is only as useful as your sense of how much to trust it, so three conventions come first.</p>
        <p><strong>Authority.</strong> Where the framework&rsquo;s written rules and the running engine disagree, this page quotes the engine, because the engine is what scores your portfolio. Where the two have forked, the page says so rather than picking a side without telling you.</p>
        <p><strong>Classification.</strong> Not every number carries the same weight. Each quantity below is one of four kinds, and the kind matters more than the value.</p>
      </div>

      <div class="measure-feature">
        <div class="failure-modes">
          <div><span class="name">Doctrine</span><p>Structural. Change it and you are running a different framework rather than tuning this one.</p></div>
          <div><span class="name">Parameter</span><p>Tunable inside a documented envelope, with the reasoning written down.</p></div>
          <div><span class="name">Derived</span><p>An accounting identity. It follows from the others and cannot be set on its own.</p></div>
          <div><span class="name">Illustrative</span><p>It shows the shape of an idea. It is neither a forecast nor a promise.</p></div>
        </div>
      </div>

      <div class="measure prose">
        <p><strong>Coded, or written down.</strong> Some of what the framework asserts runs as code against your portfolio; some of it is a written rule a person follows. This page keeps the two apart wherever mixing them could mislead. A threshold is called <em>live</em> only when a running consumer changes state because of it. Logic that exists but receives no input is called <em>coded but not yet fed</em>, and the page names what is missing. Descriptions of what the dashboard does are as of September 2026.</p>
      </div>

      <aside class="callout callout-info">
        <p class="callout-label">What this page is not</p>
        <p>It describes computation. It is not advice, and nothing here recommends buying, selling, holding or sizing any position. The Next Dollar column and several of the software&rsquo;s reports carry the same disclaimer, for the same reason.</p>
      </aside>
    </section>

    <section class="section" id="cis-math" aria-labelledby="cis-math-title">
      <div class="measure">
        <p class="section-eyebrow section-signal" data-glyph-text>Position Quality</p>
        <h2 class="section-title" id="cis-math-title">CIS: the position score.</h2>
      </div>
      <div class="measure prose">
        <p>Everything else on this page starts from one number per holding. The <button type="button" class="gloss" data-gloss="cis" aria-expanded="false">Convexity Integrity Score</button> is a weighted sum of four components, each scored 0 to 100, producing a 0 to 100 result. At the reference weights:</p>
        <p><strong>CIS = (C &times; 0.40) + (R &times; 0.25) + (M &times; 0.25) + (E &times; 0.10)</strong></p>
        <p>The four-component structure is <em>doctrine</em>. The weights are <em>parameters</em>: the engine holds them in one place, and the active thesis shifts them within a fixed envelope, described below.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Vocabulary &middot; six scores, one name</p>
        <h3 class="sub-title">Which CIS are we talking about?</h3>
      </div>
      <div class="measure prose">
        <p>Six distinct objects travel under the name. Comparing one with another and calling the difference a bug is an easy way to misread the system, so they are separated here first.</p>
      </div>

      <div class="compare compare-wrap">
        <table>
          <caption>The six score objects, and which one is <em>the</em> CIS</caption>
          <thead>
            <tr><th scope="col">Object</th><th scope="col">What it is</th><th scope="col">Persists</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row">Neutral</th><td data-label="What it is">The four components summed at the reference weights, with no sector-relevance scaling and no macro downweight. It is not thesis-free: the thesis inputs that live inside the components (volatility tolerance in risk, your sector preferences and the thesis themes in macro and optionality) are already in it.</td><td data-label="Persists">In the score record</td></tr>
            <tr><th scope="row" class="col-primary">Adjusted</th><td data-label="What it is"><strong>The canonical CIS.</strong> The thesis-weighted aggregate after the full cascade below.</td><td data-label="Persists">Yes, as an unrounded float</td></tr>
            <tr><th scope="row">Wrapper-adjusted</th><td data-label="What it is">The canonical CIS times a wrapper-and-posture factor (0.97 to 1.04), rounded; shown beside a holding and read by governance thresholds and the Next Dollar Score.</td><td data-label="Persists">Recomputed for display</td></tr>
            <tr><th scope="row">Effective</th><td data-label="What it is">A portfolio-contextual overlay for judging a candidate against what you already hold: Adjusted, plus gap fit (0 to 6), less an overlap penalty (0 to 6), plus role demand (0 to 4), held within 0 to 100.</td><td data-label="Persists">Never</td></tr>
            <tr><th scope="row">Rank</th><td data-label="What it is">Ordering mechanics for a list. Not a decision value.</td><td data-label="Persists">No</td></tr>
            <tr><th scope="row">Next Dollar</th><td data-label="What it is">A separate marginal-capital score that <em>consumes</em> the position&rsquo;s wrapper-adjusted CIS at a base weight of 0.30. Its own surface, its own bands.</td><td data-label="Persists">Own record</td></tr>
          </tbody>
        </table>
      </div>
      <p class="compare-key">When two screens show different numbers for one holding, check which object each one shows: they answer different questions, and both can be right. The wrapper-and-posture factor is 1.04 for Torque in a Roth; 1.03 for Hype in a Roth and for Torque in a pre-tax account; 1.02 for Hype in a pre-tax account and for Ballast in taxable; 1.01 for Ballast in a Roth or pre-tax account; 0.98 for Torque and 0.97 for Hype in taxable; and 1.00 for Bitcoin, for anything in the dashboard&rsquo;s own Bitcoin wrapper, and wherever the wrapper or posture is unknown. The table is the dashboard&rsquo;s own and forks from the placement doctrine in places: it rates Torque in a pre-tax account above Torque in taxable, although <a class="part-ref" href="/part-4-tax-architecture-roc-strategy#pretax">Part 4</a> calls pre-tax accounts inferior for convex positions, and it marks down Hype in taxable, the placement Part 5&rsquo;s case study gives its Hype positions.</p>

      <div class="measure">
        <p class="sub-meta">Weights &middot; reference and thesis</p>
        <h3 class="sub-title">The thesis moves the weights, inside an envelope.</h3>
      </div>
      <div class="measure prose">
        <p>The 40/25/25/10 split above is the reference weighting. When a thesis is active, its profile sets the weights, which is why one position can score differently under two theses without either score being wrong.</p>
      </div>

      <div class="compare compare-wrap">
        <table>
          <caption>Component weights by operating thesis</caption>
          <thead>
            <tr><th scope="col">Thesis profile</th><th scope="col">C</th><th scope="col">R</th><th scope="col">M</th><th scope="col">E</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row" class="col-primary">Reference weighting</th><td data-label="C">0.40</td><td data-label="R">0.25</td><td data-label="M">0.25</td><td data-label="E">0.10</td></tr>
            <tr><th scope="row">Fourth Turning</th><td data-label="C">0.35</td><td data-label="R">0.30</td><td data-label="M">0.25</td><td data-label="E">0.10</td></tr>
            <tr><th scope="row">Singularity Accelerationist</th><td data-label="C">0.45</td><td data-label="R">0.20</td><td data-label="M">0.25</td><td data-label="E">0.10</td></tr>
            <tr><th scope="row">Monetary Debasement</th><td data-label="C">0.35</td><td data-label="R">0.25</td><td data-label="M">0.30</td><td data-label="E">0.10</td></tr>
            <tr><th scope="row">Capital Preservation</th><td data-label="C">0.30</td><td data-label="R">0.35</td><td data-label="M">0.20</td><td data-label="E">0.15</td></tr>
            <tr><th scope="row">Conflict Economy</th><td data-label="C">0.30</td><td data-label="R">0.30</td><td data-label="M">0.30</td><td data-label="E">0.10</td></tr>
            <tr><th scope="row">Re-industrialization</th><td data-label="C">0.35</td><td data-label="R">0.25</td><td data-label="M">0.30</td><td data-label="E">0.10</td></tr>
          </tbody>
        </table>
      </div>
      <p class="compare-key">Every profile stays inside the envelope: no component moves more than 0.10 from its reference weight, none falls below 0.05 or rises above 0.50, and the four are renormalized so they always sum to 1.0. With no thesis selected, the software does not choose one for you; any score computed without a thesis uses the reference weighting.</p>

      <div class="measure prose">
        <p>One further adjustment is built in rather than chosen. When the macro read is low or medium confidence, the macro weight drops to 60 or 80 percent of its value, and the difference moves evenly to convexity and risk. A thinly evidenced macro view does not get to carry full weight.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Component C &middot; reference weight 0.40</p>
        <h3 class="sub-title">Convexity and optionality.</h3>
      </div>
      <div class="measure prose">
        <p>The heaviest component at the reference weights, because asymmetric upside is the framework&rsquo;s objective. It is built from four capped sub-scores that sum to 100: headroom 35, optionality 25, catalyst density 20, scarcity 20.</p>
        <p><strong><button type="button" class="gloss" data-gloss="headroom" aria-expanded="false">Headroom</button> (0&ndash;35)</strong> asks how much larger the addressable market is than the company. Let <em>H</em> be that ratio, capped at 30&times;:</p>
        <p><strong>headroom = 35 &times; ln(1 + H) / ln(31)</strong>, where <strong>H = min(TAM &divide; market cap, 30)</strong></p>
        <p>Logarithmic, so the first multiple of headroom counts for far more than the twentieth: 30&times; scores 35, 10&times; scores 24.4, 5&times; scores 18.3, 3&times; scores 14.1, and parity, an addressable market exactly the size of the company, still scores 7.1; the curve reaches zero only when the ratio does. The shape is <em>doctrine</em>; the 30&times; cap and the log base are <em>parameters</em>.</p>
        <p><strong>Optionality (0&ndash;25)</strong> is size-convexity (0 to 18) plus sector convexity (0 to 7), and the thesis themes can add up to 4 of the sector points. Size-convexity is a continuous curve over market capitalization that <em>peaks between three and forty billion dollars</em> and falls away on both sides, which is the arithmetic form of the claim that size limits how far a company can travel. It is 14 below $0.5 billion and ramps to 16 at $2 billion; climbs from 16 to 18 between $2 billion and $3 billion; holds at 18 through $40 billion; falls to 10 by $100 billion and to 4 by $200 billion; then tails off exponentially toward 2. An unknown capitalization scores the midpoint, 9, rather than a guess. Four override flags (pricing power, a margin inflection, an embedded call option, regulatory leverage) can lift a company above $40 billion back toward 18; they are coded but not yet fed, because nothing in the software sets them today.</p>
        <p>Funds score through the same size-convexity curve as equities, on the weighted-average market cap of what they hold rather than their own assets: a broad index fund lands in the curve&rsquo;s low, mega-cap zone, while a niche fund of smaller names can reach its peak. No data provider supplies that weighted average today, so the figure is usually an estimate (a language-model figure or a category average), and the score records which one it used.</p>
        <p><strong><button type="button" class="gloss" data-gloss="catalyst-density" aria-expanded="false">Catalyst density</button> (0&ndash;20)</strong> prices identifiable, dated reasons for a re-rating. Each catalyst earns:</p>
        <p><strong>points = impact &times; probability &times; independence &times; confidence &times; time decay</strong></p>
        <p>Impact is tiered: transformational 7, major 5, moderate 3.5, minor 2. Independence runs from 0.5 to 1.0, so a catalyst that repeats another is discounted by up to half. Time decay is hyperbolic, <strong>1 &divide; (1 + months out &divide; 12)</strong>: a catalyst today counts fully, one at six months two-thirds, one at a year half, one at two years a third. Only the top four count, and catalysts spanning different impact tiers earn up to 3 more points.</p>
        <p>That formula runs on a researched catalyst list when one exists. Without one, the engine scores a sector template list, blended toward a neutral 8 at 70 percent weight, or failing that a thematic prior. A catalyst score with no researched catalysts behind it is a sector estimate, and the score&rsquo;s breakdown records which source it came from.</p>
        <p><strong>Scarcity (0&ndash;20)</strong> prices what cannot be replicated. Each moat signal earns <strong>type weight &times; strength &times; durability &times; confidence</strong>, where type weight runs from protocol scarcity at 5.0 down through regulatory license, supply constraint, network effects, patents, capital intensity and data, to switching costs at 3.0; durability multiplies by 1.0 for permanent down to 0.45 for short-lived. The top five signals count, plus a bonus for breadth of moat type. Without researched signals, scarcity falls back the same way catalysts do.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Component R &middot; reference weight 0.25</p>
        <h3 class="sub-title">Risk and fragility.</h3>
      </div>
      <div class="measure prose">
        <p>Survivability under stress, which is a different thing from volatility. Higher is <em>less</em> fragile. Four sub-scores sum to 100: balance sheet 30, business model 30, factor correlation 20, tail risk 20. There is no sector bonus.</p>
        <p>The thesis enters risk through one bounded channel:</p>
        <p><strong>risk penalty factor = clamp(2.0 &minus; thesis volatility multiplier, 0.5, 1.5)</strong></p>
        <p>A thesis with more tolerance for volatility softens the risk penalties; one with less sharpens them. The factor applies only to factor correlation and tail risk. Balance sheet and business model are untouched by the thesis, on purpose.</p>
        <p>And it stops at insolvency. When a company shows a current ratio below 0.8 <em>and</em> debt-to-equity above 3.0, on reliable data (observed, derived from observed inputs, or a stale balance-sheet reading, never a proxy or a language-model estimate), the penalty factor is floored at 0.90. <strong>A thesis can soften a volatility penalty. It cannot forgive a balance sheet.</strong></p>
        <p>Factor correlation measures correlation to macro factors only. Overlap with the rest of your portfolio is left out on purpose: the construction score handles concentration, and counting it here as well would charge a concentrated book twice.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Component M &middot; reference weight 0.25</p>
        <h3 class="sub-title">Macro alignment.</h3>
      </div>
      <div class="measure prose">
        <p>Regime fit, not forecasting. Three sub-scores sum to 100: regime fit (40 points), carry direction (30) and policy and flow (30), read against the macro thesis of <a class="part-ref" href="/part-2-lineage-macro-thesis#macro-thesis">Part 2</a>.</p>
        <p>Carry is dividend-neutral: yield is not scored as quality. Without a supplied carry score it sits at a neutral baseline of 20 for equities and preferreds (22 for income funds), plus a +3 for a return-of-capital preferred held as <button type="button" class="gloss" data-gloss="ballast" aria-expanded="false">Ballast</button> outside a known tax-advantaged account, and a macro adjustment of at most 2 points. Where the dashboard has beta or drawdown data but no yield, it supplies a stability proxy instead (10 to 27 points, from beta and one-year drawdown), and the bump and the macro adjustment do not apply.</p>
        <p>Regime fit and policy are written upstream. Your sector preferences (the over, neutral or underweight tilt you set for each sector) set the base: regime fit 32, 22 or 10; policy 24, 16 or 7. Theme overlap with the thesis adds up to 6 and 4 points, and extracted policy evidence can add up to 5. The live macro regime then moves regime fit by at most 4 and policy by at most 3. A macro read can tilt these sub-scores; your own sector preferences move them much further.</p>
        <p>The live macro regime is one of four labels (hawkish, dovish, stagflationary, neutral) set by the direction of three series: the Fed funds rate, CPI inflation and the unemployment rate. At least two must show a confirmed trend, or the label stays neutral. Rates, inflation and unemployment all rising read stagflationary; rising rates, or rising inflation without falling rates, read hawkish; falling rates without rising inflation read dovish; anything else is neutral. A new label must repeat across two consecutive syncs before it replaces the old one, and data more than 48 hours old leaves scores unadjusted. The yield curve is recorded but does not enter the label, and unemployment decides only the stagflationary case; there is no direct measure of output growth. By sector group, the label moves regime fit by at most 4 points, policy by at most 3 and carry by at most 2, a few CIS points at most. A second, portfolio-level reading (risk-on, selective, transition, defensive) combines this label with the VIX, high-yield spreads, tripwire alerts and how broadly your holdings are leading; it shapes the Next Dollar Score, not CIS.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Component E &middot; reference weight 0.10</p>
        <h3 class="sub-title">Execution and sentiment.</h3>
      </div>
      <div class="measure prose">
        <p>E measures whether reality is starting to validate the thesis. It carries the least weight because execution follows quality: momentum confirms a thesis, and it never gets to dominate one. Two sub-scores of 50 points each: execution quality, read from three-month price momentum with a volatility adjustment, and market acceptance, read from trading turnover. That is the equity route; funds use expense ratio and assets, and Bitcoin and crypto have their own inputs.</p>
        <p>Momentum has a strict definition, and the engine checks it: <strong>(price now &minus; price three months ago) &divide; price three months ago</strong>, stored as a ratio and requiring at least 60 observations. Below that minimum, or when a one-month series stands in for a three-month one, the value is demoted to a proxy and loses weight. A language-model estimate may fill it for display, but the score refuses one (<a class="part-ref" href="#evidence-math">Evidence</a>).</p>
        <p>Market acceptance is turnover: thirty-day dollar volume over market value, clamped to a sensible range and scored on a tier ladder. It asks whether the market is actually trading the name, which is a separate question from whether the price went up.</p>
        <p>Preferred equity runs an inverted momentum ladder. For an instrument held for its carry, <em>stability</em> is the good outcome, so the flattest tape scores highest.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Routing &middot; what gets scored how</p>
        <h3 class="sub-title">Asset class decides the scorer, in strict precedence.</h3>
      </div>
      <div class="measure prose">
        <p>Private &rarr; Bitcoin-class &rarr; fund &rarr; crypto &rarr; equity. First match wins, and nothing falls through to the equity path. Bitcoin-class means the asset itself or a spot wrapper for it, and it is checked <em>before</em> the fund branch so that a spot Bitcoin fund scores through the monetary model rather than as a generic fund. Cash sentinels are never scored on the market path at all.</p>
        <p>This is the framework&rsquo;s central guard against fabrication. The failure it prevents is scoring an instrument against inputs that do not exist for it (a preferred share graded on revenue growth, Bitcoin graded on a balance sheet) and producing a confident number from nothing.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Boundaries &middot; what a thesis may touch</p>
        <h3 class="sub-title">The thesis is bounded, and the bounds are the doctrine.</h3>
      </div>
      <div class="measure-feature">
        <div class="failure-modes">
          <div><span class="name">Weights</span><p>Moves them, inside the &plusmn;0.10 envelope, renormalized.</p></div>
          <div><span class="name">Sector relevance</span><p>Scales convexity and macro only, within 0.80 to 1.20. When the risk score is below 45, any uplift is damped toward 1.0 in proportion (uplift &times; risk &divide; 45).</p></div>
          <div><span class="name">Volatility tolerance</span><p>Softens or sharpens risk penalties, floored at insolvency.</p></div>
          <div><span class="name">Inside the components</span><p>Your sector preferences and the thesis themes set the regime-fit and policy sub-scores of macro, and theme overlap adds up to 4 points of optionality. Execution, headroom, catalysts, balance sheet and margins are thesis-invariant. The posture-preference bonus is computed and displayed but is <em>not</em> applied to the score.</p></div>
        </div>
      </div>
      <div class="measure prose">
        <p>The engine records the neutral score and a thesis delta (the weighted sum minus neutral) with every score. That delta captures what the weights and sector relevance do, but it also carries the macro downweight and, for Bitcoin, the addressable-market penalty in the cascade below, and neither of those is a thesis effect. It cannot show the thesis inputs inside the components, because they sit in both numbers. Subtracting Neutral from the final Adjusted score would also mix in the later evidence stages, so read the recorded delta instead. The framework budgets a thesis delta of 3 to 25 points, and a delta beyond 30 is worth investigating. That is a design budget, not a measured range, and nothing in the dashboard flags it.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Movement &middot; how far a score may travel</p>
        <h3 class="sub-title">Delta clamps.</h3>
      </div>
      <div class="measure prose">
        <p>An update is capped by how good the evidence behind it is. Low confidence permits a move of &plusmn;3 points, medium &plusmn;5, high &plusmn;8, and evidence derived through a proxy rather than observed directly &plusmn;6. A first score has no prior, so nothing clamps it. A material thesis change permits &plusmn;15. Because any move larger than 20 points bypasses the clamp as a model disagreement (below), the bands restrain only moves between their limit and 20 points: a low-confidence move of 12 is cut to 3, a move of 21 goes through.</p>
        <p>Three cases skip the <button type="button" class="gloss" data-gloss="delta-clamp" aria-expanded="false">delta clamp</button>: a change in the scoring model&rsquo;s version, which re-bases rather than adjusts (for crypto, a change in the model that produced the prior score); a private position, scored on a separate structural path with no clamp; and the model disagreement above, which lands in full. So moderate re-ratings, up to 20 points, earn their way across successive updates, while a larger jump passes through and is logged as a model divergence for you to inspect. Machinery built to resist mood should not also be able to suppress a real correction.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Evidence &middot; what the number is made of</p>
        <h3 class="sub-title">Weak data is discounted, not excluded.</h3>
      </div>
      <div class="measure prose">
        <p>Every metric enters carrying a provenance, and provenance carries a weight. A metric is blended toward a neutral baseline in proportion to how much it is trusted:</p>
        <p><strong>contribution = baseline + (raw value &minus; baseline) &times; admission weight</strong></p>
      </div>

      <div class="compare compare-wrap">
        <svg class="ink3-sprite" aria-hidden="true" focusable="false" width="0" height="0"><defs><path id="ink3-s1" d="M185 194 C184 205 189 196 190 199 C191 202 189 207 190 211 C191 215 192 221 195 225 C199 230 204 234 211 237 C217 239 227 240 234 240 C241 241 246 239 251 239 C255 239 257 240 261 240 C264 240 267 240 271 240 C274 240 277 240 281 239 C284 239 287 239 291 239 C294 239 297 240 301 240 C304 240 307 238 311 238 C314 238 317 238 321 238 C324 238 327 237 331 237 C334 236 337 234 341 234 C344 233 347 233 351 232 C354 232 357 231 361 231 C364 230 367 230 371 229 C374 229 377 228 381 228 C384 227 387 228 391 227 C394 226 397 225 401 225 C404 224 407 225 411 225 C414 225 417 225 421 224 C424 224 427 224 431 224 C434 224 437 225 441 225 C444 225 447 225 451 226 C454 226 457 226 461 226 C464 226 467 226 471 226 C474 226 477 228 481 228 C484 228 487 228 491 228 C494 228 497 228 501 228 C504 228 507 230 511 231 C514 231 517 232 521 231 C524 231 527 230 531 229 C534 229 537 228 541 228 C544 228 547 229 551 229 C554 229 557 227 561 227 C564 226 567 226 571 226 C574 226 577 225 581 225 C584 225 587 225 591 224 C594 224 597 222 601 222 C604 221 607 223 611 223 C614 223 617 223 621 223 C624 222 627 222 631 221 C634 221 637 221 641 221 C644 221 647 221 651 222 C654 222 657 224 661 225 C664 226 667 225 671 225 C674 225 677 226 681 226 C684 226 687 226 691 226 C694 226 697 227 701 227 C704 228 707 229 711 228 C714 228 717 227 721 226 C724 226 727 228 731 227 C734 227 737 225 741 225 C744 224 747 225 751 225 C754 225 757 224 761 224 C764 224 767 224 771 224 C774 223 777 222 781 221 C784 220 787 219 791 216 C794 214 797 210 800 207 C804 204 807 199 810 197 C814 194 817 192 820 191 C824 190 829 196 830 190 C832 184 832 161 830 155 C828 149 823 155 820 154 C816 153 813 151 810 148 C806 146 803 141 800 138 C796 135 793 132 789 129 C786 127 783 126 779 125 C776 124 773 123 769 122 C766 122 763 122 759 122 C756 122 753 122 749 122 C746 122 743 122 739 122 C736 122 733 120 729 120 C726 119 723 121 719 121 C716 121 713 119 709 119 C706 119 703 120 699 120 C696 121 693 121 689 122 C686 122 683 122 679 122 C676 122 673 123 669 123 C666 124 663 123 659 124 C656 124 653 126 649 127 C646 128 643 128 639 128 C636 128 633 128 629 128 C626 128 623 127 619 127 C616 127 613 127 609 127 C606 127 603 129 599 129 C596 128 593 126 589 126 C586 125 583 126 579 126 C576 126 573 125 569 125 C566 125 563 125 559 124 C556 124 553 122 549 122 C546 122 543 123 539 123 C536 123 533 123 529 123 C526 122 523 121 519 121 C516 121 513 121 509 122 C506 122 503 124 499 125 C496 125 493 125 489 125 C486 125 483 125 479 125 C476 126 473 127 469 127 C466 128 463 127 459 127 C456 127 453 128 449 128 C446 129 443 129 439 129 C436 129 433 130 429 131 C426 131 423 130 419 130 C416 130 413 130 409 130 C406 130 403 131 399 130 C396 130 393 129 389 128 C386 128 383 128 379 128 C376 127 373 127 369 126 C366 126 363 126 359 125 C356 125 353 124 349 124 C346 124 343 123 339 123 C336 122 333 121 329 120 C326 119 323 119 319 119 C316 119 313 119 309 119 C306 119 303 118 299 118 C296 117 293 118 289 118 C286 119 283 119 279 118 C276 118 273 118 269 118 C266 118 263 118 259 118 C256 119 252 120 249 120 C247 120 246 119 246 119 C246 118 249 118 249 118 C249 118 248 119 245 121 C242 122 236 123 230 125 C224 126 216 128 210 129 C204 130 200 119 195 130 C191 141 186 182 185 194 Z"/><path id="ink3-s2" d="M224 512 C223 522 228 513 228 515 C228 518 225 525 226 529 C226 534 226 539 229 543 C232 547 237 552 244 555 C250 558 260 559 267 560 C273 561 279 563 283 563 C287 564 289 563 292 562 C295 562 298 561 301 562 C304 562 307 563 310 563 C312 563 315 562 318 561 C321 561 324 560 327 559 C330 559 333 559 336 559 C339 558 342 558 344 557 C347 557 350 556 353 556 C356 555 359 555 362 554 C365 553 368 552 371 551 C374 550 376 549 379 549 C382 548 385 549 388 548 C391 548 394 545 397 545 C400 544 403 546 406 546 C408 546 411 544 414 544 C417 544 420 545 423 545 C426 545 429 546 432 546 C435 546 438 545 441 545 C443 546 446 546 449 546 C452 547 455 548 458 548 C461 549 464 549 467 549 C470 549 473 549 476 548 C479 548 481 548 484 549 C487 549 490 552 493 552 C496 552 499 550 502 550 C505 550 508 552 511 552 C514 552 516 550 519 550 C522 550 525 550 528 549 C531 549 534 548 537 548 C540 547 543 547 546 547 C549 546 551 546 554 546 C557 545 560 545 563 545 C566 544 569 543 572 543 C575 543 578 544 581 544 C583 544 586 544 589 543 C592 543 595 543 598 543 C601 543 604 543 607 543 C610 543 613 543 616 543 C618 544 621 544 624 544 C627 545 630 547 633 547 C636 548 639 548 642 548 C645 548 648 547 651 547 C654 547 656 548 659 548 C662 548 665 548 668 548 C671 548 674 548 677 548 C680 548 683 549 686 548 C689 548 691 547 694 546 C697 546 700 546 703 546 C706 546 709 544 712 543 C715 543 718 543 721 543 C724 543 726 542 729 542 C732 542 735 541 738 541 C741 541 744 541 747 541 C750 541 753 540 756 538 C758 536 761 531 764 528 C767 525 770 521 773 519 C776 516 779 514 781 512 C784 511 789 516 790 510 C792 504 791 482 790 476 C788 470 784 476 781 474 C778 473 775 471 772 468 C769 466 766 462 763 459 C760 456 757 452 754 450 C752 447 749 447 746 447 C743 446 740 447 737 447 C734 447 731 446 728 446 C725 446 722 446 719 446 C717 445 714 446 711 445 C708 445 705 443 702 443 C699 442 696 443 693 443 C690 442 687 441 684 441 C681 440 679 441 676 441 C673 441 670 441 667 441 C664 442 661 441 658 442 C655 442 652 443 649 443 C646 443 644 442 641 442 C638 442 635 442 632 443 C629 444 626 445 623 446 C620 447 617 447 614 447 C612 448 609 448 606 448 C603 448 600 448 597 448 C594 448 591 448 588 448 C585 448 582 448 579 448 C577 448 574 449 571 449 C568 449 565 448 562 447 C559 447 556 447 553 447 C550 446 547 446 544 446 C541 446 539 445 536 445 C533 445 530 444 527 443 C524 443 521 443 518 443 C515 443 512 442 509 442 C506 442 504 444 501 444 C498 444 495 442 492 442 C489 442 486 444 483 445 C480 446 477 446 474 446 C471 446 469 445 466 445 C463 445 460 446 457 446 C454 447 451 448 448 448 C445 449 442 449 439 450 C437 450 434 449 431 450 C428 450 425 450 422 450 C419 451 416 452 413 451 C410 451 407 450 404 450 C402 450 399 451 396 451 C393 451 390 449 387 448 C384 447 381 448 378 448 C375 447 372 447 369 446 C366 445 364 443 361 443 C358 442 355 442 352 441 C349 441 346 440 343 440 C340 440 337 439 334 439 C331 439 328 439 326 438 C323 438 320 437 317 436 C314 436 311 435 308 435 C305 435 302 437 299 437 C296 437 293 436 290 436 C288 436 283 435 282 435 C280 436 280 438 281 439 C281 440 286 439 286 440 C287 441 286 442 283 443 C281 444 275 445 269 447 C264 448 255 451 249 452 C244 453 240 442 236 452 C232 462 226 501 224 512 Z"/><path id="ink3-s3" d="M-3 846 C-3 858 5 848 9 851 C12 854 14 859 18 864 C21 869 25 875 30 879 C36 883 43 886 50 888 C58 890 67 891 74 891 C82 892 89 891 94 890 C100 890 105 888 110 888 C115 888 121 888 126 888 C131 888 136 888 141 888 C147 888 152 886 157 886 C162 886 167 886 173 886 C178 886 183 886 188 886 C193 886 199 885 204 885 C209 884 214 884 219 884 C225 884 230 885 235 885 C240 885 245 882 251 882 C256 881 261 882 266 881 C271 881 277 882 282 881 C287 880 292 878 297 877 C303 877 308 878 313 877 C318 877 324 875 329 875 C334 875 339 875 344 875 C350 874 355 874 360 873 C365 873 370 872 376 871 C381 871 386 872 391 873 C396 873 402 873 407 873 C412 873 417 873 422 873 C428 874 433 873 438 873 C443 873 449 874 454 874 C459 874 464 874 469 874 C475 874 480 875 485 875 C490 876 495 876 501 876 C506 876 511 876 516 877 C521 877 527 878 532 878 C537 878 542 877 548 877 C553 877 558 877 563 877 C568 877 574 878 579 877 C584 877 589 876 594 875 C600 875 605 875 610 875 C615 874 620 872 626 872 C631 872 636 872 641 872 C646 872 652 872 657 871 C662 871 667 870 672 870 C678 870 683 869 688 869 C693 869 698 867 704 867 C709 867 714 868 719 869 C725 869 730 868 735 868 C740 868 745 868 751 869 C756 870 761 871 766 872 C771 872 777 871 782 872 C787 872 792 873 798 874 C803 874 808 873 813 873 C818 873 824 873 829 873 C834 873 839 874 844 874 C850 875 855 875 860 874 C865 874 870 872 876 871 C881 871 886 871 891 870 C896 870 902 870 907 869 C912 869 917 869 922 868 C928 867 933 866 938 864 C943 862 948 859 954 855 C959 852 964 846 969 844 C974 841 979 839 985 838 C990 836 998 841 1000 835 C1003 829 1002 807 1000 801 C997 795 989 800 984 799 C979 798 974 796 968 793 C963 790 958 785 953 782 C947 779 942 776 937 773 C932 771 927 770 921 770 C916 769 911 769 906 769 C900 769 895 769 890 768 C885 768 880 768 874 768 C869 767 864 765 859 765 C854 765 848 765 843 765 C838 766 833 767 827 767 C822 767 817 768 812 768 C807 768 801 767 796 767 C791 768 786 769 781 770 C775 770 770 769 765 770 C760 771 755 772 749 773 C744 774 739 774 734 774 C729 775 723 774 718 774 C713 774 708 776 703 776 C697 776 692 775 687 775 C682 774 677 774 671 774 C666 774 661 773 656 773 C650 773 645 772 640 772 C635 772 630 773 624 773 C619 773 614 771 609 771 C604 770 598 771 593 770 C588 770 583 769 577 769 C572 769 567 770 562 770 C557 770 551 770 546 770 C541 770 536 769 531 769 C525 770 520 771 515 771 C510 771 505 771 499 772 C494 772 489 773 484 773 C479 774 473 775 468 775 C463 775 458 775 453 775 C447 775 442 776 437 776 C432 776 427 776 421 776 C416 777 411 777 406 777 C400 778 395 778 390 778 C385 778 380 780 374 780 C369 780 364 778 359 778 C354 778 348 777 343 777 C338 777 333 777 328 777 C322 777 317 776 312 775 C307 775 301 776 296 776 C291 775 286 773 281 772 C275 772 270 772 265 772 C260 772 255 773 249 772 C244 772 239 770 234 769 C228 769 223 771 218 771 C213 771 208 771 202 770 C197 770 192 769 187 769 C182 769 176 770 171 770 C166 770 161 771 156 770 C150 770 145 769 140 769 C135 768 130 769 124 769 C119 770 114 770 109 769 C103 769 98 768 93 767 C89 767 85 767 82 767 C79 767 78 766 75 766 C72 766 69 766 64 767 C59 767 52 770 45 771 C38 773 29 775 22 776 C16 777 8 767 3 778 C-1 790 -4 833 -3 846 Z"/><path id="ink3-dash" transform="translate(0 500)" d="M-2 11 C-1 21 5 13 8 16 C11 19 13 24 16 28 C18 32 21 36 25 39 C28 43 32 47 36 49 C41 52 46 54 52 55 C58 57 65 57 71 58 C77 58 83 57 88 57 C93 57 96 57 101 57 C105 56 109 56 113 56 C117 55 121 54 126 53 C130 52 134 51 138 51 C142 51 146 51 151 51 C155 50 159 49 163 48 C167 47 171 46 175 46 C180 45 184 45 188 44 C192 44 196 43 200 43 C205 42 209 42 213 42 C217 42 221 41 225 40 C230 40 234 42 238 41 C242 41 246 39 250 39 C255 39 259 41 263 41 C267 41 271 39 275 39 C280 39 284 39 288 39 C292 39 296 40 300 40 C305 40 309 40 313 41 C317 41 321 42 325 42 C330 42 334 43 338 43 C342 43 346 42 350 42 C355 42 359 44 363 44 C367 44 371 43 375 43 C380 43 384 43 388 43 C392 43 396 42 400 42 C405 42 409 43 413 42 C417 42 421 41 425 41 C430 40 434 41 438 41 C442 40 446 40 450 39 C455 39 459 37 463 37 C467 36 471 36 475 36 C480 36 484 36 488 36 C492 36 496 36 500 35 C505 35 509 34 513 33 C517 32 521 30 525 29 C530 28 534 28 538 26 C542 24 546 21 550 20 C554 18 559 16 563 14 C567 13 571 11 575 10 C579 9 583 9 588 8 C592 8 598 12 600 7 C602 3 602 -15 600 -19 C598 -24 592 -20 587 -20 C583 -21 579 -21 575 -22 C571 -23 566 -24 562 -26 C558 -27 554 -29 550 -31 C546 -32 541 -35 537 -37 C533 -38 529 -39 525 -40 C520 -41 516 -42 512 -43 C508 -44 504 -45 500 -45 C495 -46 491 -45 487 -46 C483 -46 479 -45 475 -46 C470 -46 466 -45 462 -46 C458 -46 454 -48 450 -48 C445 -49 441 -49 437 -49 C433 -49 429 -49 425 -49 C420 -49 416 -50 412 -51 C408 -51 404 -50 400 -50 C395 -50 391 -50 387 -50 C383 -50 379 -50 375 -50 C370 -50 366 -51 362 -51 C358 -51 354 -49 350 -49 C345 -48 341 -50 337 -50 C333 -50 329 -49 325 -49 C320 -48 316 -48 312 -47 C308 -47 304 -46 300 -46 C295 -45 291 -45 287 -45 C283 -45 279 -44 275 -44 C270 -45 266 -46 262 -46 C258 -46 254 -44 250 -44 C245 -44 241 -46 237 -46 C233 -46 229 -45 225 -45 C220 -45 216 -46 212 -46 C208 -47 204 -46 200 -47 C195 -47 191 -48 187 -48 C183 -49 179 -49 175 -49 C170 -50 166 -51 162 -52 C158 -52 154 -53 149 -54 C145 -54 141 -54 137 -54 C133 -54 129 -55 124 -56 C120 -56 116 -57 112 -58 C108 -58 104 -58 99 -59 C95 -59 91 -58 87 -58 C84 -59 81 -59 79 -59 C76 -60 75 -60 73 -60 C70 -60 68 -61 64 -60 C60 -60 55 -58 50 -57 C46 -56 40 -54 34 -52 C29 -50 22 -47 17 -45 C11 -44 5 -52 2 -42 C-1 -33 -3 2 -2 11 Z M660 21 C662 28 668 24 672 25 C675 27 679 30 683 32 C687 35 691 38 694 41 C698 43 702 44 706 45 C710 46 713 45 717 45 C721 45 725 45 728 45 C732 44 736 44 740 44 C744 44 747 44 751 44 C755 44 759 46 762 46 C766 46 770 46 774 45 C778 45 781 43 785 43 C789 42 793 43 796 43 C800 43 804 42 808 42 C812 42 815 41 819 41 C823 41 827 42 830 41 C834 41 838 39 842 39 C845 39 849 39 853 39 C857 39 861 40 864 39 C868 39 872 37 876 37 C879 37 883 37 887 37 C891 38 895 38 898 38 C902 38 906 38 910 37 C913 37 917 37 921 37 C925 37 929 37 932 37 C936 37 940 37 944 36 C947 36 951 34 955 32 C959 31 963 28 966 26 C970 23 974 19 978 17 C981 14 985 13 989 11 C993 10 998 11 1000 7 C1002 4 1002 -6 1000 -9 C998 -12 992 -11 989 -13 C985 -14 981 -15 977 -18 C973 -20 970 -24 966 -26 C962 -29 958 -31 954 -33 C951 -35 947 -36 943 -37 C939 -37 935 -37 932 -37 C928 -37 924 -37 920 -37 C917 -37 913 -37 909 -37 C905 -37 901 -37 898 -37 C894 -37 890 -37 886 -36 C883 -36 879 -36 875 -36 C871 -36 867 -38 864 -38 C860 -38 856 -38 852 -38 C849 -38 845 -37 841 -37 C837 -37 833 -39 830 -39 C826 -40 822 -39 818 -39 C814 -39 811 -39 807 -39 C803 -40 799 -40 796 -40 C792 -40 788 -40 784 -40 C780 -40 777 -42 773 -42 C769 -43 765 -43 762 -43 C758 -42 754 -41 750 -40 C746 -40 743 -40 739 -40 C735 -40 731 -41 728 -41 C724 -41 720 -41 716 -41 C712 -41 709 -41 705 -40 C701 -40 697 -38 694 -36 C690 -34 686 -30 682 -27 C679 -25 675 -22 671 -20 C667 -18 662 -23 660 -16 C658 -9 658 14 660 21 Z"/></defs></svg>
        <table>
          <caption>Admission weights by provenance</caption>
          <thead>
            <tr><th scope="col">Provenance</th><th scope="col">Weight</th><th scope="col">In the app</th><th scope="col">Meaning</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row" class="col-primary">Direct</th><td data-label="Weight">1.00</td><td data-label="In the app" class="ink3-cell"><span class="ink3" data-tone="ok" role="img" aria-label="Three of three: measured"><svg viewBox="-40 -20 1080 1060" aria-hidden="true" focusable="false"><use href="#ink3-s1" data-lit="true"/><use href="#ink3-s2" data-lit="true"/><use href="#ink3-s3" data-lit="true"/></svg></span></td><td data-label="Meaning">Observed from an authoritative source</td></tr>
            <tr><th scope="row">Derived</th><td data-label="Weight">0.85</td><td data-label="In the app" class="ink3-cell"><span class="ink3" data-tone="caution" role="img" aria-label="Two of three: computed"><svg viewBox="-40 -20 1080 1060" aria-hidden="true" focusable="false"><use href="#ink3-s1" data-lit="true"/><use href="#ink3-s2" data-lit="true"/><use href="#ink3-s3" data-lit="false"/></svg></span></td><td data-label="Meaning">Computed from observed inputs</td></tr>
            <tr><th scope="row">Stale</th><td data-label="Weight">0.70</td><td data-label="In the app" class="ink3-cell"><span class="ink3-age">Stale</span></td><td data-label="Meaning">Real but old; full weight for slow-moving fundamentals</td></tr>
            <tr><th scope="row">Proxy</th><td data-label="Weight">0.60</td><td data-label="In the app" class="ink3-cell"><span class="ink3" data-tone="critical" role="img" aria-label="One of three: a stand-in"><svg viewBox="-40 -20 1080 1060" aria-hidden="true" focusable="false"><use href="#ink3-s1" data-lit="true"/><use href="#ink3-s2" data-lit="false"/><use href="#ink3-s3" data-lit="false"/></svg></span></td><td data-label="Meaning">A stand-in for the quantity actually wanted</td></tr>
            <tr><th scope="row">Estimated</th><td data-label="Weight">0.50</td><td data-label="In the app" class="ink3-cell"><span class="ink3" data-tone="critical" role="img" aria-label="One of three: estimated"><svg viewBox="-40 -20 1080 1060" aria-hidden="true" focusable="false"><use href="#ink3-s1" data-lit="true"/><use href="#ink3-s2" data-lit="false"/><use href="#ink3-s3" data-lit="false"/></svg></span></td><td data-label="Meaning">Language-model estimate</td></tr>
            <tr><th scope="row">Rejected</th><td data-label="Weight">0.00</td><td data-label="In the app" class="ink3-cell"><span class="ink3" data-tone="neutral" role="img" aria-label="Unknown: the ink dash"><svg viewBox="-40 -20 1080 1060" aria-hidden="true" focusable="false"><use href="#ink3-dash"/></svg></span></td><td data-label="Meaning">Not admissible for this metric at all</td></tr>
          </tbody>
        </table>
      </div>
      <p class="compare-key">The app draws the same reading beside each value: the three-stroke trust meter, the word Stale, or the ink dash where nothing is known. Market metrics (momentum, realized volatility, volume, drawdown) reject language-model estimates, with one exception: for over-the-counter equities, where an estimate is the expected source, estimated market cap and trading volume are admitted at 0.70. Slow-moving fundamentals such as margin and leverage take a stale reading at full weight, because they are stale by nature. This weighting applies on the equity and fund routes; the crypto and Bitcoin routes use their own validated signals.</p>

      <div class="measure prose">
        <p>Two further gates sit above the individual metrics. <strong>Coverage</strong> weighs the core fields at 0.70 and the enhancing fields at 0.30; below 70 percent the score is capped at 75, below 50 percent at 68, below 30 percent at 60. Language-model estimates count as present here; the admission weight is where they are discounted. <strong>Proxy suppression</strong> caps the score at 85 when more than 40 percent of the sub-scores rest on proxies or heuristics.</p>
        <p>Both encode the same rule: <em>incomplete evidence limits how good a score is allowed to look, and never inflates one.</em> A missing field can cap how high the score may go, and it lowers the score&rsquo;s confidence. It is never scored as if the missing value were bad: an absent margin is not a zero margin.</p>
        <p>Two holdings with the same inputs get the same score; a tie is a tie, and what separates thin-data holdings is coverage and confidence. Until engine version 3.2 the engine also added a fixed offset computed from the ticker symbol, up to 20 percent of a sub-score&rsquo;s maximum, which carried no information about the holding. The documentation audit found it, and it was removed on October 3, 2026; the <a class="part-ref" href="/evidence#forward">Evidence page</a> records what it did.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">The cascade &middot; how the emitted number forms</p>
        <h3 class="sub-title">Order of operations.</h3>
      </div>
      <div class="measure prose">
        <p>Each stage is held within 0 to 100, and the result is carried as an unrounded float: a position scores 78.3, not 75 or 80. Only the wrapper-adjusted number shown beside a holding is rounded.</p>
      </div>
      <div class="measure-feature">
        <ol class="proc-steps">
          <li><span class="step-title">Components</span><p>C, R, M and E computed on their own routes, sub-scores capped.</p></li>
          <li><span class="step-title">Thesis weights</span><p>Applied inside the &plusmn;0.10 envelope, renormalized to sum to 1.0.</p></li>
          <li><span class="step-title">Sector relevance</span><p>Scales convexity and macro only, 0.80 to 1.20, damped when risk is weak.</p></li>
          <li><span class="step-title">Macro downweight</span><p>Low or medium macro confidence reduces the macro weight; the remainder moves to convexity and risk.</p></li>
          <li><span class="step-title">Bitcoin-class adjustment</span><p>For Bitcoin and its spot wrappers only: convexity loses 2 points when the addressable-market input is the baseline rather than a research profile. Other assets pass through unchanged.</p></li>
          <li><span class="step-title">Weighted sum</span><p>The raw aggregate, clamped.</p></li>
          <li><span class="step-title">Delta clamp</span><p>Movement bounded by evidence, with the bypasses above.</p></li>
          <li><span class="step-title">Research and market-structure deltas</span><p>Bounded adjustments from deeper evidence.</p></li>
          <li><span class="step-title">Coverage cap</span><p>75, 68 or 60, by how complete the evidence is.</p></li>
          <li><span class="step-title">Proxy suppression</span><p>Capped at 85 if the score leans on proxies.</p></li>
          <li><span class="step-title">Filing-intelligence delta</span><p>The last bounded adjustment. The result is the emitted CIS.</p></li>
        </ol>
      </div>

      <div class="measure">
        <p class="sub-meta">Bands &middot; where a score lands</p>
        <h3 class="sub-title">Reading the number.</h3>
      </div>
      <div class="measure prose">
        <p>Scores stay floats until display, where they fall into four bands. The bands are half-open and matched from the top: 70.0 lands in Strong, 69.999 in Moderate.</p>
      </div>

      <div class="measure">
        <div class="di-bands" role="img" aria-label="The four-band register: seventy and above Strong, sixty to sixty-nine Moderate, fifty to fifty-nine Caution, below fifty Weak."><span class="di-band" data-band="red"><i>&lt;50</i>Weak</span><span class="di-band" data-band="orange"><i>50&ndash;59</i>Caution</span><span class="di-band" data-band="yellow"><i>60&ndash;69</i>Moderate</span><span class="di-band" data-band="green"><i>70+</i>Strong</span></div>
      </div>

      <div class="measure prose">
        <p>In the dashboard the same bands carry numeric labels (70+, 60&ndash;69, 50&ndash;59, &le;49) and conviction tiers (core, standard, starter, avoid); the Next Dollar Score&rsquo;s strong, moderate and weak ladder cuts at different points, so read the two separately.</p>
        <p>The framework also carries a calibration target for how a healthy universe should distribute: roughly 3 to 5 percent above 88, 15 to 20 percent from 80 to 87, 30 to 40 percent from 70 to 79, 25 to 30 percent from 60 to 69, and 10 to 15 percent below 60. It is <em>illustrative</em>, and no code applies it. Its use is diagnostic, and the rule attached to it is worth stating in full: <strong>if the universe cannot reach 88, audit the implementation before questioning the philosophy.</strong></p>
        <p>The canonical score stops at the single holding. The overlays in the table above are where context enters, and the book as a whole is judged by the construction score, next.</p>
      </div>
    </section>

    <section class="section" id="fis-math" aria-labelledby="fis-math-title">
      <div class="measure">
        <p class="section-eyebrow section-signal" data-glyph-text>Construction Integrity</p>
        <h2 class="section-title" id="fis-math-title">FIS: the construction score.</h2>
      </div>
      <div class="measure prose">
        <p>Twelve good positions can still make a bad portfolio. Where CIS judges one holding, the <button type="button" class="gloss" data-gloss="fis" aria-expanded="false">Framework Integrity Score</button> judges the book as assembled. FIS starts the assembled portfolio at 100 and deducts capped, named penalties in five buckets: allocation (25), governance (15), dead capital (15), concentration (15) and complexity (10, hard cap).</p>
        <p><strong>FIS = max(0, 100 &minus; &Sigma; min(bucket penalty, bucket cap))</strong></p>
        <p>The caps sum to 80, so a valid FIS cannot fall below 20. That floor is <em>derived</em>, not declared: it falls out of the caps. It is also only a bound. Governance and dead capital are value-weighted (below), so for any book of fewer than 200 positions each of those buckets stays under 10 points, and FIS stays above 30 even with every other bucket full. A zero on a screen therefore means a broken input.</p>
        <p>An invalid portfolio (no positions, no capital, malformed input) returns <em>null</em>, never 100. An empty portfolio is not a perfect one.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Severity &middot; the value-weighting rule</p>
        <h3 class="sub-title">A bad small position is not a bad big one.</h3>
      </div>
      <div class="measure prose">
        <p>Two of the five buckets scale their penalties by how much of the portfolio the offending position represents:</p>
        <p><strong>severity = clamp(position value &divide; portfolio total, 0.002, 0.12)</strong></p>
        <p>Governance and dead-capital charges are multiplied by the position&rsquo;s share of the portfolio, counted between 0.2 and 12 percent: a 6-point charge on a 5 percent position costs 0.3 points, and no single position can cost more than 0.72 in governance or 0.84 in dead capital. Allocation, concentration and complexity charges are flat. The floor means a rounding-error position still registers; the ceiling means one enormous position cannot fill a bucket by itself. This is what <button type="button" class="gloss" data-gloss="value-weighted" aria-expanded="false">value-weighted</button> means wherever the framework uses the term.</p>
      </div>

      <div class="compare compare-wrap">
        <table>
          <caption>The five penalty buckets, their caps, and whether position size scales them</caption>
          <thead>
            <tr><th scope="col">Bucket</th><th scope="col">Cap</th><th scope="col">Scales with size</th><th scope="col">What it prices</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row" class="col-primary">Allocation</th><td data-label="Cap">25</td><td data-label="Scales">No</td><td data-label="Prices">The dollar split across Roth, taxable and pre-tax against the FIS wrapper targets, and how positions spread across score bands</td></tr>
            <tr><th scope="row">Governance</th><td data-label="Cap">15</td><td data-label="Scales">Yes</td><td data-label="Prices">Positions scoring below 60, and positions in the 60s, charged more above 8 percent of the book</td></tr>
            <tr><th scope="row">Dead capital</th><td data-label="Cap">15</td><td data-label="Scales">Yes</td><td data-label="Prices">Positions with no documented thesis, and scores older than 90 days</td></tr>
            <tr><th scope="row">Complexity</th><td data-label="Cap">10 (hard)</td><td data-label="Scales">No (counts)</td><td data-label="Prices">Unclassified distributions, and undocumented positions below 70 beyond an allowance of three</td></tr>
            <tr><th scope="row">Concentration</th><td data-label="Cap">15</td><td data-label="Scales">No</td><td data-label="Prices">A single position above 15 percent, the top three above 40, the top five above 60</td></tr>
          </tbody>
        </table>
      </div>

      <div class="measure prose">
        <p><strong>Allocation</strong> checks two things. The first is the dollar split across Roth, taxable and pre-tax, measured against the FIS wrapper targets of 45, 35 and 20 percent and charged only once total drift passes 10 points (worth at most about 6 points). Bitcoin held under the dashboard&rsquo;s own Bitcoin wrapper counts in the total but has no target, so it adds to the measured drift. The second is the count of positions in each score band against a target spread: up to 5 points per band, and nothing for a drift of 2 points or less. The bucket does not check whether each position sits in the wrapper <a class="part-ref" href="/part-4-tax-architecture-roc-strategy#wrappers">Part 4</a> assigns it; that placement stays your check.</p>
        <p><strong>Governance</strong> applies one charge per position, first match wins, each multiplied by the position&rsquo;s severity: a score below 60 carries 6 base points (50 to 59 is charged the same as below 50); a position scoring 60 to 69 that weighs more than 8 percent of the portfolio, 6; a position scoring 60 to 69, 4; a momentum breakdown, 4 (specified, but nothing in the engine sets it yet). A 5 percent position scoring 55 therefore costs 0.3 points. This bucket reads the canonical CIS, not the wrapper-adjusted one that the dashboard&rsquo;s governance checks use.</p>
        <p><strong>Dead capital</strong> charges 5 base points, value-weighted, for a position with no documented thesis. A score older than 90 days is stale: the dead-capital bucket charges it 2 base points, value-weighted, and the dashboard&rsquo;s diagnostics warn once a score is more than 60 days old and fail past 90. A position more than 50 percent above its cost basis whose score is older than 60 days is flagged for a refresh. Both charges can fire on the same position, and a <em>missing</em> timestamp is treated as unknown rather than stale, so it draws nothing.</p>
        <p><strong>Concentration</strong> charges 8 points for each position above 15 percent, matching the default cap in <a class="part-ref" href="/part-5-portfolio-construction-position-management#torque">Part 5</a>, so a position inside its 15 to 18 percent override band is still billed. It charges 6 if the top three exceed 40 percent and 4 if the top five exceed 60, looser than Part 5&rsquo;s caps of 35 and 50. Bitcoin and its spot wrappers are excluded from all three measures by archetype, because the backbone is not a concentration failure. Equities with Bitcoin exposure are ordinary concentration.</p>
        <p><strong>Complexity</strong> charges 1 point for each position with an unclassified distribution, and 0.5 for each position scoring below 70 that is carried without documented rationale, beyond an allowance of three. By the FIS rules a documented thesis, hold rationale or remediation plan suppresses the low-score charge.</p>
        <p>These are the framework&rsquo;s FIS rules as the engine computes them. Some inputs are not yet fed: nothing sets the momentum-breakdown flag, and the thesis, distribution-type, hold-rationale, remediation-plan and override records you keep on a holding are not read by the score, which in the current build bills every position as undocumented and unclassified. By the same rules, a concentration breach covered by a documented override is marked as acknowledged and charged in full. The score does not yet read overrides, so the acknowledgment does not appear; the points are the same either way.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Boundary &middot; where FIS leaves its own domain</p>
        <h3 class="sub-title">Construction quality scales modeled outcomes.</h3>
      </div>
      <div class="measure prose">
        <p>FIS reaches outside itself in one place, forward projections, and it does two things there. One projection path scales expected realization by construction quality:</p>
        <p><strong>multiplier = 0.50 + (FIS &divide; 100) &times; 0.70</strong></p>
        <p>A FIS of 50 yields 0.85, a FIS of 100 yields 1.20. Another projection path scales modeled volatility the other way, from 1.20 at FIS 0 to 0.80 at FIS 100. The claim being modeled is narrow: a poorly built portfolio is assumed to <em>capture less of its own assets&rsquo; upside</em>, and to swing more on the way. FIS never feeds back into CIS, and never into itself. The projection models themselves are among the surfaces this page holds back (<a class="part-ref" href="#scope">Scope</a>).</p>
        <p>Neither score is a position size. Turning a score into a weight takes a posture and a band table, which come next.</p>
      </div>
    </section>

    <section class="section" id="sizing-math" aria-labelledby="sizing-math-title">
      <div class="measure">
        <p class="section-eyebrow section-signal" data-glyph-text>Translation</p>
        <h2 class="section-title" id="sizing-math-title">From score to size.</h2>
      </div>
      <div class="measure prose">
        <p>The translation takes three things, a <button type="button" class="gloss" data-gloss="posture" aria-expanded="false">posture</button>, a band table and a budget, and every number it produces is a <em>ceiling</em>. The arithmetic below is what the dashboard&rsquo;s portfolio builder applies to the model portfolios it generates. On the book you actually hold, nothing resizes anything: the bands are the guidance you size against.</p>
      </div>

      <div class="compare compare-wrap">
        <table>
          <caption>Position sizing bands by posture and score</caption>
          <thead>
            <tr><th scope="col">Posture</th><th scope="col">Score</th><th scope="col">Weight range</th><th scope="col">Band</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row" class="col-primary">Torque</th><td data-label="Score">70&ndash;100</td><td data-label="Weight">8&ndash;15%</td><td data-label="Band">Core</td></tr>
            <tr><th scope="row">Torque</th><td data-label="Score">60&ndash;69</td><td data-label="Weight">4&ndash;8%</td><td data-label="Band">Standard</td></tr>
            <tr><th scope="row">Torque</th><td data-label="Score">50&ndash;59</td><td data-label="Weight">2&ndash;4%</td><td data-label="Band">Starter</td></tr>
            <tr><th scope="row">Ballast</th><td data-label="Score">70&ndash;100</td><td data-label="Weight">5&ndash;8%</td><td data-label="Band">Core</td></tr>
            <tr><th scope="row">Ballast</th><td data-label="Score">60&ndash;69</td><td data-label="Weight">3&ndash;5%</td><td data-label="Band">Standard</td></tr>
            <tr><th scope="row">Ballast</th><td data-label="Score">50&ndash;59</td><td data-label="Weight">1&ndash;3%</td><td data-label="Band">Marginal</td></tr>
            <tr><th scope="row">Hype</th><td data-label="Score">50&ndash;100</td><td data-label="Weight">2&ndash;5%</td><td data-label="Band">Eligible</td></tr>
            <tr><th scope="row">Torque, Ballast or Hype</th><td data-label="Score">below 50</td><td data-label="Weight">0</td><td data-label="Band">Not allocation-worthy</td></tr>
          </tbody>
        </table>
      </div>
      <p class="compare-key">Below 50 sizes to zero in each of the three sized postures; this is where the framework declines to hold, and it is the one hard gate in the ladder. Bitcoin sits outside this ladder, governed by <a class="part-ref" href="/part-3-bitcoin-convexity-backbone#backbone">Part 3</a>, and the builder sizes STRC by its own rule (see the construction row).</p>

      <div class="measure prose">
        <p>Within a band the ceiling moves linearly with the score:</p>
        <p><strong>justified weight = min weight + band progress &times; (max weight &minus; min weight)</strong>, capped at 15 percent, where <strong>band progress = (score &minus; the band&rsquo;s lowest score) &divide; the band&rsquo;s width</strong></p>
        <p>So a <button type="button" class="gloss" data-gloss="torque" aria-expanded="false">Torque</button> position at 70 justifies 8 percent, at 85 justifies 11.5 percent, at 100 justifies 15. A <button type="button" class="gloss" data-gloss="hype" aria-expanded="false">Hype</button> position at 50 justifies 2 percent, at 100 justifies 5.</p>
        <p>The builder then scales every ceiling by how complete the build&rsquo;s data is. A data-confidence score (machine-data coverage weighted 70 percent, analysis coverage 30) sets a multiplier: 1.0 at 80 or above, 0.85 to 0.99 from 60 to 79, 0.65 to 0.84 from 40 to 59, and 0.40 to 0.64 below 40. A Torque position at 85 with a multiplier of 0.65 is capped at 7.5 percent instead of 11.5. A Torque position at 60 with a multiplier of 0.40 computes to 1.6 percent, and it is dropped, for the reason in the next paragraph.</p>
        <p><strong>The band&rsquo;s lower bound is not a floor.</strong> It is the low endpoint of the interpolation. In the main pass a computed weight below 2 percent is discarded, never raised. Three fallbacks then fill gaps. A wrapper less than 30 percent deployed takes candidates scoring 55 or more at Ballast ceilings. A wrapper that ends with fewer than 10 positions (8 on the fund route) is filled from admitted candidates scoring 50 or more, at no less than 1 percent each, keeping any fill of 0.5 percent or more. And a wrapper that would otherwise hold nothing takes up to three candidates at no less than 2 percent. So the builder will decline a weak name, and it will also fill a thin wrapper to a minimum count.</p>
        <p>Capital and the posture budget size <em>below</em> the ceiling. The ceiling says how much a score justifies; it never says how much to buy.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Concentration &middot; three layers, three purposes</p>
        <h3 class="sub-title">The same percentages mean different things.</h3>
      </div>
      <div class="measure prose">
        <p>Concentration appears in three places, at three sets of thresholds, and each has a different consumer. The doctrine is <a class="part-ref" href="/part-5-portfolio-construction-position-management#torque">Part 5</a>&rsquo;s: a single position capped at 15 percent by default, with an 18% absolute maximum under a documented override, the top three at 35 percent and the top five at 50. Bitcoin sits outside all three layers below, and STRC sits outside the builder&rsquo;s caps. Both of the builder&rsquo;s exceptions fork from that doctrine, which lets a single position past 15 percent only under a documented override, never past 18, and stops a single Ballast position at 10 percent. They describe what the software does, not the framework&rsquo;s limits.</p>
      </div>

      <div class="compare compare-wrap">
        <table>
          <caption>Concentration thresholds by layer</caption>
          <thead>
            <tr><th scope="col">Layer</th><th scope="col">Single</th><th scope="col">Top 3</th><th scope="col">Top 5</th><th scope="col">What happens</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row" class="col-primary">Construction</th><td data-label="Single">15%</td><td data-label="Top 3">35%</td><td data-label="Top 5">50%</td><td data-label="Effect">The 15 percent cap is applied during a build, with two exceptions. On the fund route the per-fund cap rises to 18 percent for a fund scoring 80 or more. And the pinned structured-carry position (STRC), placed in the taxable account of any build that has one, is exempt: it is targeted at 12 percent of the portfolio, raised to a quarter of the taxable account when that is larger (outside sample builds), and allowed up to 25 percent. Excess elsewhere is redistributed by headroom, and anything unabsorbable becomes cash. The top-three and top-five figures warn only.</td></tr>
            <tr><th scope="row">Scoring</th><td data-label="Single">15%</td><td data-label="Top 3">40%</td><td data-label="Top 5">60%</td><td data-label="Effect">FIS penalties: 8 points for each position above 15 percent, 6 for the top three, 4 for the top five.</td></tr>
            <tr><th scope="row">Emergency</th><td data-label="Single">none</td><td data-label="Top 3">none</td><td data-label="Top 5">65%</td><td data-label="Effect">Detected. A Concentration Breach tripwire flags a top five above 65 percent, excluding Bitcoin, and shows a pre-set instruction to trim the largest positions. A human does the trimming.</td></tr>
          </tbody>
        </table>
      </div>
      <p class="compare-key">All three rungs now have live consumers: the first shapes a build, the second changes a score, the third raises a tripwire. None trims a holding, so describing any of them as automatic enforcement would be false, and this page does not.</p>

      <div class="measure">
        <p class="sub-meta">Breadth &middot; how many positions</p>
        <h3 class="sub-title">Position count is an output, never an input.</h3>
      </div>
      <div class="measure prose">
        <p>You do not tell the builder to hold eighteen names. It works out how many the available conviction supports, starting from the density of the admitted candidate pool:</p>
        <p><strong>High</strong>: average score at least 75, with at least six names at 70 or above. <strong>Moderate</strong>: average at least 67, with at least ten at 65 or above. <strong>Low</strong>: average at least 60, with at least eight at 60 or above. <strong>Scarce</strong>: anything else.</p>
        <p>Density sets both the target count and how much capital deploys, each by formula. Denser conviction concentrates into fewer names: High targets 14 down to 10 positions and deploys fully; Moderate targets 18 down to 13 and deploys 95 percent; Low targets 16 to 22 and deploys 75 to 90 percent; Scarce targets 20 to 25 and deploys 60 to 75 percent. Counts stay between 10 and 25 names (8 and 15 on the fund route), but never exceed the number of candidates scoring 60 or more.</p>
        <p><strong>The undeployed remainder is held as cash, on purpose.</strong> On every build, position weights plus cash sum to exactly 1.0, so unallocated capital shows up as an explicit cash position instead of being spread over whatever ranked next.</p>
      </div>

      <aside class="callout callout-insight">
        <p class="callout-label">The admission gate does not widen to fill slots</p>
        <p>When conviction is scarce, the build deploys less and holds the rest as cash, and the admission bar stays where it is. A candidate is admitted on its score multiplied by the completeness of the evidence behind it, and that product, not the raw score, must clear 50. (Bitcoin-class holdings, STRC and return-of-capital income holdings are exempt from this gate.) The minimum-count fill above draws only on candidates that already cleared it.</p>
      </aside>

      <div class="measure prose">
        <p>A build is one moment. Governance is what watches the book you hold afterward.</p>
      </div>
    </section>

    <section class="section" id="governance-math" aria-labelledby="governance-math-title">
      <div class="measure">
        <p class="section-eyebrow section-signal" data-glyph-text>Governance</p>
        <h2 class="section-title" id="governance-math-title">What fires, and what it does.</h2>
      </div>
      <div class="measure prose">
        <p>Governance watches a defined set of conditions and speaks up when they cluster. What it does when it speaks up is the part worth being exact about, and these six terms are not interchangeable.</p>
      </div>

      <div class="measure-feature">
        <div class="failure-modes">
          <div><span class="name">Trigger</span><p>A threshold crossing inside one watched condition.</p></div>
          <div><span class="name">Event</span><p>A logged <em>transition</em>, a state that changed. An unchanged state logs nothing, which keeps the record short enough to read.</p></div>
          <div><span class="name">Recommendation</span><p>A described action with a priority and a deadline. Displayed. Never executed.</p></div>
          <div><span class="name">Proposal</span><p>A draft change that needs your explicit acceptance, and accepting it still applies nothing by itself.</p></div>
          <div><span class="name">Acknowledgment</span><p>A record that you saw it. It changes no arithmetic.</p></div>
          <div><span class="name">Automated mutation</span><p>Does not exist in this system.</p></div>
        </div>
      </div>

      <div class="measure">
        <p class="sub-meta">Cohort confluence</p>
        <h3 class="sub-title">One signal is noise. Several at once is a regime.</h3>
      </div>
      <div class="measure prose">
        <p>Start with what is not measured. The dashboard does not yet measure the three momentum dimensions of <a class="part-ref" href="/part-5-portfolio-construction-position-management#management">Part 5</a> (distance from the 52-week high, relative strength and breadth). Its Momentum Death tripwire reports unavailable rather than guessing. A coded screen of price against the 200-day and 50-day moving averages with an RSI band of 30 to 70 receives no data, so it reports every position as unavailable, and it is not treated as a stand-in for the three dimensions.</p>
        <p>What the dashboard does watch is stress across your holdings as a group. Its cohort confluence tripwire tracks ten registered signals, read from your non-cash positions (a fixed eight-name reference list stands in when you hold fewer than three) and from market-wide liquidity and volatility data. Eight have evaluators of their own, two of which fall back to rougher approximations when better data is missing; the other two slots, rates-volatility stress and market breadth, are filled by approximations built from free data. A signal read by approximation counts for 0.6 of a signal in the weighted score. Two signals within 48 hours raise level one, flag only; three raise level two, hedging only; four, or three including an intraday reversal, raise level three, which displays a pre-set playbook to trim the Torque cohort by 25 percent. The dashboard shows the playbook; it does not queue, propose or execute it.</p>
        <p>Four of the signals, as examples: an equal-weighted cohort gain of 12 percent or more over three sessions, or of 7 percent in one session with at least five names up more than 4 percent; four or more names at a two-day RSI of 98 or higher; three or more names trading 8 percent or more above the prior close and then closing at least 5 percent below the session high, on two and a half times their 20-day median volume; and a three-session decline of 4 percent or more with at least 60 percent of names at five-day lows.</p>
        <p>Escalation is not a raw count. The thresholds (two, three and four signals) scale with how many signals the system can read at all, directly or by a labeled approximation. Levels two and three need both the count and the weighted score; level one can be reached on count alone. A signal counts for 48 hours after it fires. A signal that cannot be evaluated on a run cannot fire, and it is reported unavailable rather than quiet. Most such signals still count toward the thresholds, but a few (the dealer-positioning index without a fresh reading, the leadership flip without data, an approximation short of data) drop out of the count, which can lower the thresholds.</p>
      </div>

      <aside class="callout callout-info">
        <p class="callout-label">Missing data fails closed</p>
        <p>A watched condition that cannot read its inputs reports <em>unavailable</em>, or <em>stale</em> when its data is old. It does not fire, and it is never read as calm. A set of conditions that cannot support an all-clear reports <em>unknown</em> instead of quiet.</p>
      </aside>

      <div class="measure prose">
        <p>A core set of macro conditions is watched alongside the cohort, each with a watch, caution and critical step: liquidity contraction (net liquidity, the Fed balance sheet less the Treasury account and reverse repo), a volatility regime shift at a VIX of 20, 25 and 35, credit stress at 1.0, 1.5 and 2.5 standard deviations of high-yield spreads, yield-curve inversion, a dollar spike of 2, 3 and 5 percent over ten days, bond-volatility acceleration (defined, but reported unavailable until a genuine MOVE feed exists), and a compound condition that needs both a VIX above 20 and a sharp five-day rise in it.</p>
        <p>Earnings proximity is checked position by position. The dashboard&rsquo;s Framework Rule Register flags a position above 3 percent of the book once its report is five calendar days away or less, and the positions table&rsquo;s status column starts marking the report six calendar days out. Because both count calendar days, the flag can open a trading day or two after the doctrine&rsquo;s T-5. It trims nothing; the trim is yours.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Recommendations &middot; in order of precedence</p>
        <h3 class="sub-title">What the Weekly Review asks of you.</h3>
      </div>
      <div class="measure prose">
        <p>The weekly loop itself is set out in <a class="part-ref" href="/part-6-convexity-framework-integrity-scoring#weekly">Part 6</a>. In the dashboard you run it from the Weekly Review, which recommends actions in a fixed precedence: a finding from the dashboard&rsquo;s three-level check first, then an earnings window above the 3 percent cap, then FIS below 70 (fix the top penalty), then a CIS move of 10 points or more (resize); no trigger means hold. The review cannot yet raise the earnings step, because it receives no earnings dates; the Framework Rule Register flags that case instead.</p>
        <p>The three-level check also runs with every portfolio recompute. Level one flags any position whose wrapper-adjusted CIS is below 75, level two a sector where more than half the scored positions sit below 80, and level three a FIS below 60 (on a recompute, also three or more of its broader rule checks failing at once). Their deadlines are 7 days, 14 days and 24 hours. None is an exit signal and none trades. Level one sits inside the Strong band, so a holding whose wrapper-adjusted score is between 70 and 75 draws a recommendation every time you run the review, even though on CIS 70 is a band boundary, not an action trigger.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">The boundary &middot; stated plainly</p>
        <h3 class="sub-title">Nothing here touches your positions.</h3>
      </div>
      <div class="measure prose">
        <p>The dashboard records every trade and never blocks one. When a tripwire breaches, the Add Position screen recommends pausing additions and still records the trade. No governance path in the system can modify a position, write a trade, alter an allocation weight, trigger a rebalance, or change how CIS or FIS is computed.</p>
        <p>The complete set of things governance writes is: evaluation proofs, transition events, acknowledgments and other issue-lifecycle records, watch-list selections, change proposals and their changelog, override records, single-day-move flags, the advisor notices it raises, and the Weekly Review&rsquo;s own record (the review, its decision log, the recommendations it made and the trigger queue it consumed). A Weekly Review may also ask the scoring pipeline to refresh up to ten stale scores, which rewrites those scores the normal way. Nothing else.</p>
        <p>That list is short by design, so every emergency condition in the framework ends with a person, not the code. Of the twelve emergency conditions in the framework&rsquo;s governance rules, five are detected live and shown with a pre-set response: a construction score below 60, a CIS drop of 15 points or more in 30 days, a Hype position 25 percent or more below cost, average correlation above 0.70 when price history allows, and a top five above 65 percent excluding Bitcoin. Two more are coded but report unavailable until their inputs exist: all three momentum dimensions turning negative, and a portfolio 20 percent below its peak. None executes its response. The other five are written instructions for a human: a broken position thesis, a regime change, credit spreads above 500 basis points, a broken macro thesis, and a market fall of more than 10 percent in a week. The Parts carry these conditions only in outline, as the tripwires of step 6 in <a class="part-ref" href="/part-1-foundation#order-of-operations">Part 1</a> and the protocols of <a class="part-ref" href="/part-5-portfolio-construction-position-management#management">Part 5</a>; the full list, with every threshold, is only here.</p>
        <p>The correlation condition is the Correlation Spike tripwire. It fires when the average pairwise correlation of all your non-cash holdings, not Torque alone, rises above 0.70, and it reports unavailable rather than calm unless every holding has at least 60 daily returns of history.</p>
        <p>One holding sits outside most of this machinery. Bitcoin is left out of every concentration layer and every Next Dollar addition, and it is scored on a route of its own, which comes next.</p>
      </div>
    </section>

    <section class="section" id="bitcoin-math" aria-labelledby="bitcoin-math-title">
      <div class="measure">
        <p class="section-eyebrow section-signal" data-glyph-text>The Backbone</p>
        <h2 class="section-title" id="bitcoin-math-title">Bitcoin: identity, headroom, accumulation.</h2>
      </div>
      <div class="measure prose">
        <p>Because Bitcoin has a scoring model of its own, the first question the system answers is what counts as Bitcoin. There are four categories, and they are not interchangeable.</p>
      </div>

      <div class="measure-feature">
        <div class="failure-modes">
          <div><span class="name">Native</span><p>The asset itself. Quoted on its own lane, held in Bitcoin units and valued in dollars, shown to eight decimal places.</p></div>
          <div><span class="name">Spot wrapper</span><p>A maintained list of spot funds, checked <em>before</em> the fund branch so they score through the monetary model instead of as generic funds. Membership is explicit: a newly launched wrapper is an ordinary fund until it is added.</p></div>
          <div><span class="name">Futures product</span><p>Never treated as Bitcoin-class. A futures-based product is a different instrument with a different risk.</p></div>
          <div><span class="name">Proxy equity</span><p>Companies with Bitcoin exposure are ordinary operating equities. There is no proxy archetype, and they are exempt from nothing.</p></div>
        </div>
      </div>

      <div class="measure prose">
        <p>Market capitalization resolves down a chain: network data, then a quoted figure, and only when both are missing, the last known <strong>price &times; 21,000,000</strong>. That last rung uses the protocol cap, not the roughly 20.1 million coins in circulation (as of September 2026), so it reads about 4.5 percent high. A stale fundamental is never substituted for a missing one: the chain prefers null to wrong.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Headroom &middot; the monetary model</p>
        <h3 class="sub-title">What the scoring engine actually uses.</h3>
      </div>
      <div class="measure prose">
        <p>Bitcoin runs through the same logarithmic <a class="part-ref" href="#cis-math">headroom curve</a> as every equity; only the addressable market differs. Absent a research profile, the baseline is a <em>conservative</em> monetary total of roughly 11.5 trillion dollars, well below the estimate the doctrine works with in <a class="part-ref" href="/part-3-bitcoin-convexity-backbone#tam">Part 3</a>:</p>
        <p><strong>headroom = 35 &times; ln(1 + H) / ln(31)</strong>, where <strong>H = min(TAM &divide; market cap, 30)</strong></p>
        <p>On September 29, 2026 Bitcoin&rsquo;s market capitalization was about $1.68 trillion, a headroom ratio of about 6.8&times;, which scores roughly 21.0 out of 35: a strong reading, not a maximal one. At $3 trillion the ratio falls to about 3.8&times; and the score to roughly 16.1, because a rising price uses up the headroom it is measured against. The small pool is chosen on purpose: the default score should not depend on the most optimistic version of the thesis being right. When a research profile supplies its own addressable market, headroom uses that figure, and convexity stops paying the 2-point baseline penalty in the CIS cascade.</p>
        <p>Network convexity decays as adoption progresses:</p>
        <p><strong>network convexity = 18 &times; max(0, 1 &minus; penetration<sup>0.6</sup>)</strong>, where <strong>penetration = market cap &divide; $11.5 trillion</strong></p>
        <p>Penetration always divides by the $11.5 trillion pool, even when a research profile supplies the headroom figure. At $1.68 trillion network convexity is about 12.3 of 18. A fixed monetary-convexity score (5 to 7 points, and 7 for Bitcoin) completes the 25-point optionality sub-score.</p>
        <p>Separately, the dashboard displays a scenario that builds an addressable market from three pools (40 percent of above-ground gold, 5 percent of global real estate, and 5 percent of emerging-market broad money, taken as 40 percent of the world&rsquo;s) and divides by the 21 million cap to imply a price. <strong>That panel is a display scenario, not the scoring input.</strong> It is labeled as one, and its only live input is the gold price.</p>
        <p>The power-law overlay on the price chart is modeling, not scoring: a trend of <strong>2.88 &times; (days &divide; 1000)<sup>5.82</sup></strong> and a floor of <strong>1.2828 &times; (days &divide; 1000)<sup>5.928</sup></strong>, where days count from the genesis block on January 3, 2009. On September 29, 2026 (day 6,478) the trend read about $152,000 and the floor about $82,900, so Bitcoin, at about $83,600, sat just above the floor and about 45 percent below trend. Despite its name, the floor line does not hold price up: closing prices have fallen below it several times, most recently for most of February to mid-September 2026. The dashboard draws only these two lines, with no euphoria band. The accumulation pace in <a class="part-ref" href="/part-3-bitcoin-convexity-backbone#valuation">Part 3</a>, set by its valuation models, is written guidance you apply; no code triggers on either line, and nothing in the software paces purchases.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Accumulation &middot; simulated and real</p>
        <h3 class="sub-title">A plan is not a purchase.</h3>
      </div>
      <div class="measure prose">
        <p>The projection model is held back (<a class="part-ref" href="#scope">Scope</a>), but one rule of its contribution accounting is published, because it keeps added money from posing as performance. Scheduled contributions are simulated as a daily flow, with no weekly or monthly step at all:</p>
        <p><strong>daily contribution = monthly amount &times; 12 &divide; 365</strong></p>
        <p>Contributions land <em>after</em> each day&rsquo;s return and consume no randomness, so the same simulation run with and without contributions draws identical market paths. That keeps the two headline numbers separate:</p>
        <p><strong>contribution effect = wealth growth &minus; market gain</strong></p>
        <p>Expected compound return and probability of loss are computed on the <em>market-only</em> path. Money you added is not performance, and it is never allowed to flatter a return figure: a simulation with zero market return and steady contributions shows wealth rising and market gain at exactly zero.</p>
      </div>

      <aside class="callout callout-insight">
        <p class="callout-label">A projection never becomes a holding</p>
        <p>Setting a contribution for a projection writes a projection setting and nothing else. Setting up a real purchase schedule writes the schedule, and each due purchase waits for you: no contribution event, no trade and no change to cost basis or net asset value until you confirm it. A confirmed purchase writes exactly one contribution event and one buy, with any recorded fee as the buy&rsquo;s commission. The price is optional: leave it blank and the ledger computes it as the amount paid, net of any recorded fee, divided by the Bitcoin received; type a price that differs from that figure by more than 1 percent and the confirmation comes back for correction. That is a check on the record, not on your purchase. Simulated accumulation is never shown as Bitcoin you own.</p>
      </aside>

      <div class="measure prose">
        <p>Allocation is measured against the portfolio&rsquo;s total balance, <strong>Bitcoin value &divide; total portfolio balance &times; 100</strong>, counting native holdings only by default. The mode that also counts spot wrappers needs the wrapper list to resolve, and falls back to native-only when it cannot. Bitcoin is excluded from every concentration measure. At setup the dashboard proposes a 15 percent Bitcoin baseline (10 percent under the Conflict Economy and Re-industrialization theses), which you confirm or replace with your own conviction. Its construction score carries a 10 percent Bitcoin posture reference within a 5 to 15 percent band as reference metadata; it costs no points and never triggers a sale. The reserve ranges themselves are doctrine, set out in <a class="part-ref" href="/part-3-bitcoin-convexity-backbone#tam">Part 3</a>.</p>
        <p>Wherever Bitcoin and everything else are held, the ledger has to say what each holding cost and what each sale realized. That is the next chapter.</p>
      </div>
    </section>

    <section class="section" id="tax-math" aria-labelledby="tax-math-title">
      <div class="measure">
        <p class="section-eyebrow section-signal" data-glyph-text>Wrappers &amp; Basis</p>
        <h2 class="section-title" id="tax-math-title">What the system computes about tax, and what it does not.</h2>
      </div>
      <div class="measure prose">
        <p>Wrappers decide what you keep, so it pays to be exact about what the dashboard computes here and what it leaves to you and your tax preparer. Most of what it computes is ledger accounting, and this chapter spends as much time on what it leaves out.</p>
      </div>

      <aside class="callout callout-info">
        <p class="callout-label">The engine holds no tax rate</p>
        <p>No ordinary rate, short- or long-term capital-gains rate, qualified-dividend rate, net investment income tax, state or bracket table, or user-entered rate feeds any score, ledger entry or report, and nothing estimates your tax liability. One display surface does use fixed rates: the Tax page illustrates after-tax outcomes at 23.8 percent on gains and qualified dividends and 24 percent on ordinary income, and an after-tax STRC yield at 23.8 percent. Read those as worked illustrations, not a calculation about your account.</p>
      </aside>

      <div class="measure prose">
        <p>What <em>is</em> computed is accounting: cost basis, realized gain, holding period and the effect of a return of capital. Those are facts about your ledger, not statements about your tax return.</p>
        <p><strong>Wrappers</strong> are Roth, Taxable, Pre-tax, Bitcoin and Unknown. The dashboard marks an account it does not recognize as Unknown rather than guessing Taxable, because guessing the wrapper is guessing the tax character of everything in it. Not every part of the dashboard meets that bar yet: a few older ones still assume Taxable when the wrapper is missing (the positions table, for example), and a trade record has no Unknown option.</p>
        <p><strong>Cost basis is total dollars</strong> at the position level, and per-share only inside a lot, where it is recomputed at disposal from what remains instead of being stored at purchase. Since September 25, 2026 a recorded purchase commission is added to the lot&rsquo;s cost, and a recorded sale commission reduces proceeds and realized gain. A trade with no commission recorded counts as unknown, not as zero: the dashboard withholds the cost basis and unrealized gain of the holding it opened (for a sale, the proceeds and realized gain) and asks you to enter the commission, 0 if there was none. That follows the IRS rule that the basis of stock you buy generally includes costs of purchase such as commissions (Publication 551).</p>
        <p><strong>Lot method</strong> is set per account, and specific identification picks lots sale by sale. First-in-first-out takes the oldest lot first, last-in-first-out the newest, highest-in-first-out the highest per-share basis (ties go to the older lot), and average cost relieves every open lot in proportion. An account can also mirror Schwab&rsquo;s Tax Lot Optimizer. With no method set, the ledger uses average cost, and a method it does not implement is refused rather than booked as average cost. The IRS allows average basis for mutual fund shares and treats unidentified shares of stock as the ones you bought first (Publication 551), so check the method against your broker&rsquo;s before comparing realized gains with a Form 1099-B.</p>
        <p><strong>Holding period</strong> follows the calendar: a lot is short-term through the one-year anniversary of its acquisition and long-term from the day after, which is the IRS test of more than one year (Publication 550). A lot bought on January 31, 2025 turns long-term on February 1, 2026. Where an acquisition date cannot be established, the term is reported as unknown rather than assumed. One summary card on the Data page still counts elapsed days, so it can differ by a day across February 29. The trade record labels the term advisory; read it as a reading of your ledger, not tax advice.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Return of capital</p>
        <h3 class="sub-title">A distribution that reduces what you paid.</h3>
      </div>
      <div class="measure prose">
        <p>A distribution is split by its return-of-capital fraction <em>p</em>. If <em>p</em> is 1 the entire gross amount is return of capital, with no companion dividend. Otherwise:</p>
        <p><strong>return of capital = gross &times; p, rounded to the cent</strong> and <strong>taxable portion = gross &minus; return of capital</strong></p>
        <p>The two sum to the gross by construction. The return-of-capital portion then reduces basis <em>per share</em> across open lots, floored at zero so a lot never goes negative; any amount beyond zero basis is recorded as a gain on that lot, which is how the IRS treats it (Publication 550). Reinvestment runs after the reduction, never before.</p>
        <p>The accounting stays deliberately flat: a return of capital <em>reduces cost basis and is not taxed when received</em>. Whether a distribution counts as return of capital is set each tax year and reported on Form 1099-DIV; the ledger records the fraction it is given, and the arithmetic stops there. The strategy around it is in <a class="part-ref" href="/part-4-tax-architecture-roc-strategy#taxable">Part 4</a>.</p>
      </div>

      <div class="measure prose">
        <p>Three more absences are worth naming, because people often assume them. <strong>There is no wash-sale engine</strong>: no substantially-identical matching, no replacement detection, no disallowed-loss carryover. (Where a broker supplies a lot&rsquo;s realized gain, the ledger uses it as given, and that figure can include the broker&rsquo;s own wash-sale adjustment.) <strong>There is no Roth conversion, rollover or required-distribution feature.</strong> And <strong>a transfer between accounts carries no economics</strong>: it moves at a price of zero, keeps basis and the original acquisition date, and never realizes a gain. A move that may have tax consequences is recorded as a plain transfer, and the dashboard does not classify it.</p>
        <p>Every figure in this chapter is only as good as the data under it, which is where the next chapter goes.</p>
      </div>
    </section>

    <section class="section" id="evidence-math" aria-labelledby="evidence-math-title">
      <div class="measure">
        <p class="section-eyebrow section-signal" data-glyph-text>Epistemics</p>
        <h2 class="section-title" id="evidence-math-title">Evidence, confidence, and the limits of both.</h2>
      </div>
      <div class="measure prose">
        <p>Every number on this page rests on inputs of uneven quality. Four different things often travel under the one word &ldquo;confidence&rdquo;; here they are separate quantities, tracked separately.</p>
      </div>

      <div class="measure-feature">
        <div class="failure-modes">
          <div><span class="name">Confidence</span><p>The quality of evidence at the moment of scoring.</p></div>
          <div><span class="name">Freshness</span><p>The age of an input against its own time-to-live.</p></div>
          <div><span class="name">Completeness</span><p>What fraction of the expected fields are present.</p></div>
          <div><span class="name">Source quality</span><p>Where each individual input came from.</p></div>
        </div>
      </div>

      <div class="measure prose">
        <p>A fifth state sits off the ladder entirely. <strong>Unknown is not low.</strong> It is the absence of a rank, and it is carried that way instead of being folded into the bottom tier, because &ldquo;we do not know&rdquo; and &ldquo;we know it is bad&rdquo; are different claims about the same position.</p>
        <p>Confidence reaches the score through two channels. The delta clamp limits how far a score may move in one update: 3 points at low confidence, 5 at medium, 6 when the evidence is proxy-derived, 8 at high. And when the macro component rests mostly on heuristics, its weight is cut to 60 percent (low) or 80 percent (medium) of its value, with the difference split evenly between convexity and risk. Beyond those two channels, confidence does not raise or lower the number. Two caps show how that works. An unclassified over-the-counter venue forces confidence to low, and a market capitalization under 50 million dollars caps it at medium. <strong>Both lower the confidence tier and leave the computed score alone. Through the clamp, the lower tier then limits how far the score can move on its next update.</strong></p>
      </div>

      <div class="compare compare-wrap">
        <table>
          <caption>How long an input stays fresh</caption>
          <thead>
            <tr><th scope="col">Input</th><th scope="col">Window</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row">Quotes</th><td data-label="Window">5 minutes</td></tr>
            <tr><th scope="row">Macro series</th><td data-label="Window">6 hours</td></tr>
            <tr><th scope="row">Earnings</th><td data-label="Window">12 hours</td></tr>
            <tr><th scope="row">Fundamentals</th><td data-label="Window">7 days</td></tr>
            <tr><th scope="row">Research</th><td data-label="Window">72 hours</td></tr>
            <tr><th scope="row">Model estimates</th><td data-label="Window">30 days</td></tr>
            <tr><th scope="row">Addressable market</th><td data-label="Window">90 days</td></tr>
          </tbody>
        </table>
      </div>
      <p class="compare-key">These are freshness boundaries, not confidence values: crossing one marks a record stale and never rewrites a confidence tier</p>

      <div class="measure">
        <p class="sub-meta">Evidence discount</p>
        <h3 class="sub-title">Thin evidence can only subtract.</h3>
      </div>
      <div class="measure prose">
        <p>An evidence-adjusted view of a score discounts each component by how directly its inputs were observed: nothing for direct company-specific evidence, 5 percent for direct category-level evidence, 15 percent for proxy-derived inputs, 35 percent for heuristics and 50 percent for missing data:</p>
        <p><strong>evidence-adjusted score = max(0, CIS &minus; &Sigma; points &times; weight &times; discount rate)</strong></p>
        <p>The adjustment runs one way. <strong>It can only reduce, and no path lets good-looking evidence lift a score above what the components produced.</strong></p>
      </div>

      <div class="measure">
        <p class="sub-meta">Model estimates</p>
        <h3 class="sub-title">A language model is never the top of the ladder.</h3>
      </div>
      <div class="measure prose">
        <p>Where a language model contributes to a classification, its own stated confidence is one factor among four and never the largest: model self-report 0.30, evidence completeness 0.30, persistence across runs 0.20, agreement with the deterministic classification 0.20. The self-report also passes through a compressing curve with a hard ceiling of 0.85, so <strong>a model, on its own testimony alone, can never reach full confidence.</strong> A language-model classification must clear a trust-corrected score of 50 before it may be written at all.</p>
        <p>A model estimate of a data field is held to the same standard. It never counts as observed coverage in the confidence a score reports (it does count as present for the coverage cap under CIS, where its admission weight discounts it). It is bounds-checked per field and rejected if implausible, and it expires after 30 days. It fills a field only after every provider and derived path has come back empty, and that includes market fields such as three-month momentum, 30-day volatility and trading volume. Those fill the display; for the score, the admission weights refuse a model estimate of momentum, volatility, volume or drawdown (over-the-counter market cap and volume excepted), and the score falls back instead.</p>
        <p>Where a research claim becomes a catalyst probability, the mapping is bounded and labeled for what it is: <strong>probability = clamp(confidence &divide; 100, 0.20, 0.85)</strong>. That is a heuristic translation. It has never been fitted to outcomes, and it is not a statistical probability.</p>
      </div>

      <aside class="callout callout-info">
        <p class="callout-label">Two things the framework does not claim</p>
        <p>There is <strong>no portfolio-level confidence number</strong>. Confidence exists per position, and no surface manufactures an aggregate where no formula exists. And nothing here is <strong>calibrated, backtested, validated or proven</strong> in the empirical sense: the scores are a designed instrument with documented reasoning, not a model fitted to realized outcomes. Where the software says &ldquo;calibrated&rdquo;, it means one of two narrower things: simulation parameters fitted to historical series, or the designed discount applied to a language model&rsquo;s own confidence.</p>
      </aside>

      <div class="measure prose">
        <p>The last chapter turns to a score that answers one narrow question: where the next dollar should go.</p>
      </div>
    </section>

    <section class="section" id="nds-math" aria-labelledby="nds-math-title">
      <div class="measure">
        <p class="section-eyebrow section-signal" data-glyph-text>Marginal Capital</p>
        <h2 class="section-title" id="nds-math-title">The next dollar.</h2>
      </div>
      <div class="measure prose">
        <p>The position score asks how good a holding is. The Next Dollar Score asks where, given what you already own, the <em>next</em> dollar would do the most work. It is a ranking instrument, kept separate from CIS by design, and it reads the wrapper-adjusted CIS rather than the canonical score.</p>
        <p>Six components, at these base weights:</p>
      </div>

      <div class="compare compare-wrap">
        <table>
          <caption>Next Dollar Score components</caption>
          <thead>
            <tr><th scope="col">Component</th><th scope="col">Weight</th><th scope="col">What it measures</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row" class="col-primary">Position score</th><td data-label="Weight">0.30</td><td data-label="Measures">The wrapper-adjusted CIS. A missing score enters as a neutral 40, not as zero.</td></tr>
            <tr><th scope="row">Size opportunity</th><td data-label="Weight">0.20</td><td data-label="Measures">How much room is left before the position is already large</td></tr>
            <tr><th scope="row">Expression purity</th><td data-label="Weight">0.15</td><td data-label="Measures">Whether the holding expresses the thesis cleanly or by proxy</td></tr>
            <tr><th scope="row">Posture alignment</th><td data-label="Weight">0.15</td><td data-label="Measures">Distance from the posture budget; underweight scores higher</td></tr>
            <tr><th scope="row">Momentum context</th><td data-label="Weight">0.10</td><td data-label="Measures">The three-month price change, read against whether the thesis still holds</td></tr>
            <tr><th scope="row">P&amp;L context</th><td data-label="Weight">0.10</td><td data-label="Measures">The unrealized gain or loss, read the same way</td></tr>
          </tbody>
        </table>
      </div>

      <div class="measure prose">
        <p>The market environment then scales expression purity and posture alignment, cuts momentum to 60 percent of its weight in a defensive environment, and renormalizes the weights to sum to one. Recompute a score from the base weights alone and you will not match the dashboard.</p>
        <p>Size opportunity decays exponentially with what you already hold:</p>
        <p><strong>size opportunity = clamp(round(90 &times; e<sup>&minus;0.18 &times; allocation%</sup>), 0, 100)</strong></p>
        <p>An untouched name scores 90. At 5 percent it is 37. At 10 percent it is 15, at the 15 percent default cap 6, and it rounds to zero from about 29 percent. The curve is the arithmetic form of a plain idea: the marginal dollar is worth less to a position that already has plenty.</p>
        <p>Two components condition on whether the thesis survives, which the engine reads as a CIS of 55 or more. A three-month pullback of 5 to 20 percent in an intact position raises the momentum reading (65 up to 95); the same pullback with a broken score drops it to 35; a fall of 20 percent or more scores 30 either way. An unrealized loss deeper than 30 percent scores 60 when the thesis is intact and 20 when it is broken. Each of these components carries a base weight of 0.10, so the swing is a few points of the final score. Large unrealized gains only lower the reading; they never make a position more attractive to add to.</p>
        <p>Seven bounded modifiers then adjust the composite: opportunity cost against the best available peer, a Ballast throttle in risk-on and selective environments, a Ballast boost that replaces it in a defensive one, an expression-purity penalty, a score-trend adjustment bounded to &plusmn;8, a readiness penalty capped at 12, and a volatility adjustment between &minus;10 and +6 that reads each name&rsquo;s trading range against its own baseline and the room left to its invalidation level. A positive trend bonus requires a score of at least 40, so a weak or missing score can never be lifted by its own trend line.</p>
      </div>

      <div class="measure">
        <p class="sub-meta">Gates &middot; what they actually do</p>
        <h3 class="sub-title">Advisory, and precisely bounded.</h3>
      </div>
      <div class="measure prose">
        <p>Above 15 percent of the portfolio, the dashboard stops recommending additions. Between 10 and 15 percent it raises a caution and <em>keeps</em> recommending: <strong>the 10 percent line is advisory, not a freeze.</strong> A score below 40 rules a position out of an add recommendation, and so does a score the engine has marked unreliable. A missing score does not: the position still receives a next-dollar reading, computed with a neutral stand-in of 40, and carries a &ldquo;cannot fully evaluate&rdquo; marker. The gate sits below the framework&rsquo;s allocation floor of 50, so a position scoring 40 to 49 can still show an add reading while the sizing ladder gives it no band. Cash is never recommended for additions, and neither is Bitcoin, which is managed at the wrapper level rather than position by position.</p>
        <p>None of this stops a trade in either direction; the dashboard records every trade and never blocks one. On the trim side the score raises cautions only (a position above 15 percent, or a score below 40), and no state rules out a trim.</p>
        <p>A position ruled out of additions still receives a full score and keeps its place in the ranking.</p>
        <p>Bands are 75 and above for strong, 55 for moderate, 35 for weak and below that avoid, each lower bound inclusive. They order advisory copy and size nothing, and they cut at different points from the CIS bands.</p>
        <p>Rotation pairs a bottom-quartile candidate with a top-quartile one, requires a score gap of at least 15, emits at most five pairs, and needs at least four scored positions after cash and Bitcoin are set aside.</p>
      </div>

      <aside class="callout callout-insight">
        <p class="callout-label">The Next Dollar Score sizes nothing</p>
        <p>The portfolio builder never reads it. Position sizing, concentration limits and wrapper placement come from the position score and the construction rules, which remain authoritative. A rotation pair carries two scores, a gap and a sentence: no weight, no order, no execution. <strong>Advisory only, and not a trade signal.</strong></p>
      </aside>
    </section>

    <section class="section" id="scope" aria-labelledby="scope-title">
      <div class="measure">
        <p class="section-eyebrow section-signal" data-glyph-text>Scope</p>
        <h2 class="section-title" id="scope-title">What this page does not yet cover.</h2>
      </div>
      <div class="measure prose">
        <p>Published here: the position score, the construction score, score to size, governance, the Bitcoin backbone, wrappers and basis, evidence and confidence, and the next dollar.</p>
        <p>Held back on purpose: the projection models and their parameter estimation, earnings and forward valuation, performance accounting and net asset value, and margin mechanics. Two small pieces of projection are published because they bound what a projection may claim: the FIS scaling in the construction chapter and the contribution-accounting rule in the Bitcoin chapter. The rest are modeling and accounting surfaces where a published formula reads too easily as a forecast or a claim about results, and they will appear here only by a specific decision to publish them.</p>
        <p>Within the eight chapters the same rule applies at a finer grain: the page publishes formulas and thresholds, not source-code locations or the logs that verified them.</p>
      </div>
    </section>

    <footer class="site-footer">
      <div class="measure">
        <p>&copy; 2026 Adaptive Convexity Framework</p>
        <p>Reference &middot; The Framework in Math</p>
      </div>
    </footer>
  </main>`;

let html = fs.readFileSync(DONOR, 'utf8');
html = html.replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="https://docs.acfdashboard.com/framework-in-math">');
html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>The Framework in Math &middot; The Adaptive Convexity Framework</title>');
html = html.replace(
  /<meta name="description" content="[^"]*">/,
  '<meta name="description" content="The formulas behind CIS and FIS, how a score becomes a position size, and what governance does and does not do.">'
);
html = html.replace(/<a class="skip-link" href="#[^"]*">/, '<a class="skip-link" href="#reading">');

// Sidebar: drop the donor's active state and per-page contents, mark In Math current.
html = html.replace(/\s*<ol class="on-this-page"[\s\S]*?<\/ol>/g, '');
html = html.replace(
  /\s*<p class="side-movement">Reference<\/p>\s*<ul class="side-parts">[\s\S]*?<\/ul>/,
  ''
);
html = html.replace(/ class="side-part current"/g, ' class="side-part"');
html = html.replace(/\s*aria-current="page"/g, '');

const sidebarInsert = `
        <p class="side-movement">Reference</p>
        <ul class="side-parts">
          <li><a class="side-part" href="/framework-in-pictures"><span class="spnum">&middot;</span><span>In Pictures</span></a></li>
          <li>
            <a class="side-part current" href="/framework-in-math" aria-current="page">
              <span class="spnum">&middot;</span><span>In Math</span>
            </a>
          </li>
          <li><a class="side-part" href="/glossary"><span class="spnum">&middot;</span><span>Glossary</span></a></li>
          <li><a class="side-part" href="/evidence"><span class="spnum">&middot;</span><span>Evidence</span></a></li>
        </ul>
      </div>`;
const navEnd = html.indexOf('</nav>', html.indexOf('<nav class="sidebar"'));
const blockEnd = html.lastIndexOf('      </div>', navEnd);
html = html.slice(0, blockEnd) + sidebarInsert + html.slice(blockEnd + '      </div>'.length);

html = html.replace(/<main class="shell-main">[\s\S]*<\/main>/, main);
// A reference page is not in the six-part series: drop the donor's next-up band
// and the dock's "← Part 5 · Series complete" chain. Shared, and fails closed.
html = stripSeriesChain(html, 'Math build');
// The donor's og/twitter block and share links say Part 6; stamp this page's own.
html = stampSocialMeta(html, 'framework-in-math');

fs.writeFileSync(OUT, html);
const sections = (main.match(/<section class="section"/g) || []).length;
console.log(`Math page built: ${sections} sections -> public/site-b/framework-in-math.html`);
