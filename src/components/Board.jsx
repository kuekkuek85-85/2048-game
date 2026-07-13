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
      {/* 배경 빈 칸과 타일 레이어는 동일한 좌표계(절대배치 + translate(col/row*100%) +
          동일 비율 내부 패딩)를 사용해야 정확히 겹친다. 하나는 CSS grid gap,
          다른 하나는 transform 배수를 쓰면 셀 간격 계산이 어긋난다. */}
      <div className="relative h-full w-full">
        {cells.map((_, i) => {
          const row = Math.floor(i / BOARD_SIZE)
          const col = i % BOARD_SIZE
          return (
            <div
              key={i}
              className="absolute top-0 left-0 h-1/4 w-1/4 p-[3%]"
              style={{ transform: `translate(${col * 100}%, ${row * 100}%)` }}
            >
              <div className="h-full w-full rounded-md bg-cell-empty" />
            </div>
          )
        })}
        {tiles.map((tile) => (
          <Tile
            key={tile.id}
            value={tile.value}
            row={tile.row}
            col={tile.col}
            isNew={tile.isNew}
            justMerged={tile.justMerged}
          />
        ))}
      </div>
    </div>
  )
}
