import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { API_URL } from '../config.js'

const UserProfilePage = () => {
  const { username } = useParams()
  const navigate = useNavigate()
  const currentUser = localStorage.getItem('currentUser')
  const [stats, setStats] = useState({ postsCount: 0, followersCount: 0, followingCount: 0, bio: '', avatar: null })
  const [posts, setPosts] = useState([])
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [commentInputs, setCommentInputs] = useState({})
  const [showComments, setShowComments] = useState({})
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return }
    if (username === currentUser) { navigate('/perfil'); return }
    loadData()
    intervalRef.current = setInterval(() => loadPostsAndStats(), 15000)
    return () => clearInterval(intervalRef.current)
  }, [username])

  const loadData = async () => {
    setLoading(true)
    const [statsRes, postsRes, followRes] = await Promise.allSettled([
      fetch(`${API_URL}/api/users/${username}/stats`).then(r => r.json()),
      fetch(`${API_URL}/api/users/${username}/posts`).then(r => r.json()),
      fetch(`${API_URL}/api/users/${username}/follow-status?viewer=${currentUser}`).then(r => r.json())
    ])
    if (statsRes.status === 'fulfilled') setStats(statsRes.value)
    if (postsRes.status === 'fulfilled' && Array.isArray(postsRes.value)) setPosts(postsRes.value)
    if (followRes.status === 'fulfilled') setFollowing(followRes.value.following)
    setLoading(false)
  }

  const loadPostsAndStats = async () => {
    const [statsRes, postsRes] = await Promise.allSettled([
      fetch(`${API_URL}/api/users/${username}/stats`).then(r => r.json()),
      fetch(`${API_URL}/api/users/${username}/posts`).then(r => r.json())
    ])
    if (statsRes.status === 'fulfilled') setStats(statsRes.value)
    if (postsRes.status === 'fulfilled' && Array.isArray(postsRes.value)) setPosts(postsRes.value)
  }

  const toggleFollow = async () => {
    if (followLoading) return
    setFollowLoading(true)
    try {
      const method = following ? 'DELETE' : 'POST'
      const res = await fetch(`${API_URL}/api/users/${username}/follow`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follower: currentUser })
      })
      const data = await res.json()
      if (data.success !== false) {
        const wasFollowing = following
        setFollowing(!wasFollowing)
        setStats(prev => ({ ...prev, followersCount: prev.followersCount + (wasFollowing ? -1 : 1) }))
      }
    } catch {}
    setFollowLoading(false)
  }

  const handleLike = async (postId) => {
    const res = await fetch(`${API_URL}/api/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: currentUser })
    })
    const data = await res.json()
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: data.likes } : p))
  }

  const handleComment = async (postId) => {
    const text = commentInputs[postId]
    if (!text?.trim()) return
    const res = await fetch(`${API_URL}/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: currentUser, text })
    })
    const comment = await res.json()
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p))
    setCommentInputs(prev => ({ ...prev, [postId]: '' }))
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #020e1e 0%, #011628 40%, #012233 70%, #013344 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(0,212,255,0.7)', fontSize: '0.9rem', letterSpacing: '0.5px' }}>Carregando perfil...</div>
    </div>
  )

  const cardStyle = {
    background: 'rgba(0, 20, 45, 0.75)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.07)',
    padding: '1.25rem 1.4rem',
    marginBottom: '1rem',
    transition: 'all 0.2s ease',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #020e1e 0%, #011628 40%, #012233 70%, #013344 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)',
              color: '#00d4ff', borderRadius: '50%', width: '38px', height: '38px',
              cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all 0.2s ease'
            }}
          >←</button>
          <h1 style={{ color: 'rgba(240,249,255,0.9)', margin: 0, fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.2px' }}>@{username}</h1>
        </div>

        {/* Profile card */}
        <div style={{ ...cardStyle, display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap', padding: '1.5rem' }}>
          {stats.avatar
            ? <img src={stats.avatar} alt="avatar" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.35)', flexShrink: 0 }} />
            : <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,60,100,0.8), rgba(0,100,150,0.5))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', border: '2px solid rgba(0,212,255,0.25)', flexShrink: 0 }}>👤</div>
          }
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ color: '#f0f9ff', margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.2px' }}>@{username}</h2>
            {stats.bio && <p style={{ color: 'rgba(200,230,240,0.6)', margin: '0 0 12px', fontSize: '0.875rem', lineHeight: 1.5 }}>{stats.bio}</p>}
            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ color: '#f0f9ff', fontSize: '0.875rem' }}>
                <strong style={{ color: '#00d4ff', fontSize: '1rem' }}>{stats.postsCount}</strong>
                <span style={{ color: 'rgba(200,230,240,0.45)', marginLeft: '4px' }}>posts</span>
              </span>
              <span style={{ color: '#f0f9ff', fontSize: '0.875rem' }}>
                <strong style={{ color: '#00d4ff', fontSize: '1rem' }}>{stats.followersCount}</strong>
                <span style={{ color: 'rgba(200,230,240,0.45)', marginLeft: '4px' }}>seguidores</span>
              </span>
              <span style={{ color: '#f0f9ff', fontSize: '0.875rem' }}>
                <strong style={{ color: '#00d4ff', fontSize: '1rem' }}>{stats.followingCount}</strong>
                <span style={{ color: 'rgba(200,230,240,0.45)', marginLeft: '4px' }}>seguindo</span>
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={toggleFollow}
              disabled={followLoading}
              style={{
                padding: '8px 20px',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: following ? '1px solid rgba(0,212,255,0.4)' : 'none',
                background: following ? 'rgba(0,212,255,0.08)' : 'linear-gradient(135deg, #00b8e0, #0070aa)',
                color: following ? '#00d4ff' : 'white',
                cursor: followLoading ? 'not-allowed' : 'pointer',
                opacity: followLoading ? 0.6 : 1,
                transition: 'all 0.2s ease',
                boxShadow: following ? 'none' : '0 4px 14px rgba(0,184,224,0.25)',
                letterSpacing: '0.2px'
              }}
            >
              {followLoading ? '...' : following ? 'Seguindo' : 'Seguir'}
            </button>
            <Link
              to={`/mensagens/${username}`}
              style={{
                padding: '8px 20px', borderRadius: '50px',
                background: 'rgba(255,255,255,0.07)', color: 'rgba(200,230,240,0.8)',
                textAlign: 'center', textDecoration: 'none', fontSize: '0.85rem',
                fontWeight: 600, border: '1px solid rgba(255,255,255,0.12)',
                transition: 'all 0.2s ease', letterSpacing: '0.1px'
              }}
            >
              Mensagem
            </Link>
          </div>
        </div>

        {/* Posts section */}
        <h3 style={{ color: '#00d4ff', margin: '20px 0 12px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Posts</h3>
        {posts.length === 0 && (
          <p style={{ color: 'rgba(200,230,240,0.35)', fontSize: '0.875rem', padding: '1rem 0', textAlign: 'center' }}>Nenhum post ainda.</p>
        )}
        {posts.map(post => (
          <div key={post.id} style={{ ...cardStyle }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
              <span style={{ color: '#00d4ff', fontWeight: 700, fontSize: '0.9rem' }}>{post.user}</span>
              <span style={{ color: 'rgba(200,230,240,0.35)', fontSize: '0.78rem' }}>{post.time}</span>
            </div>
            <p style={{ color: 'rgba(240,249,255,0.88)', margin: '0 0 12px', lineHeight: 1.65, fontSize: '0.95rem' }}>{post.content}</p>
            {post.image && (
              <img src={post.image} alt="post" style={{ width: '100%', borderRadius: '10px', marginBottom: '12px', maxHeight: '300px', objectFit: 'cover' }} />
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleLike(post.id)}
                style={{ background: 'rgba(255,107,157,0.07)', border: '1px solid rgba(255,107,157,0.2)', color: '#ff6b9d', cursor: 'pointer', fontSize: '0.8rem', padding: '5px 12px', borderRadius: '50px', fontWeight: 500, transition: 'all 0.2s ease' }}
              >♥ {post.likes}</button>
              <button
                onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(200,230,240,0.65)', cursor: 'pointer', fontSize: '0.8rem', padding: '5px 12px', borderRadius: '50px', fontWeight: 500, transition: 'all 0.2s ease' }}
              >
                💬 {post.comments.length}
              </button>
            </div>
            {showComments[post.id] && (
              <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                {post.comments.map(c => (
                  <div key={c.id} style={{ marginBottom: '6px', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    <strong style={{ color: '#00d4ff' }}>{c.user}: </strong>
                    <span style={{ color: 'rgba(220,240,250,0.75)' }}>{c.text}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <input
                    value={commentInputs[post.id] || ''}
                    onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyPress={e => e.key === 'Enter' && handleComment(post.id)}
                    placeholder="Comentar..."
                    style={{ flex: 1, padding: '7px 14px', borderRadius: '50px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    style={{ padding: '7px 16px', background: 'linear-gradient(135deg, #00b8e0, #0070aa)', border: 'none', borderRadius: '50px', color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                  >Enviar</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserProfilePage
