import { useState } from 'react'
import { getClassNo, validateName, validateStudentId } from '../student/studentStorage'

export default function StudentModal({ initialStudent, onSubmit, onCancel }) {
  const [studentId, setStudentId] = useState(initialStudent?.studentId ?? '')
  const [name, setName] = useState(initialStudent?.name ?? '')
  const [errors, setErrors] = useState({})

  function handleReset() {
    setStudentId('')
    setName('')
    setErrors({})
  }

  function handleSubmit(e) {
    e.preventDefault()
    const studentIdError = validateStudentId(studentId)
    const nameError = validateName(name)
    if (studentIdError || nameError) {
      setErrors({ studentId: studentIdError, name: nameError })
      return
    }
    onSubmit({ studentId, name, classNo: getClassNo(studentId) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-page-bg p-6 shadow-xl">
        <h2 className="mb-1 text-2xl font-bold text-[#776e65]">학생 정보 입력</h2>
        <p className="mb-4 text-sm text-[#8f7a66]">
          학번(5자리)과 이름을 입력하면 기록이 저장됩니다.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-left">
            <span className="text-sm font-bold text-[#776e65]">학번 (예: 10203 = 1학년 2반 3번)</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value.replace(/\D/g, ''))}
              className="rounded-md border border-[#bbada0] bg-white px-3 py-2 text-lg tracking-widest text-[#776e65] focus:border-[#8f7a66] focus:outline-none"
              placeholder="10203"
              autoFocus
            />
            {errors.studentId && <span className="text-sm text-red-600">{errors.studentId}</span>}
          </label>
          <label className="flex flex-col gap-1 text-left">
            <span className="text-sm font-bold text-[#776e65]">이름</span>
            <input
              type="text"
              maxLength={5}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border border-[#bbada0] bg-white px-3 py-2 text-lg text-[#776e65] focus:border-[#8f7a66] focus:outline-none"
              placeholder="김철수"
            />
            {errors.name && <span className="text-sm text-red-600">{errors.name}</span>}
          </label>

          <div className="mt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="rounded-md bg-[#8f7a66] px-4 py-2 font-bold text-white hover:bg-[#9f8b76]"
            >
              시작하기
            </button>
            <div className="flex gap-2">
              {initialStudent && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 rounded-md bg-[#eee4da] px-4 py-2 text-sm font-bold text-[#776e65] hover:bg-[#e4d7c8]"
                >
                  다른 사람으로 시작
                </button>
              )}
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 rounded-md bg-[#eee4da] px-4 py-2 text-sm font-bold text-[#776e65] hover:bg-[#e4d7c8]"
                >
                  취소
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
