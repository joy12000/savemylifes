import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import { AuthGate, RequireAuth } from './auth/AuthGate'
import UseAuthTokenBridge from './hooks/UseAuthTokenBridge'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AuthGate>
    <div className="app-shell max-w-4xl mx-auto px-4">
      <Header />
      <UseAuthTokenBridge />
      <RequireAuth>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </RequireAuth>
    </div>
    </AuthGate>
  )
}
