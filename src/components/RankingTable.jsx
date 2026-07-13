import { maskName } from '../utils/maskName'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function RankingTable({ entries, maskNames }) {
  if (entries.length === 0) {
    return <p className="py-8 text-center text-[#8f7a66]">아직 기록이 없습니다.</p>
  }

  return (
    <table className="w-full border-collapse overflow-hidden rounded-lg text-left">
      <thead>
        <tr className="bg-[#bbada0] text-white">
          <th className="px-3 py-2">순위</th>
          <th className="px-3 py-2">학번</th>
          <th className="px-3 py-2">이름</th>
          <th className="px-3 py-2 text-right">최고 점수</th>
          <th className="px-3 py-2 text-right">최고 타일</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, i) => {
          const rank = i + 1
          return (
            <tr key={entry.studentId} className={rank <= 3 ? 'bg-[#fff3d6]' : 'bg-[#faf8ef]'}>
              <td className="px-3 py-2 font-bold text-[#776e65]">{MEDALS[rank] ?? rank}</td>
              <td className="px-3 py-2 text-[#8f7a66]">{entry.studentId}</td>
              <td className="px-3 py-2 text-[#8f7a66]">{maskNames ? maskName(entry.name) : entry.name}</td>
              <td className="px-3 py-2 text-right font-bold text-[#776e65]">{entry.bestScore}</td>
              <td className="px-3 py-2 text-right text-[#8f7a66]">{entry.bestTile}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
