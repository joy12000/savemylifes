import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Capture from './pages/Capture'
import Chat from './pages/Chat'
import Settings from './pages/Settings'

export default function App() {
  return (
    <div className="app-shell max-w-4xl mx-auto px-4">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
