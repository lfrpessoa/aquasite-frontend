import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ecosistemaData = [
  { id: 1, nome: "Peixe-Palhaço", tipo: "Peixe", profundidade: "1-15m", curiosidade: "Vive em simbiose com anêmonas-do-mar, sendo imune ao seu veneno.", imagem: "/img/peixepalhaço.webp", cor: "#FF6347" },
  { id: 2, nome: "Peixe-Anjo", tipo: "Peixe", profundidade: "1-100m", curiosidade: "Muda de cor e padrão conforme cresce e muda de sexo.", imagem: "🐠", cor: "#FF69B4" },
  { id: 3, nome: "Peixe-Cirurgião", tipo: "Peixe", profundidade: "3-40m", curiosidade: "Possui espinhos venenosos nas nadadeiras para defesa.", imagem: "🐠", cor: "#4169E1" },
  { id: 4, nome: "Peixe-Borboleta", tipo: "Peixe", profundidade: "1-30m", curiosidade: "Tem padrões únicos que confundem predadores.", imagem: "🐠", cor: "#FFD700" },
  { id: 5, nome: "Peixe-Papagaio", tipo: "Peixe", profundidade: "1-25m", curiosidade: "Produz areia ao mastigar corais, criando praias tropicais.", imagem: "🐠", cor: "#32CD32" },
  { id: 6, nome: "Tubarão Branco", tipo: "Peixe", profundidade: "0-1200m", curiosidade: "Predador apex com dentes que se regeneram constantemente.", imagem: "🦈", cor: "#708090" },
  { id: 7, nome: "Tubarão-Martelo", tipo: "Peixe", profundidade: "1-80m", curiosidade: "Sua cabeça em formato de martelo melhora a visão e detecção elétrica.", imagem: "🦈", cor: "#696969" },
  { id: 8, nome: "Tubarão-Baleia", tipo: "Peixe", profundidade: "0-700m", curiosidade: "O maior peixe do mundo, mas se alimenta apenas de plâncton.", imagem: "🦈", cor: "#4682B4" },
  { id: 9, nome: "Arraia-Manta", tipo: "Peixe", profundidade: "0-120m", curiosidade: "Pode ter envergadura de até 9 metros e é totalmente inofensiva.", imagem: "🐟", cor: "#000080" },
  { id: 10, nome: "Cavalo-Marinho", tipo: "Peixe", profundidade: "0-30m", curiosidade: "O macho é quem engravida e dá à luz aos filhotes.", imagem: "🐴", cor: "#F0E68C" },
  { id: 11, nome: "Baleia Azul", tipo: "Mamífero", profundidade: "0-200m", curiosidade: "O maior animal que já existiu na Terra, pode atingir 30 metros.", imagem: "🐋", cor: "#4A90E2" },
  { id: 12, nome: "Golfinho", tipo: "Mamífero", profundidade: "0-300m", curiosidade: "Usa ecolocalização para navegar e se comunicar.", imagem: "🐬", cor: "#00CED1" },
  { id: 13, nome: "Orca", tipo: "Mamífero", profundidade: "0-200m", curiosidade: "Na verdade é o maior golfinho, não uma baleia.", imagem: "🐋", cor: "#000000" },
  { id: 14, nome: "Polvo Gigante", tipo: "Molusco", profundidade: "200-2000m", curiosidade: "Possui 8 braços, 3 corações e sangue azul.", imagem: "🐙", cor: "#8B4513" },
  { id: 15, nome: "Lula Gigante", tipo: "Molusco", profundidade: "300-2000m", curiosidade: "Possui os maiores olhos do reino animal.", imagem: "🦑", cor: "#800080" },
  { id: 16, nome: "Caranguejo", tipo: "Crustáceo", profundidade: "0-4000m", curiosidade: "Caminha de lado e pode regenerar suas garras.", imagem: "🦀", cor: "#DC143C" },
  { id: 17, nome: "Lagosta", tipo: "Crustáceo", profundidade: "4-480m", curiosidade: "Pode viver mais de 100 anos e continuar crescendo.", imagem: "🦞", cor: "#B22222" },
  { id: 18, nome: "Tartaruga Marinha", tipo: "Réptil", profundidade: "0-1000m", curiosidade: "Navega pelos oceanos usando campos magnéticos.", imagem: "🐢", cor: "#228B22" },
  { id: 19, nome: "Água-Viva", tipo: "Cnidário", profundidade: "0-4000m", curiosidade: "Existe há 500 milhões de anos e não possui cérebro.", imagem: "🪼", cor: "#DDA0DD" },
  { id: 20, nome: "Estrela-do-Mar", tipo: "Equinodermo", profundidade: "0-6000m", curiosidade: "Pode regenerar braços perdidos e tem estômago externo.", imagem: "⭐", cor: "#FFD700" }
];

const AnimalMarinho = ({ animal, onClick, isSelected }) => {
  return (
    <div 
      className={`animal-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(animal)}
      style={{ borderColor: animal.cor }}
    >
      {animal.imagem.includes('.webp') || animal.imagem.includes('.jpg') ? (
        <img src={animal.imagem} alt={animal.nome} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
      ) : (
        <div className="animal-emoji">{animal.imagem}</div>
      )}
      <h3>{animal.nome}</h3>
      <span className="animal-tipo">{animal.tipo}</span>
    </div>
  );
};

const DetalhesAnimal = ({ animal, onClose }) => {
  if (!animal) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ borderColor: animal.cor }}
      >
        <button className="close-btn" onClick={onClose}>×</button>
        {animal.imagem.includes('.webp') || animal.imagem.includes('.jpg') ? (
          <img src={animal.imagem} alt={animal.nome} style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover', marginBottom: '16px' }} />
        ) : (
          <div className="animal-emoji-large">{animal.imagem}</div>
        )}
        <h2>{animal.nome}</h2>
        <div className="animal-info">
          <p><strong>Tipo:</strong> {animal.tipo}</p>
          <p><strong>Profundidade:</strong> {animal.profundidade}</p>
          <p className="curiosidade">{animal.curiosidade}</p>
        </div>
      </div>
    </div>
  );
};

const FiltroEcossistema = ({ filtro, setFiltro }) => {
  const tipos = ['Todos', 'Peixe', 'Mamífero', 'Molusco', 'Crustáceo', 'Réptil', 'Cnidário', 'Equinodermo'];

  return (
    <div className="filtro-container">
      <h3>Filtrar por tipo:</h3>
      <div className="filtro-buttons">
        {tipos.map(tipo => (
          <button
            key={tipo}
            className={`filtro-btn ${filtro === tipo ? 'active' : ''}`}
            onClick={() => setFiltro(tipo)}
          >
            {tipo}
          </button>
        ))}
      </div>
    </div>
  );
};

const CuriosidadesPage = () => {
  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const [filtro, setFiltro] = useState('Todos');
  const navigate = useNavigate();

  const animaisFiltrados = filtro === 'Todos' 
    ? ecosistemaData 
    : ecosistemaData.filter(animal => animal.tipo === filtro);

  return (
    <div className="curiosidades-app">
      <button 
        className="btn-voltar" 
        onClick={() => navigate(-1)}
      >
        Voltar
      </button>
      
      <div className="ecosistema-container">
        <header className="ecosistema-header">
          <h1>Ecosistema Marinho</h1>
          <p>Explore a diversidade da vida marinha</p>
        </header>

        <FiltroEcossistema filtro={filtro} setFiltro={setFiltro} />

        <div className="oceano-background">
          <div className="animais-grid">
            {animaisFiltrados.map(animal => (
              <AnimalMarinho
                key={animal.id}
                animal={animal}
                onClick={setAnimalSelecionado}
                isSelected={animalSelecionado?.id === animal.id}
              />
            ))}
          </div>
        </div>

        {animalSelecionado && (
          <DetalhesAnimal
            animal={animalSelecionado}
            onClose={() => setAnimalSelecionado(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CuriosidadesPage