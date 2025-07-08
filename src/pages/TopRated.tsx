import { useEffect, useState } from 'react'
import { getJuegos } from '../data/games'
import type { Game } from '../data/games'

import GameCard from '../components/GameCard'

function TopRated() {
  const [juegos, setJuegos] = useState<Game[]>([])

  useEffect(() => {
    // Obtener los juegos actualizados
    const juegosActualizados = getJuegos()
    
    // Calcular el promedio de valoraciones para cada juego
    const juegosConPromedio = juegosActualizados.map(juego => {
      let valoracionFinal = juego.valoracion // Usar la valoración base por defecto
      
      // Si hay reviews, calcular el promedio
      if (juego.reviews && juego.reviews.length > 0) {
        const sumaValoraciones = juego.reviews.reduce((sum, review) => sum + review.rating, 0)
        valoracionFinal = sumaValoraciones / juego.reviews.length
      }
      
      return {
        ...juego,
        valoracion: valoracionFinal
      }
    })
    
    // Ordenar por valoración
    const ordenados = [...juegosConPromedio].sort((a, b) => b.valoracion - a.valoracion)
    setJuegos(ordenados)
  }, [])

  return (
    <section id="masValorados" className="catalog-section">
      <h2><i className="fas fa-star"></i> Juegos Más Valorados</h2>
      <div className="grid-catalogo">
        {juegos.map((juego, index) => (
          <GameCard key={index} juego={juego} index={index} />
        ))}
      </div>
    </section>
  )
}

export default TopRated
