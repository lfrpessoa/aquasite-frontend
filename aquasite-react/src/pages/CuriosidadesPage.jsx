import React from 'react'
import { useNavigate } from 'react-router-dom'
import './CuriosidadesPage.css'

const porQuePreservar = [
  { icon: '🪸', titulo: 'Biodiversidade', texto: 'Milhares de espécies dependem de um oceano saudável para viver.' },
  { icon: '🌀', titulo: 'Clima', texto: 'Os oceanos regulam o clima e produzem grande parte do oxigênio que respiramos.' },
  { icon: '🐟', titulo: 'Alimentação', texto: 'Milhões de pessoas dependem dos oceanos como fonte de alimento e sustento.' },
  { icon: '❤️', titulo: 'Futuro', texto: 'Preservar os oceanos é garantir um planeta saudável para as próximas gerações.' },
]

const dicas = [
  { icon: '🚫', titulo: 'Reduza o plástico', texto: 'Evite produtos descartáveis e dê preferência a itens reutilizáveis.' },
  { icon: '♻️', titulo: 'Recicle sempre', texto: 'Separe corretamente os resíduos recicláveis.' },
  { icon: '💧', titulo: 'Economize água', texto: 'Usar água com consciência reduz o impacto sobre os recursos hídricos.' },
  { icon: '🛒', titulo: 'Consumo consciente', texto: 'Prefira marcas sustentáveis que respeitam o meio ambiente.' },
  { icon: '🤝', titulo: 'Participe e apoie', texto: 'Apoie projetos de preservação e participe de ações de limpeza de praias.' },
  { icon: '📢', titulo: 'Compartilhe informação', texto: 'Fale sobre a importância dos oceanos e inspire mais pessoas a agir.' },
]

const CuriosidadesPage = () => {
  const navigate = useNavigate()

  const irParaDicas = () => {
    document.getElementById('dicas-oceano')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="preservacao-page">
      <button className="btn-voltar" onClick={() => navigate(-1)}>← Voltar</button>

      <section className="preservacao-hero">
        <div className="preservacao-hero-content">
          <h1>Preserve a vida marinha</h1>
          <p>Nossos oceanos abrigam uma vida incrível. Pequenas atitudes podem gerar grandes mudanças.</p>
          <button className="preservacao-cta-btn" onClick={irParaDicas}>🐢 O oceano precisa de você</button>
        </div>
      </section>

      <section className="preservacao-section">
        <h2>Por que preservar?</h2>
        <div className="why-grid">
          {porQuePreservar.map(item => (
            <div className="why-card" key={item.titulo}>
              <div className="icon-badge">{item.icon}</div>
              <h3>{item.titulo}</h3>
              <p>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="dicas-oceano" className="preservacao-section tips">
        <h2>Dicas para ajudar os oceanos</h2>
        <div className="tips-grid">
          {dicas.map(item => (
            <div className="tip-card" key={item.titulo}>
              <div className="tip-icon">{item.icon}</div>
              <h4>{item.titulo}</h4>
              <p>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="preservacao-final">
        <h2>Pequenas atitudes, grandes impactos</h2>
        <p>Juntos podemos proteger os oceanos e garantir um futuro melhor para as próximas gerações.</p>
        <button className="preservacao-cta-btn" onClick={() => navigate('/home')}>🌊 Quero fazer a diferença</button>
      </section>
    </div>
  )
}

export default CuriosidadesPage
