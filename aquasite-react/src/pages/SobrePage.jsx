import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SobrePage = () => {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      title: "Nossa Missão",
      content: "Conectar pessoas ao mundo marinho através da tecnologia, promovendo educação, conscientização e ações concretas para a preservação dos oceanos."
    },
    {
      title: "Nossa História", 
      content: "Fundado por entusiastas da vida marinha, o AquaSite nasceu da necessidade de criar uma plataforma que unisse ciência, educação e comunidade em prol dos oceanos."
    },
    {
      title: "Nossos Valores",
      content: "Sustentabilidade, educação acessível, inovação tecnológica e respeito pela biodiversidade marinha guiam cada decisão que tomamos."
    },
    {
      title: "Impacto",
      content: "Mais de 1000 usuários ativos, centenas de espécies catalogadas e uma comunidade crescente de defensores dos oceanos."
    }
  ];

  const team = [
    {
      name: "Dr. Marina Silva",
      role: "Bióloga Marinha",
      description: "Especialista em ecossistemas marinhos com 15 anos de experiência em conservação."
    },
    {
      name: "João Santos",
      role: "Desenvolvedor",
      description: "Apaixonado por tecnologia e oceanos, criador da plataforma AquaSite."
    },
    {
      name: "Ana Costa",
      role: "Educadora",
      description: "Especialista em educação ambiental e comunicação científica."
    }
  ];

  return (
    <div className="sobre-app">
      <button className="btn-voltar-sobre" onClick={() => window.history.back()}>
        Voltar
      </button>

      <div className="sobre-container-melhorado">
        <header className="sobre-header">
          <h1>Quem Somos</h1>
          <p className="sobre-subtitle">
            Conectando pessoas aos oceanos através da tecnologia e educação
          </p>
        </header>

        <div className="sobre-content">
          <div className="sections-grid">
            {sections.map((section, index) => (
              <div 
                key={index}
                className={`section-card ${activeSection === index ? 'active' : ''}`}
                onClick={() => setActiveSection(index)}
              >
                <h3>{section.title}</h3>
                <p>{section.content}</p>
              </div>
            ))}
          </div>

          <div className="team-section">
            <h2>Nossa Equipe</h2>
            <div className="team-grid">
              {team.map((member, index) => (
                <div key={index} className="team-card">
                  <h4>{member.name}</h4>
                  <span className="team-role">{member.role}</span>
                  <p>{member.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="stats-section">
            <h2>Nosso Impacto</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Usuários Ativos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Espécies Catalogadas</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Projetos de Conservação</span>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h2>Junte-se a Nós</h2>
            <p>Faça parte da maior comunidade de defensores dos oceanos</p>
            <div className="cta-buttons">
              <Link to="/login" className="btn btn-primary">Criar Conta →</Link>
              <Link to="/curiosidades" className="btn btn-secondary">Explorar •</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SobrePage