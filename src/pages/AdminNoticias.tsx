import { useState, useEffect } from 'react'
import type { Noticia } from '../types/Noticia'
import '../styles/Noticias.css'

function AdminNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [noticiaActual, setNoticiaActual] = useState<Noticia | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    imagen: '',
    destacada: false
  })

  useEffect(() => {
    cargarNoticias()
  }, [])

  const cargarNoticias = () => {
    const noticiasGuardadas = JSON.parse(localStorage.getItem('noticias') || '[]')
    setNoticias(noticiasGuardadas)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const usuarioActual = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (noticiaActual) {
      // Editar noticia existente
      const noticiasActualizadas = noticias.map(n => 
        n.id === noticiaActual.id 
          ? { ...n, ...formData, fecha: new Date().toISOString() }
          : n
      )
      localStorage.setItem('noticias', JSON.stringify(noticiasActualizadas))
    } else {
      // Crear nueva noticia
      const nuevaNoticia: Noticia = {
        id: Date.now(),
        ...formData,
        fecha: new Date().toISOString(),
        autor: usuarioActual.username || 'Admin'
      }
      const noticiasActualizadas = [...noticias, nuevaNoticia]
      localStorage.setItem('noticias', JSON.stringify(noticiasActualizadas))
    }

    // Limpiar formulario
    setFormData({
      titulo: '',
      contenido: '',
      imagen: '',
      destacada: false
    })
    setNoticiaActual(null)
    cargarNoticias()
  }

  const handleEditar = (noticia: Noticia) => {
    setNoticiaActual(noticia)
    setFormData({
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      imagen: noticia.imagen || '',
      destacada: noticia.destacada
    })
  }

  const handleEliminar = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
      const noticiasActualizadas = noticias.filter(n => n.id !== id)
      localStorage.setItem('noticias', JSON.stringify(noticiasActualizadas))
      cargarNoticias()
    }
  }

  return (
    <div className="noticias-admin">
      <h2>
        <i className="fas fa-newspaper"></i> 
        {noticiaActual ? 'Editar Noticia' : 'Agregar Nueva Noticia'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contenido">Contenido:</label>
          <textarea
            id="contenido"
            name="contenido"
            value={formData.contenido}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imagen">URL de la imagen:</label>
          <input
            type="text"
            id="imagen"
            name="imagen"
            value={formData.imagen}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="destacada"
              checked={formData.destacada}
              onChange={handleInputChange}
            />
            Destacada
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-edit">
            {noticiaActual ? 'Guardar Cambios' : 'Publicar Noticia'}
          </button>
          {noticiaActual && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setNoticiaActual(null)
                setFormData({
                  titulo: '',
                  contenido: '',
                  imagen: '',
                  destacada: false
                })
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 style={{ marginTop: '2rem' }}>Noticias Existentes</h3>
      <div className="noticias-grid">
        {noticias.map(noticia => (
          <article key={noticia.id} className="noticia-card">
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
              <div className="form-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEditar(noticia)}
                >
                  <i className="fas fa-edit"></i> Editar
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleEliminar(noticia.id)}
                >
                  <i className="fas fa-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default AdminNoticias 