# Solution Branch Core Mapping — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the `solution` branch from current `main` and implement `progressToFrameIndex` so scroll progress maps to the correct frame index and `pnpm test` passes.

**Architecture:** Pure helper in `src/lib/scrollFrames.ts`. Clamp progress to `[0, 1]`, guard `frameCount < 1`, then `Math.round(clamped * (frameCount - 1))`. Existing Jest tests in `src/lib/scrollFrames.test.ts` already define the contract; no new tests or UI changes.

**Tech Stack:** TypeScript, Jest (`pnpm test`), git branches (`main` = starter stub, `solution` = answer)

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-24-solution-branch-design.md`
- Scope: core mapping only — no stretch goals, overlay, or canvas changes
- Package manager: `pnpm` only
- Do not change `getScrollProgress`
- Do not leave the TODO stub on `solution`; keep the stub on `main`
- Do not force-push `origin/solution` unless the user explicitly asks
- YAGNI: one file change besides branch creation

## File Structure

| Path | Responsibility |
| ---- | -------------- |
| `src/lib/scrollFrames.ts` | Implement `progressToFrameIndex` on `solution` |
| `src/lib/scrollFrames.test.ts` | Existing contract — do not modify |
| (git) `solution` branch | Answer key reset from current `main` |

---

### Task 1: Recreate `solution` from `main` and implement mapping

**Files:**
- Modify: `src/lib/scrollFrames.ts` (`progressToFrameIndex` only)
- Test: `src/lib/scrollFrames.test.ts` (read-only; already present)
- Branch: recreate local `solution` from current `main`

**Interfaces:**
- Consumes: existing signature
  ```ts
  export function progressToFrameIndex(progress: number, frameCount: number): number
  ```
- Produces: same signature; returns index in `[0, frameCount - 1]`, or `0` when `frameCount < 1`

- [ ] **Step 1: Ensure clean `main` and recreate local `solution`**

```bash
cd /Users/dhanaithorn/Documents/Projects/workshop/scroll-frames-lab
git checkout main
git status
git checkout -B solution
```

Expected: on branch `solution`, working tree clean, tip matches current `main` (includes the design-spec commit). `-B` overwrites the local `solution` pointer without deleting remote history until a push is requested.

- [ ] **Step 2: Confirm existing tests fail on the stub**

Run:

```bash
pnpm test -- src/lib/scrollFrames.test.ts
```

Expected: FAIL — `progressToFrameIndex` cases fail (e.g. maps `1` → last frame expects `39` but stub returns `0`). `getScrollProgress` cases should still pass.

- [ ] **Step 3: Implement `progressToFrameIndex`**

Replace the TODO body in `src/lib/scrollFrames.ts` with:

```ts
export function progressToFrameIndex(
  progress: number,
  frameCount: number,
): number {
  if (frameCount < 1) return 0
  const clamped = Math.min(1, Math.max(0, progress))
  return Math.round(clamped * (frameCount - 1))
}
```

Leave `getScrollProgress` unchanged. Remove the `void progress` / `void frameCount` stub lines and the workshop TODO comment.

- [ ] **Step 4: Confirm all tests pass**

Run:

```bash
pnpm test -- src/lib/scrollFrames.test.ts
```

Expected: PASS — all `getScrollProgress` and `progressToFrameIndex` tests green, including:

| Call | Result |
| ---- | ------ |
| `progressToFrameIndex(0, 40)` | `0` |
| `progressToFrameIndex(1, 40)` | `39` |
| `progressToFrameIndex(0.5, 40)` | `20` |
| `progressToFrameIndex(-1, 40)` | `0` |
| `progressToFrameIndex(2, 40)` | `39` |
| `progressToFrameIndex(0.5, 0)` | `0` |

- [ ] **Step 5: Commit on `solution`**

```bash
git add src/lib/scrollFrames.ts
git commit -m "$(cat <<'EOF'
fix: restore frame index mapping on solution

EOF
)"
git status
```

Expected: clean working tree on `solution`, one commit ahead of `main` changing only `src/lib/scrollFrames.ts`. Do **not** push unless the user asks.

- [ ] **Step 6: Verify `main` still has the stub**

```bash
git checkout main
grep -n 'TODO(workshop)' src/lib/scrollFrames.ts
```

Expected: TODO comment still present on `main`. Then optionally return to solution:

```bash
git checkout solution
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
| ---------------- | ---- |
| Recreate `solution` from current `main` | Task 1 Step 1 |
| Implement clamp + round mapping | Task 1 Step 3 |
| Guard `frameCount < 1` | Task 1 Step 3 |
| Leave stretch goals / UI alone | Task 1 (single-file scope) |
| `pnpm test` passes | Task 1 Steps 2 & 4 |
| Keep stub on `main` | Task 1 Step 6 |
| No force-push unless asked | Task 1 Step 5 note |
