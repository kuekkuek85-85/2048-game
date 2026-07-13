export default function StudentBadge({ student, onChange }) {
  if (!student) return null

  return (
    <div className="flex items-center gap-2 text-sm text-[#8f7a66]">
      <span>
        {student.studentId} {student.name}
      </span>
      <button type="button" onClick={onChange} className="font-bold underline underline-offset-2 hover:text-[#776e65]">
        변경
      </button>
    </div>
  )
}
