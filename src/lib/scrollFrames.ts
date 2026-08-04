export function getScrollProgress(
  scrollTop: number,
  sectionTop: number,
  scrollRange: number
): number {
  if (scrollRange <= 0) return 0;
  const raw = (scrollTop - sectionTop) / scrollRange;
  return Math.min(1, Math.max(0, raw));
}

export function progressToFrameIndex(
  progress: number,
  frameCount: number
): number {
  // TODO(workshop): map clamped progress (0..1) to a frame index in
  // [0, frameCount - 1]. Hint: Math.round(progress * (frameCount - 1))
  // Remember to clamp progress and handle frameCount < 1.
  void progress;
  void frameCount;
  return 0;
}
