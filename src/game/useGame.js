import { useCallback, useReducer, useRef } from 'react'
import { addRandomTile, createInitialBoard, hasWon, isGameOver, move } from './gameLogic'

const BEST_SCORE_KEY = 'jangpyeong2048.bestScore'

function loadBestScore() {
  const raw = localStorage.getItem(BEST_SCORE_KEY)
  return raw ? Number(raw) : 0
}

function saveBestScore(score) {
  localStorage.setItem(BEST_SCORE_KEY, String(score))
}

function makeIdCounter() {
  let id = 0
  return () => `t${id++}`
}

function boardToTiles(board, nextId) {
  const tiles = []
  board.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value !== 0) tiles.push({ id: nextId(), value, row: r, col: c, isNew: true, justMerged: false })
    })
  })
  return tiles
}

/** Finds the single cell that became non-zero between two board snapshots. */
function findNewCell(prevBoard, nextBoard) {
  for (let r = 0; r < nextBoard.length; r += 1) {
    for (let c = 0; c < nextBoard[r].length; c += 1) {
      if (nextBoard[r][c] !== 0 && prevBoard[r][c] === 0) {
        return { row: r, col: c, value: nextBoard[r][c] }
      }
    }
  }
  return null
}

function initState() {
  const nextId = makeIdCounter()
  const board = createInitialBoard()
  return {
    board,
    tiles: boardToTiles(board, nextId),
    score: 0,
    best: loadBestScore(),
    moveCount: 0,
    status: 'playing', // playing | won | over
    keepPlayingAfterWin: false,
    nextId,
  }
}

function applyMove(state, direction) {
  const result = move(state.board, direction)
  if (!result.moved) return state

  const findTileAt = (row, col) => state.tiles.find((t) => t.row === row && t.col === col)

  const tilesAfterSlide = result.tileMoves.map(({ from, to, merged, value }) => {
    if (!merged) {
      const [row, col] = from[0]
      const tile = findTileAt(row, col)
      return { ...tile, row: to[0], col: to[1], isNew: false, justMerged: false }
    }
    const [tileA, tileB] = from.map(([row, col]) => findTileAt(row, col))
    return {
      id: tileA.id,
      value,
      row: to[0],
      col: to[1],
      isNew: false,
      justMerged: true,
      mergedFrom: [tileA.id, tileB.id],
    }
  })

  const board = addRandomTile(result.board)
  const newCell = findNewCell(result.board, board)
  const tiles = newCell
    ? [...tilesAfterSlide, { id: state.nextId(), ...newCell, isNew: true, justMerged: false }]
    : tilesAfterSlide

  const score = state.score + result.gained
  const best = Math.max(state.best, score)
  if (best !== state.best) saveBestScore(best)

  const won = !state.keepPlayingAfterWin && hasWon(board)
  const over = isGameOver(board)

  return {
    ...state,
    board,
    tiles,
    score,
    best,
    moveCount: state.moveCount + 1,
    status: won ? 'won' : over ? 'over' : 'playing',
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'move':
      return state.status === 'over' ? state : applyMove(state, action.direction)
    case 'keepPlaying':
      return { ...state, status: 'playing', keepPlayingAfterWin: true }
    case 'restart':
      return initState()
    default:
      return state
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, initState)
  const busyRef = useRef(false)

  const move_ = useCallback((direction) => {
    if (busyRef.current) return
    busyRef.current = true
    dispatch({ type: 'move', direction })
    setTimeout(() => {
      busyRef.current = false
    }, 100)
  }, [])
  const keepPlaying = useCallback(() => dispatch({ type: 'keepPlaying' }), [])
  const restart = useCallback(() => dispatch({ type: 'restart' }), [])

  return { ...state, move: move_, keepPlaying, restart }
}
