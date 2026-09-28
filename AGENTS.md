# 108 LOCK — agent notes

Brand-owned notes for **Amienigma/amienigma-flagship-mobile-ui-demo** (product / visual IP: **108 LOCK**).

> **108 Night is teal weather with a magenta pulse, analog grain, and one true object from the day — nothing added to win the picture.**

This GitHub repository name is **legacy** until renamed to match 108 LOCK. Package name: `108-lock`.

Companion product: **Amienigma AI** → [amienigma-llm](https://github.com/Amienigma/amienigma-llm).

Scaffolded from Grok App Builder. Keep platform contracts under `.grok/`, `server/`, `scripts/grok-pwa-*`, and `public/__grok/`. Soften brand voice; do **not** strip those files.

---

## Hard contracts (do not break)

1. Preview on `0.0.0.0:8080` via `npm run dev`; keep `startup.sh` idempotent.
2. Do not delete Grok PWA / server middleware / PreviewHostBridge / nitro `serverDir`.
3. No committed `.env`. Auth/db OFF unless explicitly required.
4. Vercel via Nitro `vercel` preset; `npm run build` + typecheck must pass.

Deeper scaffold docs: `.grok/references/*.md`.

*108 LOCK · The Original Enigma Studios*
