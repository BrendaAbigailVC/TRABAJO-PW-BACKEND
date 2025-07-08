
import { juegos } from '../data/games'

function Home() {
  return (
    <div className="container mt-4">
      <h2 className="text-white mb-4">📰 Noticias & Nuevos Juegos</h2>
      <div id="gameCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {juegos.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#gameCarousel"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : undefined}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
        <div className="carousel-inner">
          {juegos.map((juego, index) => (
            <div
              className={`carousel-item ${index === 0 ? 'active' : ''}`}
              key={juego.id}
            >
              <img
                src={juego.imagen}
                className="d-block w-100"
                alt={juego.nombre}
                style={{ height: '500px', objectFit: 'cover' }}
              />
              <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
                <h5>{juego.nombre}</h5>
                <p>{juego.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#gameCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#gameCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </div>
  )
}

export default Home
