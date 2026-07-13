import { describe, expect, it } from 'vitest'
import { getClassNo, getStudentNo, validateName, validateStudentId } from './studentStorage'

describe('validateStudentId', () => {
  it('올바른 학번은 통과한다 (10203 = 1학년 2반 3번)', () => {
    expect(validateStudentId('10203')).toBeNull()
  })

  it('5자리 숫자가 아니면 거부한다', () => {
    expect(validateStudentId('1020')).not.toBeNull()
    expect(validateStudentId('102033')).not.toBeNull()
    expect(validateStudentId('abcde')).not.toBeNull()
  })

  it('첫 자리가 1이 아니면 거부한다', () => {
    expect(validateStudentId('20203')).not.toBeNull()
  })

  it('반이 01~15 범위를 벗어나면 거부한다', () => {
    expect(validateStudentId('10003')).not.toBeNull()
    expect(validateStudentId('11603')).not.toBeNull()
  })

  it('번호가 01~35 범위를 벗어나면 거부한다', () => {
    expect(validateStudentId('10200')).not.toBeNull()
    expect(validateStudentId('10236')).not.toBeNull()
  })
})

describe('getClassNo / getStudentNo', () => {
  it('학번에서 반과 번호를 파생한다', () => {
    expect(getClassNo('10203')).toBe(2)
    expect(getStudentNo('10203')).toBe(3)
  })
})

describe('validateName', () => {
  it('한글 2~5자는 통과한다', () => {
    expect(validateName('김철수')).toBeNull()
    expect(validateName('이가')).toBeNull()
    expect(validateName('남궁도영수')).toBeNull()
  })

  it('한글이 아니거나 길이가 범위를 벗어나면 거부한다', () => {
    expect(validateName('김')).not.toBeNull()
    expect(validateName('가나다라마바')).not.toBeNull()
    expect(validateName('kim')).not.toBeNull()
    expect(validateName('김a수')).not.toBeNull()
  })
})
