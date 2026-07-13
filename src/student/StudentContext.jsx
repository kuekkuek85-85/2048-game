import { createContext, useContext, useState } from 'react'
import { clearStudent, loadStudent, saveStudent } from './studentStorage'

const StudentContext = createContext(null)

export function StudentProvider({ children }) {
  const [student, setStudentState] = useState(loadStudent)

  function setStudent(next) {
    saveStudent(next)
    setStudentState(next)
  }

  function logout() {
    clearStudent()
    setStudentState(null)
  }

  return (
    <StudentContext.Provider value={{ student, setStudent, logout }}>
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  const ctx = useContext(StudentContext)
  if (!ctx) throw new Error('useStudent must be used within a StudentProvider')
  return ctx
}
