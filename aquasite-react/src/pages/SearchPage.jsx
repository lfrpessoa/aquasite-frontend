import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SearchPage = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const currentUser = localStorage.getItem('currentUser')

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`https://aquasite-main-1.onrender.com/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data)
    } catch {
      setResults({ users: [], posts: [] })
    }
    setLoading(false)
  }

  const sectionTitle = {
    color: '#00d4ff', fontSize: '0.75rem', fontWeight: 700,
    marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px',
    borderBottom: '1px solid rgba(0,212,255,0.15)', paddingBottom: '8px'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #020e1e 0%, #011628 40%, #012233 70%, #013344 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            ←
          </button>
          <h1 style={{ color: '#f0f9ff', margin: 0, fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.2px' }}>Pesquisar</h1>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar usuários ou posts..."
            style={{
              flex: 1, padding: '11px 18px', borderRadius: '50px',
              background: 'rgba(0,20,45,0.8)', border: '1px solid rgba(0,212,255,0.2)',
              color: 'white', fontSize: '0.9rem', outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(0,212,255,0.2)'}
          />
          <button
            type="submit"
            style={{
              padding: '11px 22px', borderRadius: '50px',
              background: 'linear-gradient(135deg, #00b8e0, #0070aa)',
              border: 'none', color: 'white', fontWeight: 700, cursor: 'pointer',
              fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(0,184,224,0.25)',
              letterSpacing: '0.2px', whiteSpace: 'nowrap'
            }}
          >
            Buscar
          </button>
        </form>

        {loading && <p style={{ color: 'rgba(0,212,255,0.6)', textAlign: 'center', fontSize: '0.875rem' }}>Buscando...</p>}

        {results && (
          <>
            {/* Users */}
            {results.users.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h2 style={sectionTitle}>Usuários</h2>
                {results.users.map((user) => (
                  <div
                    key={user.username}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      background: 'rgba(0,20,45,0.75)', borderRadius: '14px',
                      padding: '14px 16px', marginBottom: '8px',
                      border: '1px solid rgba(255,255,255,0.07)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {user.avatar
                      ? <img src={user.avatar} alt="avatar" style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(0,212,255,0.2)', flexShrink: 0 }} />
                      : <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,60,100,0.8), rgba(0,100,150,0.5))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, border: '1.5px solid rgba(0,212,255,0.15)' }}>👤</div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#f0f9ff', margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>@{user.username}</p>
                      {user.bio && <p style={{ color: 'rgba(200,230,240,0.45)', margin: '3px 0 0', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.bio}</p>}
                    </div>
                    <Link
                      to={user.username === currentUser ? '/perfil' : `/usuario/${user.username}`}
                      style={{
                        color: '#00d4ff', fontSize: '0.8rem', textDecoration: 'none',
                        padding: '6px 14px', background: 'rgba(0,212,255,0.08)',
                        borderRadius: '50px', whiteSpace: 'nowrap', fontWeight: 600,
                        border: '1px solid rgba(0,212,255,0.2)', flexShrink: 0
                      }}
                    >
                      Ver perfil
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Posts */}
            {results.posts.length > 0 && (
              <div>
                <h2 style={sectionTitle}>Posts</h2>
                {results.posts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      background: 'rgba(0,20,45,0.75)', borderRadius: '14px',
                      padding: '14px 16px', marginBottom: '8px',
                      border: '1px solid rgba(255,255,255,0.07)'
                    }}
                  >
                    <p style={{ color: '#00d4ff', margin: '0 0 6px', fontWeight: 700, fontSize: '0.875rem' }}>{post.user}</p>
                    <p style={{ color: 'rgba(240,249,255,0.88)', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>{post.content}</p>
                    {post.image && (
                      <img src={post.image} alt="post" style={{ width: '100%', borderRadius: '10px', marginTop: '10px', maxHeight: '200px', objectFit: 'cover' }} />
                    )}
                    <p style={{ color: 'rgba(200,230,240,0.35)', margin: '8px 0 0', fontSize: '0.78rem' }}>♥ {post.likes} · {post.time}</p>
                  </div>
                ))}
              </div>
            )}

            {results.users.length === 0 && results.posts.length === 0 && (
              <p style={{ color: 'rgba(200,230,240,0.35)', textAlign: 'center', marginTop: '48px', fontSize: '0.875rem' }}>
                Nenhum resultado para "{query}".
              </p>
            )}
          </>
        )}

        {!results && !loading && (
          <p style={{ color: 'rgba(200,230,240,0.25)', textAlign: 'center', marginTop: '60px', fontSize: '0.875rem' }}>
            Digite algo para pesquisar usuários ou posts.
          </p>
        )}
      </div>
    </div>
  )
}

export default SearchPage
