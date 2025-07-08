import { useEffect, useState } from 'react'
import type { Noticia } from '../types/Noticia'
import '../styles/Noticias.css'

function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([])

  useEffect(() => {
    // Obtener noticias del localStorage
    const noticiasGuardadas = JSON.parse(localStorage.getItem('noticias') || '[]')
    setNoticias(noticiasGuardadas)
  }, [])

  return (
    <section className="noticias-section">
      <h2><i className="fas fa-newspaper"></i> Noticias</h2>
      
      <div className="noticias-grid">
        {noticias.length === 0 ? (
          <p className="no-noticias">No hay noticias disponibles en este momento.</p>
        ) : (
          noticias.map((noticia) => (
            <article key={noticia.id} className={`noticia-card ${noticia.destacada ? 'destacada' : ''}`}>
              {noticia.imagen && (
                <div className="noticia-imagen">
                  <img src={noticia.imagen} alt={noticia.titulo} />
                </div>
              )}
              <div className="noticia-contenido">
                <h3>{noticia.titulo}</h3>
                <p className="noticia-fecha">
                  <i className="fas fa-calendar"></i> {new Date(noticia.fecha).toLocaleDateString()}
                </p>
                <p className="noticia-autor">
                  <i className="fas fa-user"></i> {noticia.autor}
                </p>
                <p className="noticia-texto">{noticia.contenido}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export default Noticias 