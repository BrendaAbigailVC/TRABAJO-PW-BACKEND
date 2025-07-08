import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getJuegos } from '../data/games'
import type { Game } from '../data/games'
import '../styles/SearchBar.css'

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<Game[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Cerrar sugerencias al hacer clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    
    if (value.length >= 2) { // Mostrar sugerencias con 2 o más caracteres
      const juegos = getJuegos()
      const filtered = juegos.filter(juego => 
        juego.nombre.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (juego: Game) => {
    setSearchTerm(juego.nombre)
    setShowSuggestions(false)
    navigate(`/juego/${juego.id}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (suggestions.length > 0) {
      handleSuggestionClick(suggestions[0])
    }
  }

  return (
    <div className="search-container" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar juegos..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-container">
          {suggestions.map((juego) => (
            <div
              key={juego.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(juego)}
            >
              <img 
                src={typeof juego.imagen === 'string' ? juego.imagen : ''} 
                alt={juego.nombre} 
                className="suggestion-image"
              />
              <div className="suggestion-info">
                <span className="suggestion-name">{juego.nombre}</span>
                <span className="suggestion-price">${juego.precio.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar 