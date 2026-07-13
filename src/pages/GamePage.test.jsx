import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import GamePage from './GamePage'
import { submitScore } from '../firebase/scores'
import { useGame } from '../game/useGame'
import { useStudent } from '../student/StudentContext'

vi.mock('../firebase/scores', () => ({ submitScore: vi.fn() }))
vi.mock('../game/useGame')
vi.mock('../student/StudentContext', async () => {
  const actual = await vi.importActual('../student/StudentContext')
  return { ...actual, useStudent: vi.fn() }
})

const baseGameState = {
  board: [
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2],
  ],
  tiles: [],
  score: 40,
  best: 40,
  moveCount: 20,
  status: 'over',
  move: vi.fn(),
  keepPlaying: vi.fn(),
  restart: vi.fn(),
}

describe('GamePage 기록 저장 흐름', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('게임 오버 시 자동 저장을 시도하고, 실패하면 재시도 버튼으로 재저장할 수 있다', async () => {
    useGame.mockReturnValue(baseGameState)
    useStudent.mockReturnValue({
      student: { studentId: '10203', name: '김철수', classNo: 2 },
      setStudent: vi.fn(),
    })
    submitScore.mockRejectedValueOnce(new Error('network error')).mockResolvedValueOnce(undefined)

    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>,
    )

    await waitFor(() => expect(submitScore).toHaveBeenCalledTimes(1))
    expect(await screen.findByText('기록 저장에 실패했습니다.')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '재시도' }))

    await waitFor(() => expect(submitScore).toHaveBeenCalledTimes(2))
    expect(await screen.findByText('기록이 저장되었습니다.')).toBeInTheDocument()
    expect(submitScore).toHaveBeenLastCalledWith({
      studentId: '10203',
      name: '김철수',
      classNo: 2,
      score: 40,
      maxTile: 4,
      moveCount: 20,
    })
  })

  it('학생 등록 전에는 저장을 시도하지 않는다', async () => {
    useGame.mockReturnValue(baseGameState)
    useStudent.mockReturnValue({ student: null, setStudent: vi.fn() })

    render(
      <MemoryRouter>
        <GamePage />
      </MemoryRouter>,
    )

    expect(screen.getByText('학생 정보 입력')).toBeInTheDocument()
    expect(submitScore).not.toHaveBeenCalled()
  })
})
