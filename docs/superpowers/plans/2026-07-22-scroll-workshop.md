# Scroll Frames Workshop Starter — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js workshop starter where learners fix a TODO to map scroll progress to canvas frame scrubbing, plus docs/slides outline and a `solution` branch.

**Architecture:** Pure helpers in `src/lib/scrollFrames.ts` compute progress and frame index. A client `ScrollCanvas` preloads WEBP frames, sticks a full-viewport canvas, and draws the mapped frame on scroll via `requestAnimationFrame`. On `main`, the frame-index helper is intentionally stubbed; `solution` has the correct math.

**Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS v4, pnpm, Jest (unit tests for pure helpers only)

## Global Constraints

- Repo root: `/Users/dhanaithorn/Documents/Projects/workshop/scroll-frames-lab` (not SCA)
- Package manager: `pnpm` only
- No Framer Motion / GSAP for the core exercise
- Do not scrub `<video>` with `currentTime`
- Sample frames: `public/frames/frame_%04d.webp`, zero-padded
- Learner branch convention: `workshop/<english-name>`
- `main` = broken starter; `solution` = completed mapping
- Workshop language in docs: Thai + English technical terms
- YAGNI: no i18n, no auth, no design-system port from SCA

## File Structure

| Path | Responsibility |
| ---- | -------------- |
| `package.json`, `pnpm-lock.yaml`, Next/Tailwind/TS configs | App toolchain |
| `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` | Shell page + tokens |
| `src/lib/frames.ts` | Frame count, path helper, naming convention |
| `src/lib/scrollFrames.ts` | `getScrollProgress`, `progressToFrameIndex` (TODO on main) |
| `src/lib/scrollFrames.test.ts` | Unit tests for helpers |
| `src/components/ScrollCanvas/ScrollCanvas.tsx` | Preload, sticky, canvas draw loop |
| `src/components/ScrollCanvas/ScrollCanvas.style.ts` | Tailwind class strings via `clsx` |
| `scripts/generate-sample-frames.mjs` | Generate numbered sample WEBP/PNG frames |
| `public/frames/*` | Bundled sample sequence |
| `README.md`, `WORKSHOP.md` | Setup + learner steps |
| `docs/slides-outline.md` | Gamma paste outline |
| `docs/superpowers/specs/2026-07-22-scroll-workshop-design.md` | Already exists |

---

### Task 1: Scaffold Next.js + Tailwind app

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `.gitignore`
- Create: Jest config (`jest.config.ts` or `jest.config.mjs`) + `jest.setup.ts` if needed

**Interfaces:**
- Consumes: none
- Produces: runnable `pnpm dev` / `pnpm test` scripts

- [ ] **Step 1: Scaffold with create-next-app**

Run from parent folder (or inside empty repo carefully so existing `docs/` is kept):

```bash
cd /Users/dhanaithorn/Documents/Projects/workshop
# If scroll-frames-lab already has docs/, scaffold into a temp dir then merge, OR:
cd scroll-frames-lab
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --use-pnpm
```

If create-next-app refuses non-empty dir: scaffold in `/tmp/scroll-frames-lab-scaffold`, copy app files into the repo without deleting `docs/` or `.git`.

Expected: Next app files present; `docs/superpowers/` still intact.

- [ ] **Step 2: Ensure scripts in package.json**

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "jest",
    "frames:generate": "node scripts/generate-sample-frames.mjs"
  }
}
```

Add Jest + `ts-jest` (or `@swc/jest`) as devDependencies. Prefer existing create-next-app defaults where possible.

- [ ] **Step 3: Smoke-run install and typecheck**

```bash
cd /Users/dhanaithorn/Documents/Projects/workshop/scroll-frames-lab
pnpm install
pnpm exec tsc --noEmit
```

Expected: exit 0

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Tailwind and Jest"
```

---

### Task 2: Frame config + sample frame generator

**Files:**
- Create: `src/lib/frames.ts`
- Create: `scripts/generate-sample-frames.mjs`
- Create: `public/frames/.gitkeep` then generated `frame_0001.webp` … (or PNG if WEBP encode unavailable)

**Interfaces:**
- Consumes: none
- Produces:
  - `FRAME_COUNT: number` (use `40` for samples)
  - `frameSrc(index: number): string` → `/frames/frame_0001.webp` style (1-based files, 0-based index)

- [ ] **Step 1: Add `src/lib/frames.ts`**

```ts
export const FRAME_COUNT = 40

/** 0-based index → public URL for zero-padded WEBP */
export function frameSrc(index: number): string {
  const n = String(index + 1).padStart(4, '0')
  return `/frames/frame_${n}.webp`
}
```

- [ ] **Step 2: Write `scripts/generate-sample-frames.mjs`**

Generate 40 frames (1920×1080 or 1280×720) with a solid dark background `#0F172A`, a centered rounded rectangle whose hue shifts by frame, and large white text `FRAME XX / 40`. Prefer `sharp` if added as a devDependency; otherwise use PNG via `canvas` package or a minimal pure approach:

If adding `sharp`:

```js
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../public/frames')
const FRAME_COUNT = 40
const W = 1280
const H = 720

fs.mkdirSync(outDir, { recursive: true })

for (let i = 1; i <= FRAME_COUNT; i++) {
  const t = (i - 1) / (FRAME_COUNT - 1)
  const hue = Math.round(200 + t * 80)
  const svg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0F172A"/>
      <rect x="340" y="160" width="600" height="400" rx="24"
        fill="hsl(${hue} 70% 45%)"/>
      <text x="50%" y="52%" text-anchor="middle" fill="white"
        font-family="system-ui,sans-serif" font-size="64" font-weight="600">
        FRAME ${String(i).padStart(2, '0')} / ${FRAME_COUNT}
      </text>
    </svg>`
  const file = path.join(outDir, `frame_${String(i).padStart(4, '0')}.webp`)
  await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(file)
  console.log('wrote', file)
}
```

- [ ] **Step 3: Generate frames**

```bash
pnpm add -D sharp
pnpm frames:generate
ls public/frames | wc -l
```

Expected: 40 frame files (plus ignore `.gitkeep` if present)

- [ ] **Step 4: Commit**

```bash
git add src/lib/frames.ts scripts/generate-sample-frames.mjs public/frames package.json pnpm-lock.yaml
git commit -m "feat: add frame helpers and generate sample WEBP sequence"
```

---

### Task 3: Pure scroll helpers with TDD (correct implementation first)

**Files:**
- Create: `src/lib/scrollFrames.ts`
- Create: `src/lib/scrollFrames.test.ts`

**Interfaces:**
- Consumes: none
- Produces:
  - `getScrollProgress(scrollTop: number, sectionTop: number, scrollRange: number): number` — clamped `0..1`
  - `progressToFrameIndex(progress: number, frameCount: number): number` — clamped `0..frameCount-1`

- [ ] **Step 1: Write failing tests**

```ts
import { getScrollProgress, progressToFrameIndex } from './scrollFrames'

describe('getScrollProgress', () => {
  it('returns 0 before the section', () => {
    expect(getScrollProgress(0, 100, 500)).toBe(0)
  })

  it('returns 1 after the full range', () => {
    expect(getScrollProgress(700, 100, 500)).toBe(1)
  })

  it('returns mid progress inside the range', () => {
    expect(getScrollProgress(350, 100, 500)).toBe(0.5)
  })

  it('returns 0 when scrollRange is 0', () => {
    expect(getScrollProgress(100, 100, 0)).toBe(0)
  })
})

describe('progressToFrameIndex', () => {
  it('maps 0 to first frame', () => {
    expect(progressToFrameIndex(0, 40)).toBe(0)
  })

  it('maps 1 to last frame', () => {
    expect(progressToFrameIndex(1, 40)).toBe(39)
  })

  it('maps 0.5 near the middle', () => {
    expect(progressToFrameIndex(0.5, 40)).toBe(20)
  })

  it('clamps out-of-range progress', () => {
    expect(progressToFrameIndex(-1, 40)).toBe(0)
    expect(progressToFrameIndex(2, 40)).toBe(39)
  })

  it('returns 0 when frameCount is less than 1', () => {
    expect(progressToFrameIndex(0.5, 0)).toBe(0)
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
pnpm test -- src/lib/scrollFrames.test.ts
```

Expected: FAIL (module or functions missing)

- [ ] **Step 3: Implement correct helpers**

```ts
export function getScrollProgress(
  scrollTop: number,
  sectionTop: number,
  scrollRange: number,
): number {
  if (scrollRange <= 0) return 0
  const raw = (scrollTop - sectionTop) / scrollRange
  return Math.min(1, Math.max(0, raw))
}

export function progressToFrameIndex(
  progress: number,
  frameCount: number,
): number {
  if (frameCount < 1) return 0
  const clamped = Math.min(1, Math.max(0, progress))
  return Math.round(clamped * (frameCount - 1))
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
pnpm test -- src/lib/scrollFrames.test.ts
```

Expected: all PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/scrollFrames.ts src/lib/scrollFrames.test.ts
git commit -m "feat: add scroll progress and frame index helpers with tests"
```

---

### Task 4: ScrollCanvas component + page shell

**Files:**
- Create: `src/components/ScrollCanvas/ScrollCanvas.tsx`
- Create: `src/components/ScrollCanvas/ScrollCanvas.style.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css` (dark bg `#0F172A`)

**Interfaces:**
- Consumes: `FRAME_COUNT`, `frameSrc` from `frames.ts`; `getScrollProgress`, `progressToFrameIndex` from `scrollFrames.ts`
- Produces: working scrub UI when helpers are correct

- [ ] **Step 1: Add styles**

```ts
// ScrollCanvas.style.ts
import clsx from 'clsx'

export const section = clsx('relative h-[300vh] bg-[#0F172A]')
export const sticky = clsx(
  'sticky top-0 flex h-screen w-full items-center justify-center',
)
export const canvas = clsx('h-full w-full object-cover')
export const loading = clsx(
  'absolute inset-0 flex items-center justify-center text-white/80',
)
export const hint = clsx(
  'pointer-events-none absolute bottom-8 left-0 right-0 text-center text-sm text-white/60',
)
```

Install `clsx` if missing: `pnpm add clsx`

- [ ] **Step 2: Implement `ScrollCanvas.tsx` (client component)**

Key behavior:

1. `'use client'`
2. Preload `FRAME_COUNT` images via `frameSrc(i)` into `HTMLImageElement[]`
3. Track `loaded` count; show loading until complete
4. Outer `section` ref with `h-[300vh]`; inner sticky full viewport + `<canvas>`
5. On scroll / resize: compute `scrollRange = section.offsetHeight - window.innerHeight`, `progress = getScrollProgress(window.scrollY, section.offsetTop, scrollRange)`, `index = progressToFrameIndex(progress, frames.length)`, draw image cover-fit on canvas
6. Use a single `requestAnimationFrame` loop or scroll listener that schedules rAF (do not skip rAF)

Sketch (implement fully in code; keep cover-fit draw):

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

import { FRAME_COUNT, frameSrc } from '@/lib/frames'
import {
  getScrollProgress,
  progressToFrameIndex,
} from '@/lib/scrollFrames'

import * as styles from './ScrollCanvas.style'

export function ScrollCanvas() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const [ready, setReady] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const images: HTMLImageElement[] = []
    let loaded = 0

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameSrc(i)
      img.onload = () => {
        if (cancelled) return
        loaded += 1
        setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100))
        if (loaded === FRAME_COUNT) {
          framesRef.current = images
          setReady(true)
        }
      }
      images[i] = img
    }

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return

    const draw = () => {
      const section = sectionRef.current
      const canvas = canvasRef.current
      if (!section || !canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const scrollRange = section.offsetHeight - window.innerHeight
      const progress = getScrollProgress(
        window.scrollY,
        section.offsetTop,
        scrollRange,
      )
      const index = progressToFrameIndex(progress, framesRef.current.length)
      const img = framesRef.current[index]
      if (!img) return

      // object-fit: cover
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      const dx = (w - dw) / 2
      const dy = (h - dh) / 2
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(img, dx, dy, dw, dh)
    }

    const onScroll = () => {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        draw()
      })
    }

    draw()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [ready])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.sticky}>
        {!ready && (
          <div className={styles.loading}>Loading frames… {loadProgress}%</div>
        )}
        <canvas ref={canvasRef} className={styles.canvas} />
        <p className={styles.hint}>Scroll to scrub frames</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Wire page**

```tsx
import { ScrollCanvas } from '@/components/ScrollCanvas/ScrollCanvas'

export default function HomePage() {
  return (
    <main>
      <header className="px-6 py-16 text-center text-white">
        <h1 className="text-3xl font-semibold">Scroll Frames Lab</h1>
        <p className="mt-3 text-white/70">
          Fix the TODO in <code>src/lib/scrollFrames.ts</code> so scrubbing works.
        </p>
      </header>
      <ScrollCanvas />
      <footer className="px-6 py-24 text-center text-white/50">
        End of sequence — try stretch goals in WORKSHOP.md
      </footer>
    </main>
  )
}
```

Set body background in `globals.css` to `#0F172A`.

- [ ] **Step 4: Manual verify**

```bash
pnpm dev
```

Open `http://localhost:3000` — scroll should scrub through FRAME labels 01→40 smoothly.

- [ ] **Step 5: Commit (this commit becomes the basis of `solution`)**

```bash
git add src/components/ScrollCanvas src/app package.json pnpm-lock.yaml
git commit -m "feat: add ScrollCanvas sticky flipbook scrubbing"
```

---

### Task 5: Break starter on `main`; keep answer on `solution`

**Files:**
- Modify: `src/lib/scrollFrames.ts` (stub `progressToFrameIndex` on main)
- Keep tests expecting correct behavior (learners make tests pass)

**Interfaces:**
- Same function signatures as Task 3

- [ ] **Step 1: Create `solution` branch from current HEAD**

```bash
git branch solution
git branch -m main   # if still on master
```

Ensure current branch is `main` after rename.

- [ ] **Step 2: Stub the learner TODO on `main` only**

Replace body of `progressToFrameIndex` with:

```ts
export function progressToFrameIndex(
  progress: number,
  frameCount: number,
): number {
  // TODO(workshop): map clamped progress (0..1) to a frame index in
  // [0, frameCount - 1]. Hint: Math.round(progress * (frameCount - 1))
  // Remember to clamp progress and handle frameCount < 1.
  void progress
  void frameCount
  return 0
}
```

Leave `getScrollProgress` **implemented** so learners only have one core TODO (mixed-level friendly). Mention stretch: re-implement `getScrollProgress` from scratch if they finish early (optional note in WORKSHOP.md only — do not break it on main).

- [ ] **Step 3: Confirm app stuck on frame 0 while scrolling**

```bash
pnpm dev
```

Expected: canvas shows FRAME 01 always while scrolling.

- [ ] **Step 4: Confirm tests fail on main**

```bash
pnpm test -- src/lib/scrollFrames.test.ts
```

Expected: `progressToFrameIndex` cases FAIL; `getScrollProgress` PASS

- [ ] **Step 5: Commit stub on main**

```bash
git add src/lib/scrollFrames.ts
git commit -m "chore: stub progressToFrameIndex for workshop starter"
```

- [ ] **Step 6: Verify solution branch still green**

```bash
git checkout solution
pnpm test -- src/lib/scrollFrames.test.ts
```

Expected: PASS. Then `git checkout main`.

---

### Task 6: Workshop docs + Gamma outline

**Files:**
- Create: `README.md`
- Create: `WORKSHOP.md`
- Create: `docs/slides-outline.md`

**Interfaces:**
- Consumes: agenda/decisions from design spec
- Produces: facilitator + learner docs

- [ ] **Step 1: Write `README.md`**

Must include:

- What this repo is (workshop starter)
- Prerequisites: Node LTS, pnpm
- Setup commands: `pnpm i`, `pnpm dev`, `pnpm test`
- Branch rule: `workshop/<name>`, no direct push to `main`
- Point to `WORKSHOP.md` and `docs/slides-outline.md`
- Note: do not scrub video with `currentTime`
- Note: `solution` branch is for after class / facilitator

- [ ] **Step 2: Write `WORKSHOP.md`**

Must include Thai steps:

1. Clone / open repo
2. `pnpm i` && `pnpm dev`
3. Create branch `workshop/<name>`
4. Open `src/lib/scrollFrames.ts` and complete TODO
5. Scroll to verify FRAME number changes
6. Optional: run `pnpm test`
7. Stretch goals (overlay, scroll height, show index)
8. Commit + optional PR

Include hint formula: `index = Math.round(progress * (frameCount - 1))`

- [ ] **Step 3: Write `docs/slides-outline.md`**

Copy the 12-slide outline from the design spec (section 7), paste-ready for Gamma.

- [ ] **Step 4: Commit**

```bash
git add README.md WORKSHOP.md docs/slides-outline.md
git commit -m "docs: add README, workshop guide, and Gamma slide outline"
```

---

### Task 7: Final verification checklist

**Files:** none new

- [ ] **Step 1: On `main`**

```bash
git checkout main
pnpm install
pnpm test
pnpm build
pnpm dev
```

Expected: tests fail on `progressToFrameIndex`; build succeeds; UI stuck on first frame.

- [ ] **Step 2: On `solution`**

```bash
git checkout solution
pnpm test
pnpm build
```

Expected: tests pass; build succeeds.

Merge docs commits onto `solution` if docs only landed on `main`:

```bash
git checkout solution
git merge main -m "chore: sync docs onto solution"
# Re-apply correct progressToFrameIndex if merge brought the stub
```

Ensure `solution` ends with **correct** `progressToFrameIndex` and passing tests.

- [ ] **Step 3: Leave `main` checked out as default for learners**

```bash
git checkout main
```

- [ ] **Step 4: Optional remote**

```bash
# When facilitator is ready (requires network + GitHub repo):
# gh repo create ... --source=. --public
# git push -u origin main
# git push -u origin solution
```

Do not force-push. Skip if user has not asked to publish yet.

---

## Spec coverage (self-review)

| Spec requirement | Task |
| ---------------- | ---- |
| Next.js + Tailwind + canvas flipbook | 1, 4 |
| Sample frames in `public/frames/` | 2 |
| Broken TODO on main | 5 |
| `solution` branch | 5, 7 |
| Unit-testable progress → index | 3 |
| README / WORKSHOP / slides outline | 6 |
| Sticky ~300vh + preload + rAF | 4 |
| No video scrub | docs + architecture |
| Git branch convention for learners | 6 |
| Facilitator demo notes (not coded) | slides + WORKSHOP mention only |

## Placeholder scan

No TBD / “implement later” left in tasks; sample generator and stub code are concrete.

## Type consistency

- `frameSrc(index: number): string` — 0-based index
- `getScrollProgress(scrollTop, sectionTop, scrollRange): number`
- `progressToFrameIndex(progress, frameCount): number`
- `FRAME_COUNT = 40` used by generator, frames.ts, and ScrollCanvas
