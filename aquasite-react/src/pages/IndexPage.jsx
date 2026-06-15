import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './TwitterLayout.css'
import { API_URL } from '../config.js'

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Explore o Mundo Marinho",
      subtitle: "Descubra as maravilhas dos oceanos"
    },
    {
      title: "Vida Submarina",
      subtitle: "Conheça criaturas incríveis"
    },
    {
      title: "Conservação Oceânica",
      subtitle: "Proteja nossos mares"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">{slides[currentSlide].title}</h1>
          <p className="hero-subtitle">{slides[currentSlide].subtitle}</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">Começar Jornada</Link>
            <Link to="/curiosidades" className="btn btn-secondary">Explorar Agora</Link>
          </div>
        </div>
      </div>
      <div className="hero-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

const StatsSection = () => {
  const [stats, setStats] = useState([
    { number: 0, target: 71, label: "% da Terra é oceano" },
    { number: 0, target: 230000, label: "Espécies marinhas conhecidas" },
    { number: 0, target: 95, label: "% dos oceanos inexplorados" },
    { number: 0, target: 1000, label: "Usuários ativos" }
  ]);

  useEffect(() => {
    const timers = stats.map((stat, index) => {
      return setInterval(() => {
        setStats(prevStats => {
          const newStats = [...prevStats];
          if (newStats[index].number < newStats[index].target) {
            const increment = Math.ceil(newStats[index].target / 100);
            newStats[index].number = Math.min(
              newStats[index].number + increment,
              newStats[index].target
            );
          }
          return newStats;
        });
      }, 50);
    });

    return () => timers.forEach(timer => clearInterval(timer));
  }, []);

  return (
    <section className="stats-section">
      <div className="container">
        <h2 className="section-title">Oceanos em Números</h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number">{stat.number.toLocaleString('pt-BR')}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: "Vida Marinha",
      description: "Explore milhares de espécies marinhas com informações detalhadas e curiosidades fascinantes."
    },
    {
      title: "Ecossistemas",
      description: "Descubra diferentes ecossistemas oceânicos e sua importância para o planeta."
    },
    {
      title: "Educação",
      description: "Aprenda sobre conservação marinha e como proteger nossos oceanos."
    },
    {
      title: "Comunidade",
      description: "Conecte-se com outros entusiastas da vida marinha e compartilhe experiências."
    },
    {
      title: "Galeria",
      description: "Veja imagens incríveis do mundo submarino capturadas por mergulhadores."
    },
    {
      title: "Missões",
      description: "Participe de desafios educativos e contribua para a pesquisa marinha."
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="section-title">Recursos do AquaSite</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Marina Silva",
      role: "Bióloga Marinha",
      text: "O AquaSite é uma ferramenta incrível para educação marinha. Uso com meus alunos!",
      avatar: "👩🔬"
    },
    {
      name: "João Santos",
      role: "Mergulhador",
      text: "Encontrei informações valiosas sobre espécies que encontro em meus mergulhos.",
      avatar: "🤿"
    },
    {
      name: "Ana Costa",
      role: "Estudante",
      text: "Aprendi muito sobre conservação oceânica. O conteúdo é muito bem organizado!",
      avatar: "👩🎓"
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2 className="section-title">O que dizem sobre nós</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-avatar">{testimonial.avatar}</div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HeaderMelhorado = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header-melhorado">
      <div className="header-container">
        <div className="logo-container">
          <img src="./img/logo.png" alt="AquaSite Logo" className="logo" />
          <span className="logo-text">AquaSite</span>
        </div>
        <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/">• Início</Link>
          <Link to="/sobre">• Sobre</Link>
          <Link to="/curiosidades">• Explorar</Link>
          <a href="http://wa.me/551140028922">• Contato</a>
        </nav>
        <div className="header-actions">
          <Link to="/login" className="btn-login">→ Entrar</Link>
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

const FooterMelhorado = () => {
  return (
    <footer className="footer-melhorado">
      <div className="footer-container">
        <div className="footer-section">
          <h3>AquaSite</h3>
          <p>Explorando os mistérios dos oceanos e promovendo a conservação marinha.</p>
        </div>
        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul>
            <li><Link to="/sobre">Sobre</Link></li>
            <li><Link to="/curiosidades">Curiosidades</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contato</h4>
          <p>contato@aquasite.com</p>
          <p>(11) 4002-8922</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 AquaSite. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [login, setLogin] = useState('')
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [statusMsg, setStatusMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const resetForm = () => {
    setLogin(''); setNomeUsuario(''); setEmail(''); setPassword(''); setBio(''); setAvatar(null); setStatusMsg('')
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatar(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        if (!login.trim() || !password) {
          setStatusMsg('Preencha todos os campos.')
          setIsLoading(false)
          return
        }
        const res = await fetch(`${API_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login, password })
        })
        const data = await res.json()
        if (data.success) {
          localStorage.setItem('currentUser', data.user.username)
          localStorage.setItem('userEmail', data.user.email)
          setStatusMsg(`✓ Bem-vindo, ${data.user.username}!`)
          setTimeout(() => navigate('/home'), 1200)
        } else {
          setStatusMsg(`⚠ ${data.error}`)
        }
      } else {
        if (!nomeUsuario.trim() || !email.trim() || !password) {
          setStatusMsg('Preencha todos os campos.')
          setIsLoading(false)
          return
        }
        if (!/^[a-zA-Z0-9_.]+$/.test(nomeUsuario)) {
          setStatusMsg('⚠ Nome de usuário só pode ter letras, números, _ e .')
          setIsLoading(false)
          return
        }
        if (!/.+@.+\..+/.test(email)) {
          setStatusMsg('⚠ Informe um email válido.')
          setIsLoading(false)
          return
        }
        const res = await fetch(`${API_URL}/api/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: nomeUsuario, email, password, bio, avatar })
        })
        const data = await res.json()
        if (data.success) {
          localStorage.setItem('currentUser', nomeUsuario)
          localStorage.setItem('userEmail', email)
          setStatusMsg('✓ Conta criada com sucesso!')
          setTimeout(() => navigate('/home'), 1200)
        } else {
          setStatusMsg(`⚠ ${data.error}`)
        }
      }
    } catch {
      setStatusMsg('⚠ Erro de conexão. Verifique se o servidor está rodando.')
    }

    setIsLoading(false)
  }

  return (
    <div className="login-card-twitter">
      <div className="twitter-logo">🌊</div>

      <h1 className="main-heading">Explore o mundo marinho</h1>

      <h2 className="sub-heading">{isLogin ? 'Entre no AquaSite' : 'Crie sua conta'}</h2>

      <form onSubmit={handleSubmit} className="login-form-twitter">
        {isLogin ? (
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Nome de usuário ou email"
            required
          />
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }}>
                {avatar
                  ? <img src={avatar} alt="avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00d4ff' }} />
                  : <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,212,255,0.15)', border: '2px dashed #00d4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>📷</div>
                }
              </label>
              <span style={{ fontSize: '12px', color: '#71767b' }}>Foto de perfil (opcional)</span>
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </div>
            <input
              type="text"
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              placeholder="Nome de usuário"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Biografia (opcional)"
              rows={3}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', resize: 'none', fontSize: '14px' }}
            />
          </>
        )}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />

        <button type="submit" className="btn-submit-twitter" disabled={isLoading}>
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span className="spinner"></span>
              {isLogin ? 'Entrando...' : 'Criando...'}
            </span>
          ) : (
            isLogin ? 'Entrar' : 'Criar conta'
          )}
        </button>
      </form>

      {statusMsg && (
        <div className="status-msg-twitter">{statusMsg}</div>
      )}

      <div className="toggle-section-twitter">
        <p style={{ color: '#71767b', marginBottom: '1rem' }}>
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        </p>
        <button
          onClick={() => { setIsLogin(!isLogin); resetForm(); }}
          className="toggle-btn"
        >
          {isLogin ? 'Inscrever-se' : 'Entrar'}
        </button>
      </div>
      
      <Link to="/curiosidades" className="btn-explore">
        Explorar sem fazer login
      </Link>
    </div>
  )
}

const IndexPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [clickBubbles, setClickBubbles] = useState([])
  const slides = [
    { title: "Explore o Mundo Marinho", subtitle: "Descubra as maravilhas dos oceanos" },
    { title: "Vida Submarina", subtitle: "Conheça criaturas incríveis" },
    { title: "Conservação Oceânica", subtitle: "Proteja nossos mares" }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newBubble = {
      id: Date.now(),
      x,
      y,
      size: Math.random() * 20 + 15
    }
    
    setClickBubbles(prev => [...prev, newBubble])
    
    setTimeout(() => {
      setClickBubbles(prev => prev.filter(bubble => bubble.id !== newBubble.id))
    }, 800)
  }

  return (
    <div className="twitter-layout">
      <div className="left-section" onClick={handleClick}>
        <div className="hero-content-twitter">
          <h1 className="hero-title-twitter">AquaSite</h1>
        </div>
        {clickBubbles.map(bubble => (
          <div
            key={bubble.id}
            className="click-bubble"
            style={{
              left: bubble.x,
              top: bubble.y,
              width: bubble.size,
              height: bubble.size
            }}
          />
        ))}
      </div>

      <div className="right-section">
        <LoginForm />
      </div>
    </div>
  )
};

export default IndexPage