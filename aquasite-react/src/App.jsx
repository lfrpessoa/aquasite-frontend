import React from 'react'
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
import Bubbles from './components/Bubbles'
import './App.css'

function App() {
  return (
    <Router>
      <Bubbles />
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
