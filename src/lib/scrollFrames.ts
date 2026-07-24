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
