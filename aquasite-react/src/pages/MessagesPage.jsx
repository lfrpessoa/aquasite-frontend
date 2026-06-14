import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const MessagesPage = () => {
  const { username: chatWith } = useParams()
  const navigate = useNavigate()
  const currentUser = localStorage.getItem('currentUser')
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [activeChat, setActiveChat] = useState(chatWith || null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return }
    loadConversations()
  }, [])

  useEffect(() => {
    if (activeChat) loadMessages(activeChat)
  }, [activeChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/messages/conversations/${currentUser}`)
      const data = await res.json()
      setConversations(data)
    } catch {}
  }

  const loadMessages = async (other) => {
    try {
      const res = await fetch(`http://localhost:4000/api/messages/${currentUser}/${other}`)
      const data = await res.json()
      setMessages(data)
    } catch {}
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return
    try {
      const res = await fetch('http://localhost:4000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: currentUser, receiver: activeChat, content: newMessage })
      })
      const msg = await res.json()
      setMessages(prev => [...prev, msg])
      setNewMessage('')
      loadConversations()
    } catch {}
  }

  const openChat = (username) => {
    setActiveChat(username)
    navigate(`/mensagens/${username}`, { replace: true })
  }

  const sidebarStyle = {
    width: '260px', background: 'rgba(255,255,255,0.04)', borderRight: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', flexDirection: 'column', flexShrink: 0
  }
  const chatStyle = {
    flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'
  }

  if (!currentUser) return null

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2137 100%)' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
        <button onClick={() => navigate('/home')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', fontSize: '16px' }}>←</button>
        <h1 style={{ color: 'white', margin: 0, fontSize: '18px' }}>💬 Mensagens</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Lista de conversas */}
        <div style={sidebarStyle}>
          <div style={{ padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#71767b', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Conversas
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {conversations.length === 0 && (
              <p style={{ color: '#71767b', fontSize: '14px', padding: '16px', textAlign: 'center' }}>Nenhuma conversa ainda.</p>
            )}
            {conversations.map(conv => (
              <div
                key={conv.other_user}
                onClick={() => openChat(conv.other_user)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', cursor: 'pointer',
                  background: activeChat === conv.other_user ? 'rgba(0,212,255,0.1)' : 'transparent',
                  borderLeft: activeChat === conv.other_user ? '3px solid #00d4ff' : '3px solid transparent',
                  transition: 'background 0.15s'
                }}
              >
                {conv.avatar
                  ? <img src={conv.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>👤</div>
                }
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ color: 'white', margin: 0, fontWeight: 'bold', fontSize: '14px' }}>@{conv.other_user}</p>
                  <p style={{ color: '#71767b', margin: 0, fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.last_message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área de chat */}
        <div style={chatStyle}>
          {!activeChat ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71767b', fontSize: '15px' }}>
              Selecione uma conversa ou pesquise um usuário para começar.
            </div>
          ) : (
            <>
              {/* Header do chat */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link to={`/usuario/${activeChat}`} style={{ color: '#00d4ff', fontWeight: 'bold', textDecoration: 'none', fontSize: '16px' }}>@{activeChat}</Link>
              </div>

              {/* Mensagens */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {messages.length === 0 && (
                  <p style={{ color: '#71767b', textAlign: 'center', marginTop: '40px' }}>Nenhuma mensagem ainda. Diga olá!</p>
                )}
                {messages.map(msg => {
                  const isMine = msg.sender === currentUser
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%', padding: '10px 14px', borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isMine ? '#00d4ff' : 'rgba(255,255,255,0.1)',
                        color: 'white', fontSize: '14px', wordBreak: 'break-word'
                      }}>
                        {msg.content}
                        <div style={{ fontSize: '11px', color: isMine ? 'rgba(255,255,255,0.7)' : '#71767b', marginTop: '4px', textAlign: 'right' }}>
                          {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '10px' }}>
                <input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendMessage()}
                  placeholder={`Mensagem para @${activeChat}...`}
                  style={{ flex: 1, padding: '10px 16px', borderRadius: '24px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '14px', outline: 'none' }}
                />
                <button
                  onClick={sendMessage}
                  style={{ padding: '10px 20px', borderRadius: '24px', background: '#00d4ff', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                  Enviar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesPage
