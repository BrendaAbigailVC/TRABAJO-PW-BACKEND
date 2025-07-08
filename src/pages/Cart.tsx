import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getJuegos } from '../data/games'
import type { Game } from '../data/games'
import { useAuth } from '../context/AuthContext'
import { sendGameKeysEmail } from '../services/emailService'
import CompraExitosa from './CompraExitosa'

function Cart() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [carrito, setCarrito] = useState<Game[]>([])
  const [mensaje, setMensaje] = useState('')
  const [total, setTotal] = useState(0)
  const [compraExitosa, setCompraExitosa] = useState(false)

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("carrito") || "[]")
    setCarrito(items)
    calcularTotal(items)
  }, [])

  const calcularTotal = (items: Game[]) => {
    const total = items.reduce((acc, item) => {
      const precio = item.descuento
        ? item.precio * (1 - item.descuento / 100)
        : item.precio
      return acc + precio
    }, 0)
    setTotal(total)
  }

  const quitarDelCarrito = (index: number) => {
    const nuevoCarrito = [...carrito]
    const juegoEliminado = nuevoCarrito[index].nombre
    nuevoCarrito.splice(index, 1)
    setCarrito(nuevoCarrito)
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito))
    calcularTotal(nuevoCarrito)
    setMensaje(`${juegoEliminado} eliminado del carrito 🗑️`)
    setTimeout(() => setMensaje(''), 2000)
  }

  const procesarPago = async () => {
    try {
      if (carrito.length === 0) {
        setMensaje("El carrito está vacío ❌")
        return
      }

      if (!user) {
        setMensaje("Debes iniciar sesión para realizar la compra ❌")
        return
      }

      const numeroOrden = "ORD-" + Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
      const fecha = new Date().toLocaleString()

      // Obtener juegos actualizados para asegurar que tenemos las claves más recientes
      const juegosActualizados = getJuegos()
      const juegosSinClaves: string[] = []

      const juegosConClaves = carrito.map(juego => {
        const juegoActualizado = juegosActualizados.find(j => j.id === juego.id)
        if (!juegoActualizado || !juegoActualizado.claves || juegoActualizado.claves.length === 0) {
          juegosSinClaves.push(juego.nombre)
          return null
        }
        // Tomar la primera clave disponible
        const clave = juegoActualizado.claves[0]
        // Remover la clave usada
        juegoActualizado.claves.shift()
        return { nombre: juego.nombre, clave }
      }).filter(Boolean) as { nombre: string, clave: string }[]

      if (juegosSinClaves.length > 0) {
        setMensaje(`No hay claves disponibles para: ${juegosSinClaves.join(', ')} ❌`)
        return
      }

      // Actualizar los juegos en localStorage
      localStorage.setItem("juegos", JSON.stringify(juegosActualizados))

      const resumen = {
        numeroOrden,
        fecha,
        total: total.toFixed(2),
        juegos: juegosConClaves.map(j => j.nombre)
      }

      // Guardar en historial
      const historial = JSON.parse(localStorage.getItem("historialCompras") || "[]")
      historial.push(resumen)
      localStorage.setItem("historialCompras", JSON.stringify(historial))

      // Enviar email con las claves
      const emailEnviado = await sendGameKeysEmail(user.email, numeroOrden, juegosConClaves)
      if (!emailEnviado) {
        setMensaje("Error al enviar las claves por email ❌")
        return
      }

      // Limpiar carrito
      localStorage.removeItem("carrito")
      setCarrito([])
      setTotal(0)

      setCompraExitosa(true)

      // Guardar resumen temporal y redirigir
      setTimeout(() => {
        localStorage.setItem("resumenCompra", JSON.stringify(resumen))
        navigate("/resumen")
      }, 3000)

    } catch (error) {
      console.error('Error al procesar el pago:', error)
      setMensaje("Error al procesar el pago. Por favor, intente nuevamente ❌")
    }
  }

  return (
    <section className="cart-section">
      <h2><i className="fas fa-shopping-cart"></i> Carrito de Compras</h2>

      {mensaje && <div className="message">{mensaje}</div>}
      {compraExitosa && <CompraExitosa />}

      {carrito.length === 0 && !compraExitosa ? (
        <p>Tu carrito está vacío</p>
      ) : !compraExitosa && (
        <>
          <ul className="cart-items">
            {carrito.map((juego, index) => (
              <li key={index}>
                <div className="item-info">
                  <h3>{juego.nombre}</h3>
                  {juego.descuento ? (
                    <div className="precio-container">
                      <p className="precio-original">${juego.precio.toFixed(2)}</p>
                      <p className="precio-descuento">
                        ${(juego.precio * (1 - juego.descuento / 100)).toFixed(2)}
                      </p>
                      <span className="descuento-badge">-{juego.descuento}%</span>
                    </div>
                  ) : (
                    <p>Precio: ${juego.precio.toFixed(2)}</p>
                  )}
                </div>
                <button onClick={() => quitarDelCarrito(index)} className="btn-danger">
                  <i className="fas fa-trash"></i> Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <h3>Resumen de la Compra</h3>
            <p className="total">Total: ${total.toFixed(2)}</p>
            <button onClick={procesarPago} className="btn-primary">
              Proceder al Pago
            </button>
          </div>
        </>
      )}
    </section>
  )
}

export default Cart
