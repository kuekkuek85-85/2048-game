export default function StatsSummary({ participantCount, averageScore }) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 rounded-md bg-[#eee4da] px-4 py-2 text-center">
        <div className="text-xs font-bold text-[#8f7a66]">참여 학생 수</div>
        <div className="text-xl font-bold text-[#776e65]">{participantCount}명</div>
      </div>
      <div className="flex-1 rounded-md bg-[#eee4da] px-4 py-2 text-center">
        <div className="text-xs font-bold text-[#8f7a66]">평균 점수</div>
        <div className="text-xl font-bold text-[#776e65]">{averageScore}</div>
      </div>
    </div>
  )
}
