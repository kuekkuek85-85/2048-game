import { Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import GamePage from './pages/GamePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GamePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  )
}
