import { NavLink } from 'react-router-dom'

const tabClass = ({ isActive }) =>
  `flex-1 rounded-md py-2 text-center font-bold transition-colors ${
    isActive ? 'bg-[#8f7a66] text-white' : 'bg-[#eee4da] text-[#776e65]'
  }`

export default function NavTabs() {
  return (
    <nav className="flex gap-2">
      <NavLink to="/" end className={tabClass}>
        게임
      </NavLink>
      <NavLink to="/dashboard" className={tabClass}>
        대시보드
      </NavLink>
    </nav>
  )
}
