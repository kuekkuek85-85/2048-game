export default function SaveStatusBanner({ saveState, onRetry }) {
  if (saveState === 'idle') return null

  if (saveState === 'saving') {
    return <p className="text-center text-sm text-[#8f7a66]">기록 저장 중...</p>
  }

  if (saveState === 'success') {
    return <p className="text-center text-sm text-[#8f7a66]">기록이 저장되었습니다.</p>
  }

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-red-700">
      <span>기록 저장에 실패했습니다.</span>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-md bg-red-100 px-2 py-1 font-bold hover:bg-red-200"
      >
        재시도
      </button>
    </div>
  )
}
