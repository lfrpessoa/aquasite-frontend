import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const MessagesPage = () => {
  const { username: chatWith } = useParams()
  const navigate = useNavigate()
  const currentUser = localStorage.getItem('currentUser')
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [activeChat, setActiveChat] = useState(chatWith || null)
  const [hoveredMsg, setHoveredMsg] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

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
      const res = await fetch(`https://aquasite-frontend.onrender.com/api/messages/conversations/${currentUser}`)
      const data = await res.json()
      setConversations(data)
    } catch {}
  }

  const loadMessages = async (other) => {
    try {
      const res = await fetch(`https://aquasite-frontend.onrender.com/api/messages/${currentUser}/${other}`)
      const data = await res.json()
      setMessages(data)
    } catch {}
  }

  const deleteMessage = async (msgId) => {
    const res = await fetch(
      `https://aquasite-frontend.onrender.com/api/messages/${msgId}?user=${encodeURIComponent(currentUser)}`,
      { method: 'DELETE' }
    )
    const data = await res.json()
    if (data.success) {
      setMessages(prev => prev.filter(m => m.id !== msgId))
      loadConversations()
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const sendMessage = async () => {
    if (!newMessage.trim() && !imagePreview) return
    if (!activeChat) return
    try {
      const res = await fetch('https://aquasite-frontend.onrender.com/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: currentUser, receiver: activeChat, content: newMessage, image: imagePreview || null })
      })
      const msg = await res.json()
      setMessages(prev => [...prev, msg])
      setNewMessage('')
      setImagePreview(null)
      loadConversations()
    } catch {}
  }

  const openChat = (username) => {
    setActiveChat(username)
    navigate(`/mensagens/${username}`, { replace: true })
  }

  const sidebarStyle = {
    width: '240px',
    background: 'rgba(0, 15, 35, 0.7)',
    borderRight: '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0
  }

  if (!currentUser) return null

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg, #020e1e 0%, #011628 40%, #012233 70%, #013344 100%)' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 18px', borderBottom: '1px solid rgba(0,212,255,0.1)', background: 'rgba(2, 12, 28, 0.92)', backdropFilter: 'blur(20px)' }}>
        <button
          onClick={() => navigate('/home')}
          style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >←</button>
        <h1 style={{ color: '#f0f9ff', margin: 0, fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.2px' }}>Mensagens</h1>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Conversations list */}
        <div style={sidebarStyle}>
          <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(200,230,240,0.4)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Conversas
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {conversations.length === 0 && (
              <p style={{ color: 'rgba(200,230,240,0.3)', fontSize: '0.8rem', padding: '16px', textAlign: 'center' }}>Nenhuma conversa ainda.</p>
            )}
            {conversations.map(conv => (
              <div
                key={conv.other_user}
                onClick={() => openChat(conv.other_user)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 12px', cursor: 'pointer',
                  background: activeChat === conv.other_user ? 'rgba(0,212,255,0.08)' : 'transparent',
                  borderLeft: activeChat === conv.other_user ? '3px solid rgba(0,212,255,0.7)' : '3px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {conv.avatar
                  ? <img src={conv.avatar} alt="" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(0,212,255,0.15)' }} />
                  : <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,60,100,0.8), rgba(0,100,150,0.5))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>👤</div>
                }
                <div style={{ overflow: 'hidden' }}>
                  <p style={{ color: '#f0f9ff', margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>@{conv.other_user}</p>
                  <p style={{ color: 'rgba(200,230,240,0.4)', margin: 0, fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.last_message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!activeChat ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(200,230,240,0.25)', gap: '12px' }}>
              <div style={{ fontSize: '40px', opacity: 0.3 }}>💬</div>
              <p style={{ fontSize: '0.875rem' }}>Selecione uma conversa para começar.</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,15,35,0.5)' }}>
                <Link to={`/usuario/${activeChat}`} style={{ color: '#00d4ff', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}>@{activeChat}</Link>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {messages.length === 0 && (
                  <p style={{ color: 'rgba(200,230,240,0.3)', textAlign: 'center', marginTop: '40px', fontSize: '0.875rem' }}>Nenhuma mensagem ainda. Diga olá!</p>
                )}
                {messages.map(msg => {
                  const isMine = msg.sender === currentUser
                  return (
                    <div
                      key={msg.id}
                      style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: '6px' }}
                      onMouseEnter={() => setHoveredMsg(msg.id)}
                      onMouseLeave={() => setHoveredMsg(null)}
                    >
                      {/* Botão deletar — sempre no DOM, visível só no hover */}
                      {isMine && (
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          title="Apagar mensagem"
                          style={{ background: 'rgba(220,50,50,0.15)', border: '1px solid rgba(220,50,50,0.3)', color: 'rgba(255,100,100,0.8)', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'opacity 0.15s ease', opacity: hoveredMsg === msg.id ? 1 : 0, pointerEvents: hoveredMsg === msg.id ? 'auto' : 'none' }}
                        >🗑</button>
                      )}
                      <div style={{
                        maxWidth: '72%', padding: msg.image && !msg.content ? '6px' : '9px 14px',
                        borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isMine ? 'linear-gradient(135deg, #00b8e0, #0070aa)' : 'rgba(0,30,65,0.9)',
                        border: isMine ? 'none' : '1px solid rgba(255,255,255,0.08)',
                        color: 'white', fontSize: '0.9rem', wordBreak: 'break-word',
                        boxShadow: isMine ? '0 4px 14px rgba(0,184,224,0.2)' : 'none',
                        overflow: 'hidden'
                      }}>
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="imagem"
                            style={{ display: 'block', maxWidth: '100%', maxHeight: '260px', borderRadius: '12px', objectFit: 'cover', marginBottom: msg.content ? '8px' : '0' }}
                          />
                        )}
                        {msg.content && <span>{msg.content}</span>}
                        <div style={{ fontSize: '0.7rem', color: isMine ? 'rgba(255,255,255,0.65)' : 'rgba(200,230,240,0.35)', marginTop: '4px', textAlign: 'right', paddingRight: msg.image && !msg.content ? '6px' : '0', paddingBottom: msg.image && !msg.content ? '2px' : '0' }}>
                          {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '10px 18px 12px', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,15,35,0.5)' }}>
                {/* Preview da imagem selecionada */}
                {imagePreview && (
                  <div style={{ marginBottom: '8px', position: 'relative', display: 'inline-block' }}>
                    <img src={imagePreview} alt="preview" style={{ height: '72px', borderRadius: '10px', objectFit: 'cover', border: '1.5px solid rgba(0,212,255,0.3)' }} />
                    <button
                      onClick={() => setImagePreview(null)}
                      style={{ position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(220,50,50,0.9)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                    >×</button>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Botão de imagem */}
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Enviar imagem"
                    style={{ width: '38px', height: '38px', borderRadius: '50%', background: imagePreview ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.07)', border: `1px solid ${imagePreview ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.12)'}`, color: imagePreview ? '#00d4ff' : 'rgba(200,230,240,0.55)', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s ease' }}
                  >📷</button>
                  <input
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder={`Mensagem para @${activeChat}...`}
                    style={{ flex: 1, padding: '10px 16px', borderRadius: '50px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.875rem', outline: 'none' }}
                  />
                  <button
                    onClick={sendMessage}
                    style={{ padding: '10px 20px', borderRadius: '50px', background: 'linear-gradient(135deg, #00b8e0, #0070aa)', border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(0,184,224,0.25)', whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesPage
