import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [statusColor, setStatusColor] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isLogin) {
      if (!login.trim() || !password) {
        setStatusMsg('Preencha todos os campos.');
        setStatusColor('#ffa726');
        setIsLoading(false);
        return;
      }
    } else {
      if (!username.trim() || !email.trim() || !password) {
        setStatusMsg('Preencha todos os campos.');
        setStatusColor('#ffa726');
        setIsLoading(false);
        return;
      }
    }

    if (password.length < 3) {
      setStatusMsg('Senha deve ter pelo menos 3 caracteres.');
      setStatusColor('#ffa726');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const body = isLogin 
        ? { login, password }
        : { username, email, password };
      
      const response = await fetch(`http://localhost:4000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (isLogin) {
          localStorage.setItem('currentUser', data.user.username);
          localStorage.setItem('userEmail', data.user.email);
          setStatusMsg(`Bem-vindo, ${data.user.username}!`);
          setStatusColor('#4ecdc4');
          setTimeout(() => navigate('/home'), 1200);
        } else {
          localStorage.setItem('currentUser', username);
          localStorage.setItem('userEmail', email);
          setStatusMsg('Cadastro realizado com sucesso!');
          setStatusColor('#4ecdc4');
          setTimeout(() => navigate('/home'), 1200);
        }
      } else {
        setStatusMsg(data.error);
        setStatusColor('#ff6b6b');
      }
    } catch (error) {
      setStatusMsg('Erro de conexão. Tente novamente.');
      setStatusColor('#ff6b6b');
    }
    
    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setStatusMsg('');
    setPassword('');
    setLogin('');
    setUsername('');
    setEmail('');
  };

  return (
    <div className="login-app">
      <div className="login-container-melhorado">
        <div className="ocean-waves" />
        
        <button 
          className="btn-voltar-melhorado" 
          onClick={() => navigate(-1)}
          aria-label="Voltar"
        >
          ← Voltar
        </button>
        
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">• AquaSite</div>
            <h2>{isLogin ? 'Entrar' : 'Criar Conta'}</h2>
            <p>{isLogin ? 'Acesse sua conta no AquaSite' : 'Junte-se à comunidade oceânica'}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {isLogin ? (
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Username ou Email"
                required
                className="input-field"
              />
            ) : (
              <>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nome de usuário"
                  required
                  className="input-field"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="input-field"
                />
              </>
            )}
            
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
                className="input-field"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            
            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            </button>
          </form>
          
          <div className="toggle-section">
            <p>
              {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); toggleMode(); }}
                className="toggle-link"
              >
                {isLogin ? 'Cadastre-se' : 'Fazer Login'}
              </a>
            </p>
          </div>
          
          {statusMsg && (
            <div 
              className="status-message"
              style={{ color: statusColor }}
            >
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage