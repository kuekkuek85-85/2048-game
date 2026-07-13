export default function GameOverlay({ status, onRestart, onKeepPlaying }) {
  if (status !== 'won' && status !== 'over') return null

  const isWin = status === 'won'

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg bg-[#eee4da]/90 text-center">
      <p className="text-3xl font-bold text-[#776e65]">{isWin ? 'You Win!' : 'Game Over'}</p>
      <div className="flex gap-2">
        {isWin && (
          <button
            type="button"
            onClick={onKeepPlaying}
            className="rounded-md bg-[#8f7a66] px-4 py-2 font-bold text-white hover:bg-[#9f8b76]"
          >
            계속하기
          </button>
        )}
        <button
          type="button"
          onClick={onRestart}
          className="rounded-md bg-[#8f7a66] px-4 py-2 font-bold text-white hover:bg-[#9f8b76]"
        >
          다시 시작
        </button>
      </div>
    </div>
  )
}
