import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebaseConfig'

/**
 * Anti-abuse heuristic: no single move can plausibly gain more than a
 * "mega-merge" tile's worth of score. Real play averages far less than
 * this per move, so a submitted (score, moveCount) pair that exceeds it
 * is almost certainly not the product of honest play.
 */
export const MAX_SCORE_PER_MOVE = 2048

export function isPlausibleScore(score, moveCount) {
  if (score < 0 || moveCount < 0) return false
  if (score === 0) return true
  if (moveCount === 0) return false
  return score / moveCount <= MAX_SCORE_PER_MOVE
}

/**
 * Records a finished game. Always logs the play to `plays`. Only updates
 * the `scores/{studentId}` leaderboard doc when this run beats the
 * student's stored best (matches the Firestore rule that rejects any
 * update that doesn't strictly increase bestScore).
 */
export async function submitScore({ studentId, name, classNo, score, maxTile, moveCount }) {
  if (!isPlausibleScore(score, moveCount)) {
    throw new Error('비정상적인 점수 기록이라 저장할 수 없습니다.')
  }

  const scoreRef = doc(db, 'scores', studentId)

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(scoreRef)
    const prevBest = snap.exists() ? (snap.data().bestScore ?? 0) : 0
    const prevBestTile = snap.exists() ? (snap.data().bestTile ?? 0) : 0
    const prevPlayCount = snap.exists() ? (snap.data().playCount ?? 0) : 0

    if (score <= prevBest && snap.exists()) return

    tx.set(
      scoreRef,
      {
        studentId,
        name,
        classNo,
        bestScore: Math.max(prevBest, score),
        bestTile: Math.max(prevBestTile, maxTile),
        playCount: prevPlayCount + 1,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  })

  await addDoc(collection(db, 'plays'), {
    studentId,
    name,
    score,
    maxTile,
    moveCount,
    createdAt: serverTimestamp(),
  })
}

export async function fetchTopScores(topN = 10) {
  const q = query(collection(db, 'scores'), orderBy('bestScore', 'desc'), limit(topN))
  const snap = await getDocs(q)
  return snap.docs.map((d) => d.data())
}
