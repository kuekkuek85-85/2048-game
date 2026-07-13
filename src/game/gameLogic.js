export const BOARD_SIZE = 4
export const WIN_TILE = 2048

export function createEmptyBoard(size = BOARD_SIZE) {
  return Array.from({ length: size }, () => Array(size).fill(0))
}

function cloneBoard(board) {
  return board.map((row) => [...row])
}

function getEmptyCells(board) {
  const cells = []
  board.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value === 0) cells.push([r, c])
    })
  })
  return cells
}

/**
 * Places a single random tile (90% -> 2, 10% -> 4) on an empty cell.
 * `rng` is injectable for deterministic tests.
 */
export function addRandomTile(board, rng = Math.random) {
  const emptyCells = getEmptyCells(board)
  if (emptyCells.length === 0) return board

  const [r, c] = emptyCells[Math.floor(rng() * emptyCells.length)]
  const value = rng() < 0.9 ? 2 : 4

  const next = cloneBoard(board)
  next[r][c] = value
  return next
}

export function createInitialBoard(rng = Math.random) {
  let board = createEmptyBoard()
  board = addRandomTile(board, rng)
  board = addRandomTile(board, rng)
  return board
}

/**
 * Slides and merges a single row to the left.
 * Each tile merges at most once per move; merge priority goes to the
 * leading (leftmost) tile, e.g. [2,2,4,0] -> [4,4,0,0], not [8,0,0,0].
 */
function slideRowLeft(row) {
  const indices = []
  row.forEach((v, i) => {
    if (v !== 0) indices.push(i)
  })
  const values = indices.map((i) => row[i])

  const result = []
  const moves = [] // { from: [origIndex, ...], to: outIndex, merged, value }
  let gained = 0

  let i = 0
  let outIdx = 0
  while (i < values.length) {
    const current = values[i]
    const next = values[i + 1]
    if (next !== undefined && next === current) {
      const merged = current * 2
      result.push(merged)
      gained += merged
      moves.push({ from: [indices[i], indices[i + 1]], to: outIdx, merged: true, value: merged })
      i += 2
    } else {
      result.push(current)
      moves.push({ from: [indices[i]], to: outIdx, merged: false, value: current })
      i += 1
    }
    outIdx += 1
  }

  while (result.length < row.length) result.push(0)

  const moved = row.some((v, idx) => v !== result[idx])
  return { row: result, gained, moved, moves }
}

function transpose(board) {
  return board[0].map((_, colIndex) => board.map((row) => row[colIndex]))
}

function reverseRows(board) {
  return board.map((row) => [...row].reverse())
}

const TRANSFORMS = {
  left: {
    to: (board) => board,
    from: (board) => board,
  },
  right: {
    to: (board) => reverseRows(board),
    from: (board) => reverseRows(board),
  },
  up: {
    to: (board) => transpose(board),
    from: (board) => transpose(board),
  },
  down: {
    to: (board) => reverseRows(transpose(board)),
    from: (board) => transpose(reverseRows(board)),
  },
}

/** Maps an (oriented line, position) pair back to [row, col] on the real board. */
function toBoardCoord(direction, line, pos, size) {
  switch (direction) {
    case 'left':
      return [line, pos]
    case 'right':
      return [line, size - 1 - pos]
    case 'up':
      return [pos, line]
    case 'down':
      return [size - 1 - pos, line]
    default:
      throw new Error(`Unknown direction: ${direction}`)
  }
}

/**
 * Pure move function: (board, direction) -> { board, gained, moved, tileMoves }.
 * Does not add a new tile - callers should call addRandomTile afterwards
 * only when `moved` is true.
 *
 * `tileMoves` describes, in real board coordinates, where each tile travels
 * (and which pairs merge) so the UI layer can animate slides/merges without
 * re-deriving the merge algorithm.
 */
export function move(board, direction) {
  const transform = TRANSFORMS[direction]
  if (!transform) throw new Error(`Unknown direction: ${direction}`)

  const size = board.length
  const oriented = transform.to(board)
  let gained = 0
  let moved = false
  const tileMoves = []

  const slidRows = oriented.map((row, lineIdx) => {
    const result = slideRowLeft(row)
    gained += result.gained
    if (result.moved) moved = true
    result.moves.forEach((m) => {
      tileMoves.push({
        from: m.from.map((pos) => toBoardCoord(direction, lineIdx, pos, size)),
        to: toBoardCoord(direction, lineIdx, m.to, size),
        merged: m.merged,
        value: m.value,
      })
    })
    return result.row
  })

  const nextBoard = transform.from(slidRows)

  return { board: nextBoard, gained, moved, tileMoves }
}

function cellsEqual(a, b) {
  return a.length === b.length && a.every((row, r) => row.every((v, c) => v === b[r][c]))
}

export function boardsEqual(a, b) {
  return cellsEqual(a, b)
}

export function getMaxTile(board) {
  return Math.max(0, ...board.flat())
}

export function hasWon(board) {
  return getMaxTile(board) >= WIN_TILE
}

/** True when no empty cell remains and no adjacent equal-value pair exists. */
export function isGameOver(board) {
  if (getEmptyCells(board).length > 0) return false

  for (const direction of ['left', 'right', 'up', 'down']) {
    if (move(board, direction).moved) return false
  }
  return true
}
