import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ResumenCompra {
  numeroOrden: string
  fecha: string
  total: string
  juegos: string[]
}

function Resumen() {
  const navigate = useNavigate()
  const [resumen, setResumen] = useState<ResumenCompra | null>(null)
  const [claves, setClaves] = useState<{ nombre: string, clave: string }[]>([])

  useEffect(() => {
    const resumenData = JSON.parse(localStorage.getItem('resumenCompra') || 'null')
    const emailsData = JSON.parse(localStorage.getItem('emails') || '[]')
    
    if (!resumenData) {
      navigate('/')
      return
    }

    setResumen(resumenData)

    // Obtener las claves del último email enviado
    const ultimoEmail = emailsData[emailsData.length - 1]
    if (ultimoEmail) {
      const clavesText = ultimoEmail.text.split('\n\n')[1]
      const clavesArray = clavesText.split('\n').map(line => {
        const [nombre, clave] = line.split(': ')
        return { nombre, clave }
      })
      setClaves(clavesArray)
    }
  }, [navigate])

  if (!resumen) return null

  return (
    <section className="resumen-section">
      <h2><i className="fas fa-check-circle"></i> ¡Compra Exitosa!</h2>
      
      <div className="resumen-container">
        <div className="resumen-info">
          <h3>Detalles de la Compra</h3>
          <p><strong>Número de Orden:</strong> {resumen.numeroOrden}</p>
          <p><strong>Fecha:</strong> {resumen.fecha}</p>
          <p><strong>Total:</strong> ${resumen.total}</p>
        </div>

        <div className="claves-container">
          <h3>Tus Claves de Juego</h3>
          {claves.length > 0 ? (
            <ul className="claves-list">
              {claves.map((item, index) => (
                <li key={index} className="clave-item">
                  <span className="juego-nombre">{item.nombre}</span>
                  <span className="clave">{item.clave}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No se encontraron claves para esta compra.</p>
          )}
        </div>

        <div className="resumen-actions">
          <button onClick={() => navigate('/')} className="btn-primary">
            Volver al Inicio
          </button>
        </div>
      </div>
    </section>
  )
}

export default Resumen 