import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const typeConfig = {
  like:    { icon: '❤️', label: 'curtiu seu post' },
  comment: { icon: '💬', label: 'comentou no seu post' },
  follow:  { icon: '👤', label: 'começou a te seguir' },
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'agora'
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

const NotificationsPage = () => {
  const navigate = useNavigate()
  const currentUser = localStorage.getItem('currentUser')
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return }
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/notifications/${currentUser}`)
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
      await fetch(`/api/notifications/${currentUser}/read`, { method: 'PUT' })
    } catch {}
    setLoading(false)
  }

  const card = (isRead) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    marginBottom: '8px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: isRead ? 'rgba(255,255,255,0.03)' : 'rgba(0,212,255,0.07)',
    borderLeft: isRead ? '3px solid transparent' : '3px solid #00d4ff',
    cursor: 'pointer',
    transition: 'background 0.15s'
  })

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2137 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/home')}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px' }}
          >
            ←
          </button>
          <h1 style={{ color: 'white', margin: 0, fontSize: '20px' }}>Notificações</h1>
        </div>

        {loading && <p style={{ color: '#71767b', textAlign: 'center' }}>Carregando...</p>}

        {!loading && notifications.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔔</div>
            <p style={{ color: '#71767b' }}>Nenhuma notificação ainda.</p>
          </div>
        )}

        {notifications.map(notif => {
          const cfg = typeConfig[notif.type] || { icon: '🔔', label: notif.type }
          const target = notif.sender === currentUser ? '/perfil' : `/usuario/${notif.sender}`
          return (
            <div
              key={notif.id}
              style={card(notif.is_read)}
              onClick={() => navigate(target)}
            >
              {/* Avatar do remetente */}
              {notif.sender_avatar
                ? <img src={notif.sender_avatar} alt="" style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>👤</div>
              }

              {/* Ícone do tipo */}
              <div style={{ position: 'relative', marginLeft: '-22px', marginTop: '20px', flexShrink: 0 }}>
                <span style={{
                  background: notif.type === 'like' ? '#ff3040' : notif.type === 'comment' ? '#00d4ff' : '#8b5cf6',
                  borderRadius: '50%', width: '20px', height: '20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px'
                }}>
                  {cfg.icon}
                </span>
              </div>

              {/* Texto */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'white', margin: 0, fontSize: '14px' }}>
                  <strong style={{ color: '#00d4ff' }}>@{notif.sender}</strong>{' '}
                  <span style={{ color: '#ccc' }}>{cfg.label}</span>
                </p>
                {notif.message && (
                  <p style={{ color: '#71767b', margin: '3px 0 0', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{notif.message}"
                  </p>
                )}
              </div>

              {/* Tempo */}
              <span style={{ color: '#71767b', fontSize: '12px', flexShrink: 0 }}>
                {timeAgo(notif.created_at)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NotificationsPage
