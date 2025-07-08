import { useEffect, useState } from 'react'
import { getJuegos } from '../data/games'
import type { Game } from '../data/games'

import GameCard from '../components/GameCard'

function TopSelling() {
  const [juegos, setJuegos] = useState<Game[]>([])

  useEffect(() => {
    // Obtener el historial de compras
    const historialCompras = JSON.parse(localStorage.getItem("historialCompras") || "[]")
    
    // Crear un mapa para contar las ventas de cada juego
    const ventasPorJuego: { [key: string]: number } = {}
    
    // Contar las ventas de cada juego
    historialCompras.forEach((compra: any) => {
      compra.juegos.forEach((nombreJuego: string) => {
        ventasPorJuego[nombreJuego] = (ventasPorJuego[nombreJuego] || 0) + 1
      })
    })
    
    // Obtener los juegos actualizados
    const juegosActualizados = getJuegos()
    
    // Actualizar las ventas de cada juego
    const juegosConVentas = juegosActualizados.map(juego => ({
      ...juego,
      ventas: ventasPorJuego[juego.nombre] || 0
    }))
    
    // Ordenar por ventas
    const ordenados = [...juegosConVentas].sort((a, b) => b.ventas - a.ventas)
    setJuegos(ordenados)
  }, [])

  return (
    <section id="masVendidos" className="catalog-section">
      <h2><i className="fas fa-trophy"></i> Juegos Más Vendidos</h2>
      <div className="grid-catalogo">
        {juegos.map((juego, index) => (
          <GameCard key={index} juego={juego} index={index} />
        ))}
      </div>
    </section>
  )
}

export default TopSelling
