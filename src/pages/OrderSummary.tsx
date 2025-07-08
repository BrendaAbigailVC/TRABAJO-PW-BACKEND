import { useEffect, useState } from 'react'

function OrderSummary() {
  const [resumen, setResumen] = useState<any>(null)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("resumenCompra") || "null")
    setResumen(data)
  }, [])

  if (!resumen) {
    return <p className="message">No hay resumen disponible ❌</p>
  }

  return (
    <section className="order-summary">
      <h2><i className="fas fa-receipt"></i> Resumen de Compra</h2>
      <div className="order-details">
        <p><strong>Número de Orden:</strong> {resumen.numeroOrden}</p>
        <p><strong>Fecha:</strong> {resumen.fecha}</p>
        <ul className="order-items">
          {resumen.juegos.map((nombre: string, idx: number) => (
            <li key={idx}>{nombre}</li>
          ))}
        </ul>
        <p className="total"><strong>Total Pagado:</strong> ${resumen.total}</p>
      </div>
    </section>
  )
}

export default OrderSummary
