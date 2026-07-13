function ScorePill({ label, value }) {
  return (
    <div className="flex min-w-[64px] flex-col items-center rounded-md bg-[#bbada0] px-3 py-1 text-white">
      <span className="text-[11px] font-bold tracking-wide text-[#eee4da]">{label}</span>
      <span className="text-lg font-bold leading-tight">{value}</span>
    </div>
  )
}

export default function Header({ score, best, onRestart }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-4xl font-bold text-[#776e65]">2048</h1>
      <div className="flex items-center gap-2">
        <ScorePill label="SCORE" value={score} />
        <ScorePill label="BEST" value={best} />
        <button
          type="button"
          onClick={onRestart}
          aria-label="새 게임"
          title="새 게임"
          className="ml-1 flex h-10 w-10 items-center justify-center rounded-md bg-[#8f7a66] text-xl text-white transition-colors hover:bg-[#9f8b76]"
        >
          ↻
        </button>
      </div>
    </div>
  )
}
