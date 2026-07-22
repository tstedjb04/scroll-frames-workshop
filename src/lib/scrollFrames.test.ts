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
