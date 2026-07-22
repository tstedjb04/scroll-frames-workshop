# Scroll Frames Lab

A workshop starter for building an Apple-style, scroll-driven product
animation with an image sequence, a sticky canvas, and scroll progress.

## Prerequisites

- Node.js LTS
- pnpm

## Setup

```bash
pnpm i
pnpm dev
pnpm test
```

Open the local URL printed by `pnpm dev`. On the starter branch the canvas
stays on frame 0 until you implement `progressToFrameIndex` in
`src/lib/scrollFrames.ts` (see the TODO). After that, scrolling through the
canvas section scrubs the frame sequence.

## Workshop workflow

1. Create your own branch before changing code:

   ```bash
   git checkout -b workshop/<name>
   ```

2. Commit and push only to your `workshop/<name>` branch.
3. Do not push directly to `main`; open a pull request if requested by the
   facilitator.

For the learner checklist, see [WORKSHOP.md](./WORKSHOP.md). For the
facilitator's Gamma-ready presentation outline, see
[docs/slides-outline.md](./docs/slides-outline.md).

## Important notes

- Do not scrub a `<video>` by changing `currentTime`. It is unreliable and
  often feels janky. This lab uses a preloaded image sequence drawn to canvas
  instead.
- The `solution` branch contains the completed reference implementation. Use
  it after class, or as a facilitator—please do not peek before completing the
  exercise.
