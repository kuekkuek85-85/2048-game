import { describe, expect, it, vi } from 'vitest'

vi.mock('./firebaseConfig', () => ({ db: {} }))

const { isPlausibleScore, MAX_SCORE_PER_MOVE } = await import('./scores')

describe('isPlausibleScore', () => {
  it('점수가 0이면 이동 횟수와 무관하게 허용한다', () => {
    expect(isPlausibleScore(0, 0)).toBe(true)
    expect(isPlausibleScore(0, 5)).toBe(true)
  })

  it('이동당 평균 점수가 상한 이하면 허용한다', () => {
    expect(isPlausibleScore(MAX_SCORE_PER_MOVE * 10, 10)).toBe(true)
  })

  it('이동당 평균 점수가 상한을 넘으면 거부한다', () => {
    expect(isPlausibleScore(MAX_SCORE_PER_MOVE * 10 + 1, 10)).toBe(false)
  })

  it('점수는 있는데 이동 횟수가 0이면 거부한다', () => {
    expect(isPlausibleScore(100, 0)).toBe(false)
  })

  it('음수 값은 거부한다', () => {
    expect(isPlausibleScore(-10, 5)).toBe(false)
    expect(isPlausibleScore(10, -5)).toBe(false)
  })
})
