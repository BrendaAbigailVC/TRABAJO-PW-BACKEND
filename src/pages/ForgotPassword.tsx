import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { hashPassword } from '../utils/hash'
import '../styles/Login.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [nuevaContrasena, setNuevaContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [mostrarFormularioContrasena, setMostrarFormularioContrasena] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Obtener usuarios del localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const usuario = usuarios.find((u: any) => u.email === email)

    if (!usuario) {
      setMensaje('No se encontró una cuenta con ese correo electrónico ❌')
      return
    }

    // Si el usuario existe, mostrar el formulario para cambiar la contraseña
    setMostrarFormularioContrasena(true)
    setMensaje('Por favor, ingresa tu nueva contraseña ✅')
  }

  const handleCambiarContrasena = (e: React.FormEvent) => {
    e.preventDefault()

    if (nuevaContrasena !== confirmarContrasena) {
      setMensaje('Las contraseñas no coinciden ❌')
      return
    }

    if (nuevaContrasena.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres ❌')
      return
    }

    // Obtener usuarios del localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]')
    const usuarioIndex = usuarios.findIndex((u: any) => u.email === email)

    if (usuarioIndex === -1) {
      setMensaje('Error al actualizar la contraseña ❌')
      return
    }

    // Encriptar la nueva contraseña antes de guardarla
    const hashedPassword = hashPassword(nuevaContrasena)

    // Actualizar la contraseña con la versión encriptada
    usuarios[usuarioIndex].password = hashedPassword
    localStorage.setItem('usuarios', JSON.stringify(usuarios))

    setMensaje('Contraseña actualizada exitosamente ✅')
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2><i className="fas fa-key"></i> Recuperar Contraseña</h2>
        
        {!mostrarFormularioContrasena ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Verificar Email
            </button>
          </form>
        ) : (
          <form onSubmit={handleCambiarContrasena}>
            <div className="form-group">
              <label htmlFor="nuevaContrasena">Nueva Contraseña</label>
              <input
                type="password"
                id="nuevaContrasena"
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmarContrasena"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Cambiar Contraseña
            </button>
          </form>
        )}

        {mensaje && <p className="mensaje">{mensaje}</p>}
        
        <p className="login-link">
          ¿Recordaste tu contraseña? <a href="/login">Iniciar Sesión</a>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword 