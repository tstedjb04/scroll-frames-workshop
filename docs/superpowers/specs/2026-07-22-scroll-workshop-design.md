# Scroll Frames Lab — Workshop Design

**Date:** 2026-07-22  
**Repo path:** `/Users/dhanaithorn/Documents/Projects/workshop/scroll-frames-lab`  
**Audience:** ~10 people, mixed skill levels  
**Duration:** ~70–80 minutes (flexible; can run longer)  
**Language:** Thai instruction + English technical terms  

---

## 1. Goal

After the workshop, participants can:

1. Explain why scroll-scrubbing a `<video>` with `currentTime` feels janky.
2. Explain the Apple-style approach: image sequence + sticky section + canvas draw.
3. Complete a starter TODO so scroll progress maps to the correct frame and scrubbing works on their machine.

**Out of scope for learners in-session:** generating their own start/end images and AI video. Facilitator demos that pipeline briefly; learners use bundled sample frames.

**Related inspiration (not a deliverable):** Instagram reel–style “$5k scroll animation” pipeline (keyframes → video → frames → Claude/Cursor). Kept as facilitator talking points / Gamma slide material only.

---

## 2. Format choice

**Selected approach: Concept-first + longer coding (Approach 2)**

| Phase | Focus |
| ----- | ----- |
| Setup | Clone, install, branch |
| Concept | Video scrub vs flipbook |
| Live demo | Facilitator: start/end → video → frames (short) |
| Hands-on | Fix TODO until scrub works |
| Stretch / share | Optional polish + 2–3 demos |

Rejected for this run:

- Full guided pipeline for every learner (too heavy for mixed group unless time is expanded deliberately later).
- Studio lab with multiple difficulty tracks as the primary structure (harder to facilitate alone).

---

## 3. Agenda (~70–80 min)

| Time | Block | What happens |
| ---- | ----- | ------------ |
| 0–8 | Setup | Clone repo, `pnpm i`, create `workshop/<name>` branch, `pnpm dev` |
| 8–20 | Concept | Why video scrub fails; sticky + progress + frameIndex + canvas |
| 20–28 | Live demo | Facilitator shows keyframe → video → extract frames; point at `public/frames/` |
| 28–55 | Hands-on | Learners implement TODO(s) until scrub works |
| 55–65 | Stretch | Preload progress UI, scroll height, overlay text (optional) |
| 65–75 | Share | 2–3 volunteer demos, recap, PR if time |

**Success criteria:** Most learners have working scrub locally and can state the progress → frame mapping formula.

---

## 4. Repository design

### Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Canvas + sticky section + `requestAnimationFrame`
- No Framer Motion / GSAP required for the core exercise
- Package manager: `pnpm`

### Layout

```
scroll-frames-lab/
├── README.md                 # Setup, branch rules, links
├── WORKSHOP.md               # Learner step-by-step
├── docs/
│   ├── slides-outline.md     # Gamma context (Thai + EN terms)
│   └── superpowers/specs/    # This design doc
├── public/frames/            # Sample WEBP frames (bundled)
├── src/
│   ├── app/                  # Page shell
│   ├── components/ScrollCanvas/
│   └── lib/scrollFrames.ts   # TODO: map progress → frame index
└── package.json
```

### Git workflow

- Remote: GitHub (facilitator creates; public or org as preferred)
- Default branch `main`: **broken starter** (TODO incomplete) so the exercise is real on day one
- Branch `solution`: completed reference for facilitator (do not spoil early)
- Learners:
  1. Clone (preferred for single shared repo + access) **or** fork if org policy requires
  2. `git checkout -b workshop/<english-name>`
  3. Commit work on their branch
  4. Optional: push + open PR to `main` (review, do not merge mid-workshop unless intentional)

**Branch naming:** `workshop/anong`, `workshop/somchai`  
**Rule:** learners never push directly to `main` without PR.

### Sample assets

- Ship a small sequence in `public/frames/` (`frame_0001.webp` …) so the app is runnable without AI tools.
- Frame count documented in one config constant (e.g. `FRAME_COUNT`) so TODOs stay simple.
- Naming: zero-padded `frame_%04d.webp`.

---

## 5. Coding exercise

### Provided (already working)

- Page layout and dark premium shell
- Sticky full-viewport canvas section (~300vh scroll height)
- Image preload + simple loading state
- Sample frames on disk
- Wiring that *calls* the mapping helper (so fixing the helper lights up the UI)

### Required TODO (main challenge)

Implement in `src/lib/scrollFrames.ts` (or equivalent):

1. Compute scroll progress `0 → 1` from the sticky section’s scroll range.
2. Map progress to `frameIndex` in `[0, frameCount - 1]`.
3. Ensure canvas draws that frame via `requestAnimationFrame` (scaffold already loops; learners may only fill the math if scaffold isolates it).

**Hint formula (also on slides):**

```text
index = round(progress * (frameCount - 1))
```

Clamp to valid range. Avoid scrubbing `<video>.currentTime`.

### Stretch (optional)

- Show progress % or current frame number
- Tweak scroll section height
- Fade overlay headline based on progress thresholds

---

## 6. Facilitator demo notes (not learner homework)

Short live demo (~8 min):

1. Start frame prompt idea: product on solid `#0F172A` (or page bg), locked camera.
2. End frame: same product/camera/bg, transformed (explode / x-ray / rotate).
3. Video: locked camera, 3–5s, no zoom/pan.
4. Extract frames (e.g. ffmpeg → WEBP) into `public/frames/`.

Purpose: connect “where frames come from” without blocking hands-on time.

---

## 7. Slides outline (for Gamma)

Create ~10–12 slides from this outline (facilitator designs visuals in Gamma):

1. **Title** — Scroll-driven product UI workshop
2. **Goals** — Concept + working scrub in ~70–80 min
3. **Why it feels premium** — Apple product-page style motion
4. **Wrong path** — Scrubbing `<video>` with `currentTime`
5. **Right path** — Flipbook: frames + canvas + sticky
6. **Pipeline overview** — start/end → video → frames → scroll map (demo teaser)
7. **Code anatomy** — sticky · progress · frameIndex · draw
8. **Setup** — clone, `pnpm i`, branch `workshop/<name>`, `pnpm dev`
9. **Challenge** — Fill TODO until scrub works
10. **Hint** — `index = round(progress * (n - 1))`
11. **Stretch + share**
12. **Resources** — README, WORKSHOP.md, `solution` branch (after class)

---

## 8. Deliverables to build next

1. Scaffold Next.js + Tailwind app with broken TODO starter
2. Generate or add sample frames under `public/frames/`
3. `README.md` + `WORKSHOP.md`
4. `docs/slides-outline.md` (copy of section 7, paste-ready for Gamma)
5. `solution` branch with completed mapping
6. Push to GitHub when facilitator is ready

---

## 9. Risks & mitigations

| Risk | Mitigation |
| ---- | ---------- |
| Slow install / Node mismatch | Pre-check Node LTS; share exact `pnpm` version; arrive early for setup |
| Mixed skill pace | Pairing encouraged; stretch tasks for fast finishers; facilitator walks room |
| Spoiling solution | Keep `solution` branch; ask learners not to peek until share |
| Frames too heavy | Keep sample sequence short (~30–60 frames), WEBP, documented count |

---

## 10. Decisions log

| Decision | Choice |
| -------- | ------ |
| Primary outcome | Scroll concept + fix starter scrub |
| Audience | Mixed levels |
| Exercise style | Broken starter with TODO |
| Asset creation in-session for learners | No — facilitator demo only |
| Workshop structure | Concept-first + longer code |
| Stack | Next.js + Tailwind + canvas flipbook |
| Location | `workshop/scroll-frames-lab` |
| Git | Shared repo, branch per learner |
