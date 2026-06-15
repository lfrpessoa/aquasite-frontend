import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

const getPasswordStrength = (pwd) => {
  const hasLen = pwd.length >= 8 && pwd.length <= 16
  const hasLetter = /[a-zA-Z]/.test(pwd)
  const hasNumSym = /[\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
  const isStrong = hasLen && hasLetter && hasNumSym
  const score = [hasLen, hasLetter, hasNumSym].filter(Boolean).length
  return {
    hasLen, hasLetter, hasNumSym, isStrong, score,
    label: isStrong ? 'Senha forte' : score === 2 ? 'Senha média' : 'Senha fraca',
    color: isStrong ? '#4ecdc4' : score === 2 ? '#ffa726' : '#ff6b6b',
    width: isStrong ? '100%' : score === 2 ? '66%' : '33%',
  }
}

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

    if (!isLogin) {
      const { isStrong } = getPasswordStrength(password)
      if (!isStrong) {
        setStatusMsg('Senha fraca! Use 8–16 caracteres com letras e números ou símbolos.');
        setStatusColor('#ff6b6b');
        setIsLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const body = isLogin
        ? { login, password }
        : { username, email, password };

      const response = await fetch(`https://aquasite-frontend.onrender.com${endpoint}`, {
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
                maxLength={16}
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
            {!isLogin && password.length > 0 && (
              <div style={{ marginTop: '-8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: getPasswordStrength(password).color, fontWeight: 700 }}>
                    {getPasswordStrength(password).label}
                  </span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '8px' }}>
                  <div style={{ height: '100%', width: getPasswordStrength(password).width, background: getPasswordStrength(password).color, borderRadius: '4px', transition: 'all 0.3s ease' }} />
                </div>
                <div style={{ fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ color: getPasswordStrength(password).hasLen ? '#4ecdc4' : '#ff6b6b' }}>
                    {getPasswordStrength(password).hasLen ? '✓' : '✗'} Entre 8 e 16 caracteres
                  </span>
                  <span style={{ color: getPasswordStrength(password).hasLetter ? '#4ecdc4' : '#ff6b6b' }}>
                    {getPasswordStrength(password).hasLetter ? '✓' : '✗'} Pelo menos uma letra
                  </span>
                  <span style={{ color: getPasswordStrength(password).hasNumSym ? '#4ecdc4' : '#ff6b6b' }}>
                    {getPasswordStrength(password).hasNumSym ? '✓' : '✗'} Pelo menos um número ou símbolo
                  </span>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || (!isLogin && !getPasswordStrength(password).isStrong && password.length > 0)}
              style={{ opacity: (!isLogin && !getPasswordStrength(password).isStrong && password.length > 0) ? 0.5 : 1 }}
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