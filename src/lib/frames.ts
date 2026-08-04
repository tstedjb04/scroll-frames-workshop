export const FRAME_COUNT = 178;

/** 0-based index → public URL for zero-padded WEBP */
export function frameSrc(index: number): string {
  const n = String(index + 1).padStart(4, "0");
  // return `/frames/frame_${n}.webp`
  return `/frames/frame_${n}.jpg`;
}
