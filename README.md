# ACF-Docs
Adaptive Convexity Framework: A structured macro portfolio system integrating thesis definition, convexity scoring (CIS), tripwire risk controls, and regime-based allocation logic.

> **Agents / contributors, start here:** the canonical framework-docs location, the
> treatment of the parallel app-domain HTML copy, and the machine-readable chart
> inventory entry point are declared in [`FRAMEWORK_DOCS_CANONICAL.md`](./FRAMEWORK_DOCS_CANONICAL.md).
> The living framework narrative is the hand-authored Site B HTML under
> `public/site-b/` (docs.acfdashboard.com); the legacy MDX part pages were retired 2026-07-13.

## Working locally

```bash
npm install
npm run dev     # local site at http://localhost:3000
npm test        # narration and chart-core test suites
npm run build   # runs every prebuild sync step, then next build
```

Single suites have their own scripts (for example `npm run test:worked-examples`); `package.json` lists them all.

## Review

Pull requests get a second-vendor review from the shared PM (OpenAI Codex) when a Claude session posts a `HANDOFF:` comment naming the PR's head. When that is required and how a ruling gates the merge are set out in [`CLAUDE.md`](./CLAUDE.md).
