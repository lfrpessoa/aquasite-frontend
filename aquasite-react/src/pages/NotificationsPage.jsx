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
      const res = await fetch(`https://aquasite-frontend.onrender.com/api/notifications/${currentUser}`)
      const data = await res.json()
      setNotifications(Array.isArray(data) ? data : [])
      await fetch(`https://aquasite-frontend.onrender.com/api/notifications/${currentUser}/read`, { method: 'PUT' })
    } catch {}
    setLoading(false)
  }

  const card = (isRead) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    marginBottom: '8px',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.07)',
    background: isRead ? 'rgba(0,20,45,0.7)' : 'rgba(0,212,255,0.07)',
    borderLeft: isRead ? '3px solid transparent' : '3px solid rgba(0,212,255,0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  })

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #020e1e 0%, #011628 40%, #012233 70%, #013344 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/home')}
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            ←
          </button>
          <h1 style={{ color: '#f0f9ff', margin: 0, fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.2px' }}>Notificações</h1>
        </div>

        {loading && <p style={{ color: 'rgba(200,230,240,0.4)', textAlign: 'center', fontSize: '0.875rem' }}>Carregando...</p>}

        {!loading && notifications.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <div style={{ fontSize: '42px', marginBottom: '12px', opacity: 0.4 }}>🔔</div>
            <p style={{ color: 'rgba(200,230,240,0.35)', fontSize: '0.875rem' }}>Nenhuma notificação ainda.</p>
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
                ? <img src={notif.sender_avatar} alt="" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(0,212,255,0.2)' }} />
                : <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,60,100,0.8), rgba(0,100,150,0.5))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, border: '1.5px solid rgba(0,212,255,0.15)' }}>👤</div>
              }

              {/* Ícone do tipo */}
              <div style={{ position: 'relative', marginLeft: '-22px', marginTop: '22px', flexShrink: 0 }}>
                <span style={{
                  background: notif.type === 'like' ? '#e11d48' : notif.type === 'comment' ? '#0077b6' : '#6d28d9',
                  borderRadius: '50%', width: '18px', height: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.4)'
                }}>
                  {cfg.icon}
                </span>
              </div>

              {/* Texto */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'rgba(240,249,255,0.9)', margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
                  <strong style={{ color: '#00d4ff' }}>@{notif.sender}</strong>{' '}
                  <span style={{ color: 'rgba(200,230,240,0.7)' }}>{cfg.label}</span>
                </p>
                {notif.message && (
                  <p style={{ color: 'rgba(200,230,240,0.4)', margin: '3px 0 0', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{notif.message}"
                  </p>
                )}
              </div>

              {/* Tempo */}
              <span style={{ color: 'rgba(200,230,240,0.35)', fontSize: '0.75rem', flexShrink: 0 }}>
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
