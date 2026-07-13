import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DashboardPage from './DashboardPage'
import { fetchTopScores } from '../firebase/scores'

vi.mock('../firebase/scores', () => ({ fetchTopScores: vi.fn() }))

const SAMPLE = [
  { studentId: '10203', name: '김철수', classNo: 2, bestScore: 100, bestTile: 64 },
  { studentId: '10105', name: '이가', classNo: 1, bestScore: 80, bestTile: 32 },
]

describe('DashboardPage', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('진입 시 1회 조회하고, 새로고침 버튼을 눌러야 다시 조회한다', async () => {
    fetchTopScores.mockResolvedValue(SAMPLE)
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )

    await waitFor(() => expect(fetchTopScores).toHaveBeenCalledTimes(1))
    expect(await screen.findByText('김철수')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '새로고침' }))
    await waitFor(() => expect(fetchTopScores).toHaveBeenCalledTimes(2))
  })

  it('연속 클릭 시 2초 디바운스로 재조회를 막는다', async () => {
    fetchTopScores.mockResolvedValue(SAMPLE)
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )
    await waitFor(() => expect(fetchTopScores).toHaveBeenCalledTimes(1))

    const button = screen.getByRole('button', { name: '새로고침' })
    await user.click(button)
    await user.click(button)
    await user.click(button)

    await waitFor(() => expect(fetchTopScores).toHaveBeenCalledTimes(2))
  })

  it('참여 학생 수와 평균 점수를 계산해 보여준다', async () => {
    fetchTopScores.mockResolvedValue(SAMPLE)

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    )

    expect(await screen.findByText('2명')).toBeInTheDocument()
    expect(await screen.findByText('90')).toBeInTheDocument() // (100+80)/2
  })
})
