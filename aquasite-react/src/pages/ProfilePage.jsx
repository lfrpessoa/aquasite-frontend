import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = useState('');
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    bio: '',
    joinDate: '',
    postsCount: 0,
    followersCount: 0,
    followingCount: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState('');
  const [posts, setPosts] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
    } else {
      setCurrentUser(user);
      loadUserProfile(user);
      loadPosts(user);
    }
  }, [navigate]);

  const loadUserProfile = async (username) => {
    try {
      const res = await fetch(`https://aquasite-main-1.onrender.com/api/users/${username}/stats`);
      const stats = await res.json();
      setUserProfile({
        username,
        email: stats.email || localStorage.getItem('userEmail') || '',
        bio: stats.bio || 'Apaixonado pela vida marinha e conservação dos oceanos.',
        avatar: stats.avatar || null,
        joinDate: stats.joinDate || new Date().toLocaleDateString('pt-BR'),
        postsCount: stats.postsCount,
        followersCount: stats.followersCount,
        followingCount: stats.followingCount
      });
    } catch {
      setUserProfile({
        username,
        email: localStorage.getItem('userEmail') || '',
        bio: localStorage.getItem(`bio_${username}`) || 'Apaixonado pela vida marinha e conservação dos oceanos.',
        joinDate: new Date().toLocaleDateString('pt-BR'),
        postsCount: 0,
        followersCount: 0,
        followingCount: 0
      });
    }
  };

  const loadPosts = async (username) => {
    try {
      const res = await fetch(`https://aquasite-main-1.onrender.com/api/users/${username}/posts`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {}
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Apagar este post?')) return;
    try {
      const res = await fetch(`https://aquasite-main-1.onrender.com/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setUserProfile(prev => ({ ...prev, postsCount: prev.postsCount - 1 }));
      }
    } catch {}
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`https://aquasite-main-1.onrender.com/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser })
      });
      const data = await res.json();
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: data.likes } : p));
    } catch {}
  };

  const handleComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    try {
      const res = await fetch(`https://aquasite-main-1.onrender.com/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, text })
      });
      const comment = await res.json();
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch {}
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userProfile });
  };

  const handleSave = async () => {
    try {
      await fetch(`https://aquasite-main-1.onrender.com/api/users/${currentUser}/bio`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: editData.bio, currentUser })
      });
    } catch {}
    setUserProfile(prev => ({ ...prev, bio: editData.bio }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const updateUsername = async () => {
    if (!newUsername.trim()) {
      setUsernameStatus('Digite um novo username');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:4000/api/users/username', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUsername: currentUser,
          newUsername: newUsername.trim()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('currentUser', data.newUsername);
        setCurrentUser(data.newUsername);
        setUserProfile(prev => ({ ...prev, username: data.newUsername }));
        localStorage.setItem(`profile_${data.newUsername}`, JSON.stringify({
          ...userProfile,
          username: data.newUsername
        }));
        setIsEditingUsername(false);
        setNewUsername('');
        setUsernameStatus('Username atualizado com sucesso!');
        setTimeout(() => setUsernameStatus(''), 3000);
      } else {
        setUsernameStatus(data.error);
      }
    } catch (error) {
      setUsernameStatus('Erro de conexão. Tente novamente.');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const newAvatar = ev.target.result;
      setUserProfile(prev => ({ ...prev, avatar: newAvatar }));
      try {
        await fetch(`https://aquasite-main-1.onrender.com/api/users/${currentUser}/avatar`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar: newAvatar, currentUser })
        });
      } catch {}
    };
    reader.readAsDataURL(file);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  return (
    <div className="perfil-app">
      <div className="perfil-container-melhorado">
        <button 
          className="btn-voltar-perfil" 
          onClick={() => navigate(-1)}
        >
          ← Voltar
        </button>

        <div className="perfil-header">
          <div className="avatar-section">
            <div className="avatar-container">
              <label htmlFor="avatar-edit" style={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }} title="Clique para trocar a foto">
                {userProfile.avatar
                  ? <img src={userProfile.avatar} alt="avatar" className="avatar-melhorado" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                  : <div className="avatar-melhorado">👤</div>
                }
                <span style={{ position: 'absolute', bottom: 0, right: 0, background: '#00d4ff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>📷</span>
              </label>
              <input id="avatar-edit" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
              <div className="status-indicator"></div>
            </div>
          </div>
          <div className="user-info">
            {isEditingUsername ? (
              <div className="username-edit">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Novo username"
                  className="edit-input"
                />
                <div className="username-actions">
                  <button onClick={updateUsername} className="save-username-btn">Salvar</button>
                  <button onClick={() => {
                    setIsEditingUsername(false);
                    setNewUsername('');
                    setUsernameStatus('');
                  }} className="cancel-username-btn">Cancelar</button>
                </div>
              </div>
            ) : (
              <h1 onClick={() => setIsEditingUsername(true)} style={{cursor: 'pointer'}} title="Clique para editar">
                {userProfile.username} ✏️
              </h1>
            )}
            <p className="join-date">Membro desde {userProfile.joinDate}</p>
            {usernameStatus && (
              <p className="username-status" style={{color: usernameStatus.includes('sucesso') ? '#4ecdc4' : '#ff6b6b'}}>
                {usernameStatus}
              </p>
            )}
          </div>
          <div className="profile-actions">
            <button 
              className="edit-btn-corner"
              onClick={isEditing ? handleSave : handleEdit}
            >
              {isEditing ? '💾' : '✏️'}
            </button>
            {isEditing && (
              <button 
                className="cancel-btn-corner"
                onClick={handleCancel}
              >
                ❌
              </button>
            )}
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-number">{userProfile.postsCount}</span>
            <span className="stat-label">Posts</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{userProfile.followersCount}</span>
            <span className="stat-label">Seguidores</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{userProfile.followingCount}</span>
            <span className="stat-label">Seguindo</span>
          </div>
        </div>

        <div className="profile-content">
          <div className="info-card">
            <h3>Email</h3>
            <p>{userProfile.email || localStorage.getItem('userEmail') || '—'}</p>
          </div>

          <div className="info-card">
            <h3>Biografia</h3>
            {isEditing ? (
              <textarea
                value={editData.bio || ''}
                onChange={(e) => setEditData({...editData, bio: e.target.value})}
                className="edit-textarea"
                rows={4}
              />
            ) : (
              <p>{userProfile.bio}</p>
            )}
          </div>

          <div className="achievements-card">
            <h3>Conquistas</h3>
            <div className="achievements-grid">
              <div className="achievement">
                <span>🐠 Explorador</span>
                <small>Vida Marinha</small>
              </div>
              <div className="achievement">
                <span>🌊 Oceânico</span>
                <small>Ecossistemas</small>
              </div>
              <div className="achievement">
                <span>📚 Estudioso</span>
                <small>Educação</small>
              </div>
              <div className="achievement">
                <span>🛡️ Conservador</span>
                <small>Conservação</small>
              </div>
            </div>
          </div>

          {/* Meus Posts */}
          <div className="info-card" style={{ padding: 0, overflow: 'hidden' }}>
            <h3 style={{ padding: '16px 20px', margin: 0, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              Meus Posts
            </h3>
            {posts.length === 0 ? (
              <p style={{ color: '#71767b', padding: '20px', textAlign: 'center', margin: 0 }}>
                Você ainda não publicou nada.
              </p>
            ) : (
              posts.map(post => (
                <div key={post.id} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ color: '#71767b', fontSize: '13px' }}>{post.time}</span>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      title="Apagar post"
                      style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '15px', padding: '0 4px' }}
                    >
                      🗑️
                    </button>
                  </div>
                  <p style={{ color: 'white', margin: '0 0 10px', lineHeight: 1.5 }}>{post.content}</p>
                  {post.image && (
                    <img src={post.image} alt="post" style={{ width: '100%', borderRadius: '8px', marginBottom: '10px', maxHeight: '260px', objectFit: 'cover' }} />
                  )}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button
                      onClick={() => handleLike(post.id)}
                      style={{ background: 'none', border: 'none', color: '#ff6b9d', cursor: 'pointer', fontSize: '14px', padding: 0 }}
                    >
                      ♥ {post.likes}
                    </button>
                    <button
                      onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                      style={{ background: 'none', border: 'none', color: '#71767b', cursor: 'pointer', fontSize: '14px', padding: 0 }}
                    >
                      💬 {post.comments.length}
                    </button>
                  </div>
                  {showComments[post.id] && (
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      {post.comments.map(c => (
                        <div key={c.id} style={{ fontSize: '13px', marginBottom: '4px' }}>
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
                          style={{ flex: 1, padding: '6px 12px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '13px' }}
                        />
                        <button
                          onClick={() => handleComment(post.id)}
                          style={{ padding: '6px 12px', background: '#00d4ff', border: 'none', borderRadius: '16px', color: 'white', cursor: 'pointer', fontSize: '13px' }}
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="logout-section">
            <button className="logout-btn" onClick={logout}>
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage