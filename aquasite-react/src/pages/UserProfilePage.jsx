import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

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
      fetch(`/api/users/${username}/stats`).then(r => r.json()),
      fetch(`/api/users/${username}/posts`).then(r => r.json()),
      fetch(`/api/users/${username}/follow-status?viewer=${currentUser}`).then(r => r.json())
    ])
    if (statsRes.status === 'fulfilled') setStats(statsRes.value)
    if (postsRes.status === 'fulfilled' && Array.isArray(postsRes.value)) setPosts(postsRes.value)
    if (followRes.status === 'fulfilled') setFollowing(followRes.value.following)
    setLoading(false)
  }

  const loadPostsAndStats = async () => {
    const [statsRes, postsRes] = await Promise.allSettled([
      fetch(`/api/users/${username}/stats`).then(r => r.json()),
      fetch(`/api/users/${username}/posts`).then(r => r.json())
    ])
    if (statsRes.status === 'fulfilled') setStats(statsRes.value)
    if (postsRes.status === 'fulfilled' && Array.isArray(postsRes.value)) setPosts(postsRes.value)
  }

  const toggleFollow = async () => {
    if (followLoading) return
    setFollowLoading(true)
    try {
      const method = following ? 'DELETE' : 'POST'
      const res = await fetch(`/api/users/${username}/follow`, {
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
    const res = await fetch(`/api/posts/${postId}/like`, {
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
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: currentUser, text })
    })
    const comment = await res.json()
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p))
    setCommentInputs(prev => ({ ...prev, [postId]: '' }))
  }

  const card = { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', marginBottom: '12px' }

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Carregando...</div>

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2137 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px' }}>←</button>
          <h1 style={{ color: 'white', margin: 0, fontSize: '20px' }}>@{username}</h1>
        </div>

        {/* Perfil */}
        <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {stats.avatar
            ? <img src={stats.avatar} alt="avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
            : <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>👤</div>
          }
          <div style={{ flex: 1 }}>
            <h2 style={{ color: 'white', margin: '0 0 4px' }}>@{username}</h2>
            {stats.bio && <p style={{ color: '#aaa', margin: '0 0 12px', fontSize: '14px' }}>{stats.bio}</p>}
            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ color: 'white' }}><strong>{stats.postsCount}</strong> <span style={{ color: '#71767b' }}>posts</span></span>
              <span style={{ color: 'white' }}><strong>{stats.followersCount}</strong> <span style={{ color: '#71767b' }}>seguidores</span></span>
              <span style={{ color: 'white' }}><strong>{stats.followingCount}</strong> <span style={{ color: '#71767b' }}>seguindo</span></span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={toggleFollow}
              disabled={followLoading}
              style={{
                padding: '8px 20px', borderRadius: '20px', fontWeight: 'bold',
                border: following ? '1px solid #00d4ff' : 'none',
                background: following ? 'transparent' : '#00d4ff',
                color: 'white',
                cursor: followLoading ? 'not-allowed' : 'pointer',
                opacity: followLoading ? 0.6 : 1,
                transition: 'opacity 0.15s'
              }}
            >
              {followLoading ? '...' : following ? 'Seguindo' : 'Seguir'}
            </button>
            <Link to={`/mensagens/${username}`} style={{ padding: '8px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)', color: 'white', textAlign: 'center', textDecoration: 'none', fontSize: '14px' }}>
              Mensagem
            </Link>
          </div>
        </div>

        {/* Posts */}
        <h3 style={{ color: '#00d4ff', margin: '24px 0 12px' }}>Posts</h3>
        {posts.length === 0 && <p style={{ color: '#71767b' }}>Nenhum post ainda.</p>}
        {posts.map(post => (
          <div key={post.id} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>{post.user}</span>
              <span style={{ color: '#71767b', fontSize: '13px' }}>{post.time}</span>
            </div>
            <p style={{ color: 'white', margin: '0 0 10px' }}>{post.content}</p>
            {post.image && <img src={post.image} alt="post" style={{ width: '100%', borderRadius: '8px', marginBottom: '10px', maxHeight: '300px', objectFit: 'cover' }} />}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => handleLike(post.id)} style={{ background: 'none', border: 'none', color: '#ff6b9d', cursor: 'pointer', fontSize: '14px' }}>♥ {post.likes}</button>
              <button onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))} style={{ background: 'none', border: 'none', color: '#71767b', cursor: 'pointer', fontSize: '14px' }}>
                💬 {post.comments.length}
              </button>
            </div>
            {showComments[post.id] && (
              <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                {post.comments.map(c => (
                  <div key={c.id} style={{ marginBottom: '6px', fontSize: '14px' }}>
                    <strong style={{ color: '#00d4ff' }}>{c.user}: </strong>
                    <span style={{ color: '#ccc' }}>{c.text}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <input
                    value={commentInputs[post.id] || ''}
                    onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                    onKeyPress={e => e.key === 'Enter' && handleComment(post.id)}
                    placeholder="Comentar..."
                    style={{ flex: 1, padding: '6px 12px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '14px' }}
                  />
                  <button onClick={() => handleComment(post.id)} style={{ padding: '6px 14px', background: '#00d4ff', border: 'none', borderRadius: '16px', color: 'white', cursor: 'pointer' }}>Enviar</button>
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
