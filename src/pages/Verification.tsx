import { useState } from 'react'
import type { FormEvent } from 'react'

import { useNavigate } from 'react-router-dom'
import { AuthService } from '../services/authService'

function Verification() {
  const navigate = useNavigate()
  const [codigo, setCodigo] = useState('')
  const [mensaje, setMensaje] = useState('')

const manejarVerificacion = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = localStorage.getItem("correoPendiente"); 

    if (!email) {
      setMensaje("No se encontró un correo pendiente de verificación ");
      return;
    }

    const res = await AuthService.verifyCode(email, codigo);

    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.removeItem("correoPendiente");
      setMensaje("¡Email verificado exitosamente! ");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setMensaje(res.mensaje || "Código incorrecto ");
    }
  };
  return (
    <section className="auth-section">
      <div className="auth-container">
        <h2><i className="fas fa-envelope"></i> Verificación de Email</h2>
        <form className="auth-form" onSubmit={manejarVerificacion}>
          <div className="form-group">
            <label htmlFor="codigoVerificacion"><i className="fas fa-key"></i> Código de verificación:</label>
            <input
              type="text"
              id="codigoVerificacion"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">Verificar</button>
        </form>
        {mensaje && <p className="message">{mensaje}</p>}
      </div>
    </section>
  )
}

export default Verification
