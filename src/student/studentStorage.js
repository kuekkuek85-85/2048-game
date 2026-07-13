const STUDENT_KEY = 'jangpyeong2048.student'

export function loadStudent() {
  try {
    const raw = localStorage.getItem(STUDENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.studentId || !parsed?.name) return null
    return parsed
  } catch {
    return null
  }
}

export function saveStudent(student) {
  localStorage.setItem(STUDENT_KEY, JSON.stringify(student))
}

export function clearStudent() {
  localStorage.removeItem(STUDENT_KEY)
}

/** 학번 2~3번째 자리(반)를 파생한다. 예: "10203" -> 2 */
export function getClassNo(studentId) {
  return Number(studentId.slice(1, 3))
}

/** 학번 4~5번째 자리(번호)를 파생한다. 예: "10203" -> 3 */
export function getStudentNo(studentId) {
  return Number(studentId.slice(3, 5))
}

/** 5자리 숫자, 1학년(첫 자리 1), 반 01~15, 번호 01~35. */
export function validateStudentId(studentId) {
  if (!/^\d{5}$/.test(studentId)) return '학번은 숫자 5자리여야 합니다.'
  if (studentId[0] !== '1') return '학번 첫 자리는 학년(1)이어야 합니다.'
  const classNo = getClassNo(studentId)
  if (classNo < 1 || classNo > 15) return '반은 01~15 사이여야 합니다.'
  const studentNo = getStudentNo(studentId)
  if (studentNo < 1 || studentNo > 35) return '번호는 01~35 사이여야 합니다.'
  return null
}

/** 한글 이름 2~5자. */
export function validateName(name) {
  if (!/^[가-힣]{2,5}$/.test(name)) return '이름은 한글 2~5자로 입력해주세요.'
  return null
}
