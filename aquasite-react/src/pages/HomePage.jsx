import React, { useState, useEffect, useRef } from 'react'
import { getPosts, createPost as apiCreatePost, likePost as apiLikePost, addComment as apiAddComment } from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import { API_URL } from '../config.js'

const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const intervalRef = useRef(null);

  const loadPosts = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await getPosts();
      setPosts(data);
    } catch (e) {
      if (!silent) setError('Falha ao carregar posts');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
    intervalRef.current = setInterval(() => loadPosts(true), 15000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const addPost = async (content, image = null) => {
    const currentUser = localStorage.getItem('currentUser');
    try {
      const created = await apiCreatePost({ user: `@${currentUser}`, content, image });
      setPosts([created, ...posts]);
    } catch (e) {
      setError('Falha ao criar post');
    }
  };

  const likePost = async (id) => {
    const currentUser = localStorage.getItem('currentUser');
    try {
      const updated = await apiLikePost(id, currentUser);
      setPosts(posts.map(post =>
        post.id === id ? { ...post, likes: updated.likes } : post
      ));
    } catch (e) {
      setError('Falha ao curtir');
    }
  };

  const addComment = async (postId, comment) => {
    const currentUser = localStorage.getItem('currentUser');
    try {
      const created = await apiAddComment(postId, { user: currentUser, text: comment });
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, comments: [...post.comments, created] } : post
      ));
    } catch (e) {
      setError('Falha ao comentar');
    }
  };

  const deletePost = async (id) => {
    const currentUser = localStorage.getItem('currentUser');
    try {
      const res = await fetch(`${API_URL}/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser })
      });
      const data = await res.json();
      if (data.success) setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      setError('Falha ao deletar post');
    }
  };

  return { posts, addPost, likePost, addComment, deletePost, loading, error };
};

const Post = ({ post, onLike, onComment, onDelete, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Apagar este post?')) return;
    setDeleting(true);
    await onDelete(post.id);
    setDeleting(false);
  };

  const rawUser = post.user?.startsWith('@') ? post.user.slice(1) : post.user;
  const isOwn = rawUser === currentUser;

  return (
    <div className="post">
      <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0 }}>
            <Link
              to={isOwn ? '/perfil' : `/usuario/${rawUser}`}
              style={{ color: '#00d4ff', textDecoration: 'none' }}
            >
              {post.user}
            </Link>
          </h3>
          <span className="post-time">{post.time}</span>
        </div>
        {isOwn && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Apagar post"
            style={{ background: 'none', border: 'none', color: '#ff4444', cursor: deleting ? 'not-allowed' : 'pointer', fontSize: '16px', padding: '4px 8px', opacity: deleting ? 0.5 : 1 }}
          >
            🗑️
          </button>
        )}
      </div>
      <p>{post.content}</p>
      {post.image && <img src={post.image} alt="Post" style={{ width: '100%', borderRadius: '8px', marginTop: '12px' }} />}
      <div className="post-actions">
        <button onClick={() => onLike(post.id)} className="like-btn">
          ♥ {post.likes}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="comment-btn">
          Comentar ({post.comments.length})
        </button>
        <button className="share-btn">Compartilhar</button>
      </div>
      {showComments && (
        <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          {post.comments.map(comment => (
            <div key={comment.id} style={{ marginBottom: '8px', fontSize: '14px' }}>
              <strong style={{ color: '#00d4ff' }}>{comment.user}: </strong>
              {comment.text}
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Comentário..."
              style={{ flex: 1, padding: '6px 12px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
            />
            <button 
              onClick={handleComment}
              style={{ padding: '6px 12px', background: '#00d4ff', color: 'white', border: 'none', borderRadius: '16px', cursor: 'pointer' }}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const CreatePost = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const currentUser = localStorage.getItem('currentUser');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() || imagePreview) {
      onSubmit(content, imagePreview);
      setContent('');
      setImagePreview(null);
    }
  };

  return (
    <div className="create-post">
      <h3>O que você está pensando, {currentUser}?</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Compartilhe algo sobre o oceano..."
          rows={3}
        />
        {imagePreview && (
          <div className="image-preview" style={{ position: 'relative' }}>
            <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />
            <button 
              type="button" 
              onClick={() => setImagePreview(null)}
              style={{ position: 'absolute', top: '15px', right: '5px', background: 'rgba(0,0,0,0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
        )}
        <div className="post-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label 
            htmlFor="image-upload"
            style={{ cursor: 'pointer', padding: '8px 16px', background: 'rgba(0,212,255,0.2)', borderRadius: '20px', color: '#00d4ff', border: 'none' }}
          >
            📷 Foto
          </label>
          <button type="submit" className="post-btn">Publicar •</button>
        </div>
      </form>
    </div>
  );
};

const Sidebar = () => {
  const [weather] = useState({ temp: '24°C', condition: 'Ondas calmas' });

  return (
    <div className="sidebar">
      <div className="widget weather-widget">
        <h4>Condições do Mar</h4>
        <p>{weather.temp}</p>
        <p>{weather.condition}</p>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { posts, addPost, likePost, addComment, deletePost, loading, error } = usePosts();
  const [currentUser, setCurrentUser] = useState('');
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      navigate('/login');
    } else {
      setCurrentUser(user);
    }
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchUnread = async () => {
      try {
        const res = await fetch(`${API_URL}/api/notifications/${currentUser}/unread-count`);
        const data = await res.json();
        setUnreadNotifs(data.count || 0);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 20000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const logout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (!currentUser) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>AquaSite</h1>
          <nav>
<Link to="/pesquisar">• Pesquisar</Link>
<Link to="/curiosidades">• Curiosidades</Link>
            <Link to="/mensagens">• Mensagens</Link>
            <Link to="/notificacoes" style={{ position: 'relative', display: 'inline-block' }}>
              🔔
              {unreadNotifs > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-10px',
                  background: '#ff3040', color: 'white', borderRadius: '50%',
                  fontSize: '10px', minWidth: '16px', height: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', padding: '0 2px'
                }}>
                  {unreadNotifs > 9 ? '9+' : unreadNotifs}
                </span>
              )}
            </Link>
            <Link to="/perfil">• Perfil</Link>
            <span className="user-info">Olá, {currentUser}!</span>
            <button onClick={logout} className="logout-btn">→ Sair</button>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <div className="feed-container">
          <CreatePost onSubmit={addPost} />
          <div className="posts-feed">
            {loading && <div className="loading">Carregando feed...</div>}
            {error && <div className="error" style={{ color: '#ff6b6b' }}>{error}</div>}
            {!loading && posts.map(post => (
              <Post
                key={post.id}
                post={post}
                onLike={likePost}
                onComment={addComment}
                onDelete={deletePost}
                currentUser={currentUser}
              />
            ))}
          </div>
        </div>
        <Sidebar />
      </main>
    </div>
  );
};

export default HomePage