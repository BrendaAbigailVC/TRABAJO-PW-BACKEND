import { useState } from 'react'
import type { FormEvent } from 'react'

import { useNavigate } from 'react-router-dom'
import { hashPassword } from '../utils/hash'
import { AuthService } from '../services/authService'

function generarCodigoVerificacion(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}



function Register() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')


  const manejarRegistro = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.includes('@') || !email.includes('.')) {
      setMensaje('Correo inválido');
      return;
    }

    const data = await AuthService.register(email, password, nombre);

    if (data.mensaje === "Código enviado. Verifica tu correo.") {
      localStorage.setItem("correoPendiente", email);
      setMensaje(data.mensaje);
      navigate("/verificacion");
    } else {
      setMensaje(data.mensaje || "Error en el registro.");
    }
  };
  
  return (
    <section className="auth-section">
      <div className="auth-container">
        <h2><i className="fas fa-user-plus"></i> Registro</h2>
        <form className="auth-form" onSubmit={manejarRegistro}>
          <div className="form-group">
            <label htmlFor="regName"><i className="fas fa-user"></i> Nombre:</label>
            <input
              type="text"
              id="regName"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="regEmail"><i className="fas fa-envelope"></i> Correo electrónico:</label>
            <input
              type="email"
              id="regEmail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="regPassword"><i className="fas fa-lock"></i> Contraseña:</label>
            <input
              type="password"
              id="regPassword"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">Registrarme</button>
        </form>
        {mensaje && <p className="message">{mensaje}</p>}
      </div>
    </section>
  )
}

export default Register
