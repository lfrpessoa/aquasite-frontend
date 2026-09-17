import React, { useEffect, useState } from 'react'
import { praias } from '../data/praias'
import { API_URL } from '../config.js'

const CATEGORIAS = [
  { valor: 'poluicao', label: '🗑️ Poluição', cor: '#e8a33d' },
  { valor: 'perigo', label: '⚠️ Perigo / correnteza', cor: '#e15656' },
  { valor: 'fauna', label: '🐢 Avistamento de fauna', cor: '#3dbf7a' },
  { valor: 'lotacao', label: '👥 Lotação', cor: '#3d9be8' },
  { valor: 'outro', label: '📝 Outro', cor: '#8a8a9e' },
]

const categoriaInfo = (valor) => CATEGORIAS.find(c => c.valor === valor) || CATEGORIAS[4]

function tempoAtras(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000)
  if (diff < 60) return 'agora'
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

// Distância em km entre duas coordenadas (fórmula de Haversine).
function distanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function praiaMaisProxima(lat, lon) {
  let melhor = null
  let menorDist = Infinity
  for (const p of praias) {
    const d = distanciaKm(lat, lon, p.lat, p.lon)
    if (d < menorDist) { menorDist = d; melhor = p }
  }
  return { praia: melhor, distanciaKm: Math.round(menorDist) }
}

// Códigos de tempo (WMO) simplificados para pt-BR.
const condicaoPorCodigo = (code) => {
  if (code === 0) return { texto: 'Céu limpo', icone: '☀️' }
  if ([1, 2, 3].includes(code)) return { texto: 'Parcialmente nublado', icone: '⛅' }
  if ([45, 48].includes(code)) return { texto: 'Neblina', icone: '🌫️' }
  if ([51, 53, 55, 56, 57].includes(code)) return { texto: 'Garoa', icone: '🌦️' }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { texto: 'Chuva', icone: '🌧️' }
  if ([95, 96, 99].includes(code)) return { texto: 'Tempestade', icone: '⛈️' }
  return { texto: 'Condições variáveis', icone: '🌊' }
}

const PraiaProximaWidget = () => {
  const [status, setStatus] = useState('carregando') // carregando | negado | indisponivel | ok
  const [praia, setPraia] = useState(null)
  const [distancia, setDistancia] = useState(null)
  const [coords, setCoords] = useState(null)
  const [clima, setClima] = useState(null)
  const [mar, setMar] = useState(null)
  const [avisos, setAvisos] = useState([])
  const [categoriaForm, setCategoriaForm] = useState('poluicao')
  const [descricaoForm, setDescricaoForm] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('indisponivel')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setCoords({ lat: latitude, lon: longitude })
        const { praia: p, distanciaKm: d } = praiaMaisProxima(latitude, longitude)
        setPraia(p)
        setDistancia(d)
        setStatus('ok')
        carregarClima(p)
        carregarAvisos(p)
      },
      () => setStatus('negado'),
      { timeout: 10000 }
    )
  }, [])

  const carregarAvisos = async (p) => {
    try {
      const res = await fetch(`${API_URL}/api/beach-reports?praia=${encodeURIComponent(p.nome)}`)
      const data = await res.json()
      if (Array.isArray(data)) setAvisos(data)
    } catch {
      // lista de avisos é opcional, falha silenciosa
    }
  }

  const enviarAviso = async (e) => {
    e.preventDefault()
    setErroForm('')
    if (!descricaoForm.trim()) { setErroForm('Descreva o que está acontecendo.'); return }
    setEnviando(true)
    try {
      const currentUser = localStorage.getItem('currentUser')
      const res = await fetch(`${API_URL}/api/beach-reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          praia: praia.nome, uf: praia.uf,
          categoria: categoriaForm, descricao: descricaoForm.trim(),
          usuario: currentUser,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setDescricaoForm('')
        carregarAvisos(praia)
      } else {
        setErroForm(data.error || 'Não foi possível enviar.')
      }
    } catch {
      setErroForm('Não foi possível enviar. Tente de novo.')
    } finally {
      setEnviando(false)
    }
  }

  const carregarClima = async (p) => {
    try {
      const [climaRes, marRes] = await Promise.allSettled([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m,weather_code&timezone=auto`).then(r => r.json()),
        fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${p.lat}&longitude=${p.lon}&current=wave_height,sea_surface_temperature&timezone=auto`).then(r => r.json()),
      ])
      if (climaRes.status === 'fulfilled') setClima(climaRes.value.current)
      if (marRes.status === 'fulfilled') setMar(marRes.value.current)
    } catch {
      // Se a previsão falhar, ainda mostramos a praia mais próxima e o mapa.
    }
  }

  return (
    <div className="widget praia-widget">
      <h4>Praia Mais Próxima</h4>

      {status === 'carregando' && <p>Localizando você...</p>}
      {status === 'negado' && <p>Permita o acesso à localização pra ver a praia mais próxima e as condições do mar.</p>}
      {status === 'indisponivel' && <p>Seu navegador não suporta geolocalização.</p>}

      {status === 'ok' && praia && (
        <>
          <p style={{ marginBottom: '2px' }}><strong>{praia.nome}</strong></p>
          <p style={{ marginBottom: '10px', fontSize: '0.8rem', opacity: 0.7 }}>{praia.cidade} - {praia.uf} • ~{distancia} km</p>

          {clima && (
            <p>{condicaoPorCodigo(clima.weather_code).icone} {clima.temperature_2m}°C — {condicaoPorCodigo(clima.weather_code).texto}</p>
          )}
          {mar && mar.wave_height != null && (
            <p>🌊 Ondas: {mar.wave_height} m</p>
          )}
          {mar && mar.sea_surface_temperature != null && (
            <p>🌡️ Água do mar: {mar.sea_surface_temperature}°C</p>
          )}

          <div style={{ borderRadius: '12px', overflow: 'hidden', marginTop: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <iframe
              title="Mapa da praia mais próxima"
              width="100%"
              height="180"
              style={{ display: 'block', border: 0 }}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${praia.lon - 0.15}%2C${praia.lat - 0.1}%2C${praia.lon + 0.15}%2C${praia.lat + 0.1}&layer=mapnik&marker=${praia.lat}%2C${praia.lon}`}
            />
          </div>

          {/* Avisos da comunidade */}
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: '#00d4ff', marginBottom: '10px' }}>
              O que está acontecendo lá
            </p>

            {avisos.length === 0 && (
              <p style={{ fontSize: '0.78rem', opacity: 0.5, marginBottom: '10px' }}>Nenhum aviso ainda. Seja o primeiro a avisar.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', maxHeight: '220px', overflowY: 'auto' }}>
              {avisos.map(a => {
                const info = categoriaInfo(a.categoria)
                return (
                  <div key={a.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '8px 10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: info.cor }}>{info.label}</span>
                      <span style={{ fontSize: '0.68rem', opacity: 0.45 }}>{tempoAtras(a.created_at)}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.85 }}>{a.descricao}</p>
                    {a.usuario && <p style={{ fontSize: '0.68rem', margin: '3px 0 0', opacity: 0.4 }}>@{a.usuario}</p>}
                  </div>
                )
              })}
            </div>

            <form onSubmit={enviarAviso} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <select
                value={categoriaForm}
                onChange={e => setCategoriaForm(e.target.value)}
                style={{ padding: '7px 8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.8rem' }}
              >
                {CATEGORIAS.map(c => <option key={c.valor} value={c.valor} style={{ color: '#000' }}>{c.label}</option>)}
              </select>
              <textarea
                value={descricaoForm}
                onChange={e => setDescricaoForm(e.target.value)}
                placeholder="O que você está vendo na praia agora?"
                rows={2}
                style={{ padding: '7px 8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.8rem', resize: 'none' }}
              />
              {erroForm && <p style={{ color: '#ff8080', fontSize: '0.72rem', margin: 0 }}>{erroForm}</p>}
              <button
                type="submit"
                disabled={enviando}
                style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #00b8e0, #0070aa)', color: 'white', fontWeight: 700, fontSize: '0.8rem', cursor: enviando ? 'default' : 'pointer', opacity: enviando ? 0.6 : 1 }}
              >
                {enviando ? 'Enviando...' : 'Avisar a comunidade'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}

export default PraiaProximaWidget
