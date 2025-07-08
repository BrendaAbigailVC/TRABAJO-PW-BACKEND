import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { hashPassword } from '../utils/hash'
import { useAuth } from '../context/AuthContext'
import { AuthService } from '../services/authService'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  const manejarSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const tieneArroba = email.includes('@');
    const tienePunto = email.includes('.');

    if (!tieneArroba || !tienePunto) {
      setMensaje('Correo inválido');
      return;
    }

    try {
      const res = await AuthService.login(email, password);

      if (res.token) {
        login(res.token, res.usuario)

        setMensaje(`Bienvenido/a, ${res.usuario.username} ✅`);

        if (res.usuario.email === 'admin@admin.com') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setMensaje(res.error || 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error de conexión con el servidor ');
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <h2><i className="fas fa-sign-in-alt"></i> Iniciar Sesión</h2>
        <form className="auth-form" onSubmit={manejarSubmit}>
          <div className="form-group">
            <label htmlFor="email"><i className="fas fa-envelope"></i> Correo electrónico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password"><i className="fas fa-lock"></i> Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Iniciar Sesión
          </button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
        
        <p className="login-link">
          ¿No tienes una cuenta? <a href="/register">Regístrate</a>
        </p>
        <p className="login-link">
          <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
        </p>
      </div>
    </section>
  )
}

export default Login
