import { useEffect } from 'react'
import Board from '../components/Board'
import GameOverlay from '../components/GameOverlay'
import Header from '../components/Header'
import NavTabs from '../components/NavTabs'
import { useGame } from '../game/useGame'

const KEY_TO_DIRECTION = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
}

export default function GamePage() {
  const { tiles, score, best, status, move, keepPlaying, restart } = useGame()

  useEffect(() => {
    function handleKeyDown(e) {
      const direction = KEY_TO_DIRECTION[e.key]
      if (!direction) return
      e.preventDefault()
      move(direction)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move])

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col gap-4 p-4">
      <Header score={score} best={best} onRestart={restart} />
      <div className="relative">
        <Board tiles={tiles} onSwipe={move} />
        <GameOverlay status={status} onRestart={restart} onKeepPlaying={keepPlaying} />
      </div>
      <NavTabs />
    </div>
  )
}
