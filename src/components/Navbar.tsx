import { Link, useLocation } from 'react-router-dom'
import ImgPerfil from "../components/ImgUsuario"
import '../styles/NavBar.css'
import Boton from "./Boton"

interface NavBarProps {
  nombreUsuario?: string
  imagenUsuario?: string
  onLogout?: () => void
}

const NavBar = ({ nombreUsuario = "Nombre perfil", imagenUsuario, onLogout }: NavBarProps) => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <aside className="sidebar">
      <div className="perfil">
        <ImgPerfil imagen={imagenUsuario} nombre={nombreUsuario} />
      </div>

      <nav className="menu">
        <ul>
          <li><Link to="/admin" className={isActive('/admin')}>Usuarios</Link></li>
          <li><Link to="/admin/juegos" className={isActive('/admin/juegos')}>Juegos</Link></li>
          <li><Link to="/admin/noticias" className={isActive('/admin/noticias')}>Noticias</Link></li>
          <li><Link to="/admin/estadisticas" className={isActive('/admin/estadisticas')}>Estadísticas</Link></li>
          <li className="cerrar-sesion">
            {onLogout ? (
              <Boton tipo="button" texto="Cerrar sesión" onClick={onLogout}  />
            ) : (
              <Link to="/logout">Cerrar sesión</Link> 
            )}
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default NavBar
