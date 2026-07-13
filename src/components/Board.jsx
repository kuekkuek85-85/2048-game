import { useRef } from 'react'
import Tile from './Tile'
import { BOARD_SIZE } from '../game/gameLogic'

const MIN_SWIPE_DISTANCE = 30

export default function Board({ tiles, onSwipe }) {
  const touchStart = useRef(null)

  function handleTouchStart(e) {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  function handleTouchEnd(e) {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null

    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    if (Math.max(absX, absY) < MIN_SWIPE_DISTANCE) return

    if (absX > absY) {
      onSwipe(dx > 0 ? 'right' : 'left')
    } else {
      onSwipe(dy > 0 ? 'down' : 'up')
    }
  }

  const cells = Array.from({ length: BOARD_SIZE * BOARD_SIZE })

  return (
    <div
      className="relative aspect-square w-full touch-none rounded-lg bg-board-bg p-[3%]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-[3%]">
        {cells.map((_, i) => (
          <div key={i} className="rounded-md bg-cell-empty" />
        ))}
      </div>
      <div className="absolute inset-[3%]">
        {tiles.map((tile) => (
          <Tile key={tile.id} value={tile.value} row={tile.row} col={tile.col} isNew={tile.isNew} justMerged={tile.justMerged} />
        ))}
      </div>
    </div>
  )
}
