# Solution Branch — Core Frame Mapping

**Date:** 2026-07-24  
**Scope:** Core only (no stretch goals)  
**Branch:** `solution` (reset from current `main`)

---

## Goal

Provide a facilitator/post-class answer key: `progressToFrameIndex` maps scroll progress `0..1` to a frame index in `[0, frameCount - 1]`, matching `WORKSHOP.md` and passing `pnpm test`.

## Out of scope

- Overlay progress / frame index UI
- Scroll section height tweaks
- Headline fade thresholds
- Changes to canvas, preload, or docs for learners

## Approach

Recreate `solution` from current `main` tip, then implement the mapping in one file. Prefer a clean reset over merging the older `solution` history so the answer stays aligned with the starter.

If `origin/solution` already exists, updating the remote later may require force-push — only when explicitly requested.

## Implementation

**File:** `src/lib/scrollFrames.ts` — `progressToFrameIndex` only.

Behavior:

1. If `frameCount < 1`, return `0`.
2. Clamp `progress` to `[0, 1]`.
3. Return `Math.round(clamped * (frameCount - 1))`.

Leave `getScrollProgress` unchanged.

## Verification

Run `pnpm test`. Required cases for `progressToFrameIndex`:

| Input | Expected |
| ----- | -------- |
| `(0, 40)` | `0` |
| `(1, 40)` | `39` |
| `(0.5, 40)` | `20` |
| `(-1, 40)` / `(2, 40)` | `0` / `39` |
| `(0.5, 0)` | `0` |

## Success criteria

- Branch `solution` exists from current `main` plus the mapping commit
- `pnpm test` passes
- Starter TODO stub remains on `main`
