import { describe, expect, it } from 'vitest'
import { maskName } from './maskName'

describe('maskName', () => {
  it('3자 이름은 가운데 글자를 마스킹한다', () => {
    expect(maskName('김철수')).toBe('김*수')
  })

  it('2자 이름은 마지막 글자만 마스킹한다', () => {
    expect(maskName('이가')).toBe('이*')
  })

  it('5자 이름은 첫/끝 글자만 남기고 마스킹한다', () => {
    expect(maskName('남궁도영수')).toBe('남***수')
  })

  it('빈 값은 그대로 반환한다', () => {
    expect(maskName('')).toBe('')
  })
})
