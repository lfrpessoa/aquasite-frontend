import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import CuriosidadesPage from './pages/CuriosidadesPage'
import SobrePage from './pages/SobrePage'
import SearchPage from './pages/SearchPage'
import UserProfilePage from './pages/UserProfilePage'
import MessagesPage from './pages/MessagesPage'
import NotificationsPage from './pages/NotificationsPage'
import { API_URL } from './config.js'
import './App.css'

const HEARTBEAT_INTERVAL_MS = 25000

function App() {
  useEffect(() => {
    const sendHeartbeat = () => {
      const currentUser = localStorage.getItem('currentUser')
      if (!currentUser) return
      fetch(`${API_URL}/api/users/${currentUser}/heartbeat`, { method: 'POST' }).catch(() => {})
    }
    sendHeartbeat()
    const id = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/curiosidades" element={<CuriosidadesPage />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/pesquisar" element={<SearchPage />} />
        <Route path="/usuario/:username" element={<UserProfilePage />} />
        <Route path="/mensagens" element={<MessagesPage />} />
        <Route path="/mensagens/:username" element={<MessagesPage />} />
        <Route path="/notificacoes" element={<NotificationsPage />} />
      </Routes>
    </Router>
  )
}

export default App
