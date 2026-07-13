import { useCallback, useEffect, useRef, useState } from 'react'
import NavTabs from '../components/NavTabs'
import RankingTable from '../components/RankingTable'
import StatsSummary from '../components/StatsSummary'
import { fetchTopScores } from '../firebase/scores'

const DASHBOARD_FETCH_LIMIT = 300
const DEBOUNCE_MS = 2000
const CLASS_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 1)

function formatTime(date) {
  if (!date) return null
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} 기준`
}

export default function DashboardPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [debouncing, setDebouncing] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null)
  const [classFilter, setClassFilter] = useState('all')
  const [maskNames, setMaskNames] = useState(false)
  const debounceTimer = useRef(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTopScores(DASHBOARD_FETCH_LIMIT)
      setEntries(data)
      setLastUpdatedAt(new Date())
    } catch {
      setError('데이터를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  function handleRefreshClick() {
    if (debouncing) return
    setDebouncing(true)
    refresh()
    debounceTimer.current = setTimeout(() => setDebouncing(false), DEBOUNCE_MS)
  }

  useEffect(() => {
    refresh()
    return () => clearTimeout(debounceTimer.current)
  }, [refresh])

  const filtered =
    classFilter === 'all' ? entries : entries.filter((e) => e.classNo === Number(classFilter))
  const top10 = filtered.slice(0, 10)
  const averageScore =
    filtered.length === 0
      ? 0
      : Math.round(filtered.reduce((sum, e) => sum + (e.bestScore ?? 0), 0) / filtered.length)

  return (
    <div className="mx-auto flex min-h-full max-w-2xl flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#776e65]">대시보드</h1>
        <div className="flex items-center gap-2">
          {lastUpdatedAt && <span className="text-xs text-[#8f7a66]">{formatTime(lastUpdatedAt)}</span>}
          <button
            type="button"
            onClick={handleRefreshClick}
            disabled={debouncing}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-[#8f7a66] text-lg text-white disabled:opacity-50"
            aria-label="새로고침"
            title="새로고침"
          >
            {loading ? '…' : '↻'}
          </button>
        </div>
      </div>

      {error && <p className="text-center text-sm text-red-700">{error}</p>}

      <div className="flex items-center justify-between gap-2">
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="rounded-md border border-[#bbada0] bg-white px-2 py-1 text-sm text-[#776e65]"
        >
          <option value="all">전체 반</option>
          {CLASS_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}반
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1 text-sm text-[#776e65]">
          <input type="checkbox" checked={maskNames} onChange={(e) => setMaskNames(e.target.checked)} />
          이름 마스킹
        </label>
      </div>

      <StatsSummary participantCount={filtered.length} averageScore={averageScore} />

      <RankingTable entries={top10} maskNames={maskNames} />

      <NavTabs />
    </div>
  )
}
