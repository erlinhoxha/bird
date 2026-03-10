# Reconstruction Notes

This repository was reconstructed from a packaged Bird snapshot rather than the original upstream source checkout.

What was recovered:
- A real `src/` tree generated from the current `dist/` JavaScript modules.
- The current working runtime behavior, including the anti-bot parity fixes and vendored cookie readers.
- Minimal TypeScript build plumbing: `tsconfig.json`, `tsconfig.oxlint.json`, `scripts/copy-dist-assets.js`, and `scripts/update-query-ids.ts`.
- Generated source files are marked with `// @ts-nocheck` so the reconstructed runtime code can compile cleanly before it is gradually retyped.

What was not recoverable from the snapshot:
- The original authored TypeScript formatting and comments.
- The original test suite and any omitted source-only files.
- Git history and original remote metadata.

Practical implication:
- This repo is a maintainable starting point for continued work.
- It is not guaranteed to match the exact original source repository byte-for-byte.
