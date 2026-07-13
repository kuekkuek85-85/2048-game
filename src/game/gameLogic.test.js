import { describe, expect, it } from 'vitest'
import {
  addRandomTile,
  createEmptyBoard,
  getMaxTile,
  hasWon,
  isGameOver,
  move,
} from './gameLogic'

function boardFromRows(rows) {
  return rows.map((row) => [...row])
}

describe('move', () => {
  it('병합은 한 이동에서 각 타일 최대 1회만 일어난다 (2,2,4 -> 4,4,0)', () => {
    const board = boardFromRows([
      [2, 2, 4, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    const result = move(board, 'left')
    expect(result.board[0]).toEqual([4, 4, 0, 0])
    expect(result.gained).toBe(4)
    expect(result.moved).toBe(true)
  })

  it('한 줄에서 이중 병합이 발생하면 각각 합산된다 (2,2,2,2 -> 4,4,0,0, +8점)', () => {
    const board = boardFromRows([
      [2, 2, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    const result = move(board, 'left')
    expect(result.board[0]).toEqual([4, 4, 0, 0])
    expect(result.gained).toBe(8)
    expect(result.moved).toBe(true)
  })

  it('이동이나 병합이 전혀 없으면 무효 이동으로 판정한다', () => {
    const board = boardFromRows([
      [2, 4, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    const result = move(board, 'left')
    expect(result.moved).toBe(false)
    expect(result.gained).toBe(0)
    expect(result.board).toEqual(board)
  })

  it('빈 칸만 채워져도 이동은 유효로 판정한다 (병합 없이 이동만)', () => {
    const board = boardFromRows([
      [0, 2, 0, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    const result = move(board, 'left')
    expect(result.board[0]).toEqual([2, 4, 0, 0])
    expect(result.moved).toBe(true)
    expect(result.gained).toBe(0)
  })

  it('병합 우선순위는 이동 방향의 앞쪽부터 적용된다 (오른쪽 이동)', () => {
    const board = boardFromRows([
      [0, 4, 2, 2],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    const result = move(board, 'right')
    expect(result.board[0]).toEqual([0, 0, 4, 4])
    expect(result.gained).toBe(4)
  })

  it('상/하 방향 이동도 열 단위로 정확히 동작한다', () => {
    const board = boardFromRows([
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [4, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    const up = move(board, 'up')
    expect(up.board.map((row) => row[0])).toEqual([4, 4, 0, 0])
    expect(up.gained).toBe(4)

    const down = move(board, 'down')
    expect(down.board.map((row) => row[0])).toEqual([0, 0, 4, 4])
    expect(down.gained).toBe(4)
  })

  it('점수는 이동 한 번에 발생한 모든 병합의 새 타일 값을 합산한다', () => {
    const board = boardFromRows([
      [2, 2, 0, 0],
      [4, 4, 0, 0],
      [8, 8, 0, 0],
      [0, 0, 0, 0],
    ])
    const result = move(board, 'left')
    // 2+2=4, 4+4=8, 8+8=16 -> 4 + 8 + 16 = 28
    expect(result.gained).toBe(28)
  })
})

describe('move tileMoves (애니메이션용 좌표 추적)', () => {
  it('병합 시 두 원본 좌표가 하나의 목적지로 매핑된다', () => {
    const board = boardFromRows([
      [2, 2, 4, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    const result = move(board, 'left')
    const merge = result.tileMoves.find((m) => m.merged)
    expect(merge.from).toEqual([
      [0, 0],
      [0, 1],
    ])
    expect(merge.to).toEqual([0, 0])
    expect(merge.value).toBe(4)

    const slideOnly = result.tileMoves.find((m) => !m.merged)
    expect(slideOnly.from).toEqual([[0, 2]])
    expect(slideOnly.to).toEqual([0, 1])
  })

  it('위쪽 이동은 좌표를 열 기준으로 변환한다', () => {
    const board = boardFromRows([
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    const result = move(board, 'up')
    const merge = result.tileMoves.find((m) => m.merged)
    expect(merge.from).toEqual([
      [0, 0],
      [1, 0],
    ])
    expect(merge.to).toEqual([0, 0])
  })
})

describe('addRandomTile', () => {
  it('빈 칸에 2(90%) 또는 4(10%)를 생성한다', () => {
    const board = createEmptyBoard()
    const rngAlways0 = () => 0 // picks first empty cell, value 2 (< 0.9)
    const next = addRandomTile(board, rngAlways0)
    const flat = next.flat()
    expect(flat.filter((v) => v !== 0)).toEqual([2])
  })

  it('rng가 0.95를 반환하면 4가 생성된다', () => {
    const board = createEmptyBoard()
    const rng = () => 0.95
    const next = addRandomTile(board, rng)
    expect(next.flat().filter((v) => v !== 0)).toEqual([4])
  })

  it('보드가 가득 차 있으면 아무것도 추가하지 않는다', () => {
    const fullBoard = Array.from({ length: 4 }, () => Array(4).fill(2))
    const next = addRandomTile(fullBoard, () => 0)
    expect(next).toEqual(fullBoard)
  })
})

describe('isGameOver', () => {
  it('빈 칸이 있으면 게임오버가 아니다', () => {
    const board = boardFromRows([
      [2, 4, 8, 16],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 0],
    ])
    expect(isGameOver(board)).toBe(false)
  })

  it('빈 칸이 없고 인접 병합도 불가능하면 게임오버다', () => {
    const board = boardFromRows([
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ])
    expect(isGameOver(board)).toBe(true)
  })

  it('빈 칸은 없지만 인접 병합이 가능하면 게임오버가 아니다', () => {
    const board = boardFromRows([
      [2, 2, 4, 8],
      [4, 8, 2, 4],
      [2, 4, 8, 2],
      [4, 2, 4, 8],
    ])
    expect(isGameOver(board)).toBe(false)
  })
})

describe('hasWon / getMaxTile', () => {
  it('2048 타일이 있으면 승리로 판정한다', () => {
    const board = boardFromRows([
      [2048, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    expect(hasWon(board)).toBe(true)
    expect(getMaxTile(board)).toBe(2048)
  })

  it('2048 미만이면 승리가 아니다', () => {
    const board = boardFromRows([
      [1024, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ])
    expect(hasWon(board)).toBe(false)
  })
})
