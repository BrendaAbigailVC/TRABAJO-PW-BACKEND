// src/components/Header.tsx
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SearchBar from './SearchBar'
import '../styles/Header.css'

function Header() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <header className="header">
      <div className="nav-container">
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <i className="fas fa-home"></i> Inicio
          </Link>
          <Link to="/catalogo" className={`nav-link ${isActive('/catalogo')}`}>
            <i className="fas fa-gamepad"></i> Catálogo
          </Link>
          <Link to="/noticias" className={`nav-link ${isActive('/noticias')}`}>
            <i className="fas fa-newspaper"></i> Noticias
          </Link>
          <Link to="/top-vendidos" className={`nav-link ${isActive('/top-vendidos')}`}>
            <i className="fas fa-trophy"></i> Más Vendidos
          </Link>
          <Link to="/top-valorados" className={`nav-link ${isActive('/top-valorados')}`}>
            <i className="fas fa-star"></i> Más Valorados
          </Link>
        </div>

        <SearchBar />

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/carrito" className={`nav-link ${isActive('/carrito')}`}>
                <i className="fas fa-shopping-cart"></i> Carrito
              </Link>
              <Link to="/compras" className={`nav-link ${isActive('/compras')}`}>
                <i className="fas fa-history"></i> Mis Compras
              </Link>
              <Link to="/perfil" className={`nav-link ${isActive('/perfil')}`}>
                <i className="fas fa-user"></i> Perfil
              </Link>
              <button onClick={logout} className="nav-link logout-btn">
                <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login')}`}>
                <i className="fas fa-sign-in-alt"></i> Iniciar Sesión
              </Link>
              <Link to="/register" className={`nav-link ${isActive('/register')}`}>
                <i className="fas fa-user-plus"></i> Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
