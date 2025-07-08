import { useEffect, useState } from 'react'

interface Orden {
  numeroOrden: string
  fecha: string
  total: string
  juegos: string[]
}

function PurchaseHistory() {
  const [historial, setHistorial] = useState<Orden[]>([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("historialCompras") || "[]")
    setHistorial(data)
  }, [])

  return (
    <section className="history-section">
      <h2><i className="fas fa-history"></i> Historial de Compras</h2>
      <ul className="history-list">
        {historial.length === 0 ? (
          <p className="message">Aún no tienes compras registradas.</p>
        ) : (
          historial.map((orden, idx) => (
            <li key={idx}>
              <strong>{orden.numeroOrden}</strong> - {orden.fecha} - ${orden.total}<br />
              Juegos: {orden.juegos.join(', ')}
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

export default PurchaseHistory
