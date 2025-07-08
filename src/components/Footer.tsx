// src/components/Footer.tsx
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>GameMarket</h3>
          <p>Tu destino para comprar y vender videojuegos</p>
        </div>
        <div className="footer-section">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><Link to="/catalogo">Catálogo</Link></li>
            <li><Link to="/carrito">Carrito</Link></li>
            <li><Link to="/compras">Mis Compras</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contacto</h3>
          <p><i className="fas fa-envelope"></i> contacto@gamemarket.com</p>
          <p><i className="fas fa-phone"></i> +1 234 567 890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 GameMarket. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
