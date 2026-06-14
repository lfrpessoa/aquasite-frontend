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
      const res = await fetch(`http://localhost:4000/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data)
    } catch {
      setResults({ users: [], posts: [] })
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a1628 0%, #1a3a5c 50%, #0d2137 100%)', padding: '20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px' }}
          >
            ←
          </button>
          <h1 style={{ color: 'white', margin: 0, fontSize: '22px' }}>Pesquisar</h1>
        </div>

        {/* Barra de pesquisa */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar usuários ou posts..."
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '24px',
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(0,212,255,0.3)',
              color: 'white', fontSize: '15px', outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 24px', borderRadius: '24px', background: '#00d4ff',
              border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px'
            }}
          >
            Buscar
          </button>
        </form>

        {loading && <p style={{ color: '#00d4ff', textAlign: 'center' }}>Buscando...</p>}

        {results && (
          <>
            {/* Usuários */}
            {results.users.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ color: '#00d4ff', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(0,212,255,0.2)', paddingBottom: '8px' }}>
                  Usuários encontrados
                </h2>
                {results.users.map((user) => (
                  <div
                    key={user.username}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
                      padding: '14px', marginBottom: '10px',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    {user.avatar
                      ? <img src={user.avatar} alt="avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                      : <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0,212,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>👤</div>
                    }
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'white', margin: 0, fontWeight: 'bold' }}>@{user.username}</p>
                      {user.bio && <p style={{ color: '#71767b', margin: '4px 0 0', fontSize: '13px' }}>{user.bio}</p>}
                    </div>
                    <Link
                      to={user.username === currentUser ? '/perfil' : `/usuario/${user.username}`}
                      style={{ color: '#00d4ff', fontSize: '13px', textDecoration: 'none', padding: '6px 12px', background: 'rgba(0,212,255,0.1)', borderRadius: '16px', whiteSpace: 'nowrap' }}
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
                <h2 style={{ color: '#00d4ff', fontSize: '16px', marginBottom: '12px', borderBottom: '1px solid rgba(0,212,255,0.2)', paddingBottom: '8px' }}>
                  Posts encontrados
                </h2>
                {results.posts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      background: 'rgba(255,255,255,0.05)', borderRadius: '12px',
                      padding: '16px', marginBottom: '10px',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <p style={{ color: '#00d4ff', margin: '0 0 6px', fontWeight: 'bold', fontSize: '14px' }}>{post.user}</p>
                    <p style={{ color: 'white', margin: 0, fontSize: '15px' }}>{post.content}</p>
                    {post.image && (
                      <img src={post.image} alt="post" style={{ width: '100%', borderRadius: '8px', marginTop: '10px', maxHeight: '200px', objectFit: 'cover' }} />
                    )}
                    <p style={{ color: '#71767b', margin: '8px 0 0', fontSize: '13px' }}>♥ {post.likes} · {post.time}</p>
                  </div>
                ))}
              </div>
            )}

            {results.users.length === 0 && results.posts.length === 0 && (
              <p style={{ color: '#71767b', textAlign: 'center', marginTop: '40px' }}>Nenhum resultado encontrado para "{query}".</p>
            )}
          </>
        )}

        {!results && !loading && (
          <p style={{ color: '#71767b', textAlign: 'center', marginTop: '60px' }}>
            Digite algo para pesquisar usuários ou posts.
          </p>
        )}
      </div>
    </div>
  )
}

export default SearchPage
