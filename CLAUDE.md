# CLAUDE.md

Project instructions for Claude Code sessions in this repository. See `README.md` for what the repository is.

## Second-vendor review (the PM)

This repository runs the shared PM caller (`.github/workflows/pm-review.yml`, from SVRN-AGNT/Dale-OS `ci/README.md#the-pm-caller`) with `provider: chatgpt`: the PM rules from Codex's own GitHub review, which runs on the owner's ChatGPT plan with no API key. Codex is OpenAI, a different vendor from Claude, and it reviews a PR only when a Claude session asks for it.

- On every high-stakes PR (money, sync, schema, access) and every PR that touches held paths (`.github/workflows/` at least), post a PR comment of exactly two lines. The first starts with `HANDOFF:` at byte zero and names the PR's current head as the full 40-character sha; the second asks Codex:

  ```text
  HANDOFF: <full 40-character head sha>
  @codex review
  ```

- Post it with the GitHub tools, so it comes through the `claude` app. Write `@codex` nowhere else (PR bodies, other comments): any mention starts a Codex review and spends the plan's limited review quota.
- The PM replies `PM REVIEW — CLEAR | CORRECT | HOLD` and sets a `PM Review` check on that head. Any Codex finding, of any priority, or any failed check on the head is CORRECT; a PR that edits an `AGENTS.md` is HOLD. A push revokes the ruling, so post a new HANDOFF for the new head.
- Such a PR merges only after a CLEAR on its current head, or after 2 hours with no ruling. The timeout counts only after a dispatch re-run of the PM for that HANDOFF (`workflow_dispatch` from the default branch with its `comment_id` and `pr`) still gives no ruling. CORRECT or HOLD blocks it until resolved. The PM never approves or merges anything.
