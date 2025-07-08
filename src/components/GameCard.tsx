import { Link } from 'react-router-dom'
import type { Game } from '../data/games'

interface Props {
  juego: Game
  index: number
}

function GameCard({ juego, index }: Props) {
  const agregarAlCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]")
    carrito.push(juego)
    localStorage.setItem("carrito", JSON.stringify(carrito))
    alert(`${juego.nombre} agregado al carrito 🛒`)
  }

  const precioConDescuento = juego.descuento 
    ? juego.precio * (1 - juego.descuento / 100)
    : juego.precio

  return (
    <div className="juego-card">
      <Link to={`/juego/${juego.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="juego-info">
          <h3>{juego.nombre}</h3>
          <p>Categoría: {juego.categoria}</p>
          {juego.descuento ? (
            <div className="precio-container">
              <p className="precio-original">${juego.precio.toFixed(2)}</p>
              <p className="precio-descuento">${precioConDescuento.toFixed(2)}</p>
              <span className="descuento-badge">-{juego.descuento}%</span>
            </div>
          ) : (
            <p>Precio: ${juego.precio.toFixed(2)}</p>
          )}
          <p>Valoración: ⭐ {juego.valoracion}</p>
        </div>
      </Link>

      <button onClick={agregarAlCarrito} className="btn-primary">
        Agregar al carrito 🛒
      </button>
    </div>
  )
}

export default GameCard
