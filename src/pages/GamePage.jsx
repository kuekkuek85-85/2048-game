import { useEffect, useState } from 'react'
import Board from '../components/Board'
import GameOverlay from '../components/GameOverlay'
import Header from '../components/Header'
import NavTabs from '../components/NavTabs'
import StudentBadge from '../components/StudentBadge'
import StudentModal from '../components/StudentModal'
import { useGame } from '../game/useGame'
import { useStudent } from '../student/StudentContext'

const KEY_TO_DIRECTION = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
}

export default function GamePage() {
  const { tiles, score, best, status, move, keepPlaying, restart } = useGame()
  const { student, setStudent } = useStudent()
  const [editing, setEditing] = useState(false)

  const modalOpen = !student || editing

  useEffect(() => {
    function handleKeyDown(e) {
      if (modalOpen) return
      const direction = KEY_TO_DIRECTION[e.key]
      if (!direction) return
      e.preventDefault()
      move(direction)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [move, modalOpen])

  function handleStudentSubmit(next) {
    setStudent(next)
    setEditing(false)
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col gap-2 p-4">
      <Header score={score} best={best} onRestart={restart} />
      <StudentBadge student={student} onChange={() => setEditing(true)} />
      <div className="relative mt-2">
        <Board tiles={tiles} onSwipe={modalOpen ? () => {} : move} />
        <GameOverlay status={status} onRestart={restart} onKeepPlaying={keepPlaying} />
      </div>
      <NavTabs />
      {modalOpen && (
        <StudentModal
          initialStudent={editing ? student : null}
          onSubmit={handleStudentSubmit}
          onCancel={editing ? () => setEditing(false) : undefined}
        />
      )}
    </div>
  )
}
