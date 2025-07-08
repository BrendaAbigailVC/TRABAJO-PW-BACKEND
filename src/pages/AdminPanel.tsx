import { useEffect, useState } from 'react'
import { juegos, getJuegos } from '../data/games'
import type { Game } from '../data/games'
import { obtenerUsuarios,eliminarUsuario } from '../services/UsuarioService'


interface Usuario {
  usuarioId: number
  name: string
  email: string
  password?: string
  codigoVerificacion?: string
  fechaRegistro?: string
}

function AdminPanel() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [pendientes, setPendientes] = useState<Usuario[]>([])
  const [juegosList, setJuegosList] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [descuento, setDescuento] = useState<number>(0)
  const [nuevaClave, setNuevaClave] = useState('')
  const [cantidadClaves, setCantidadClaves] = useState<number>(1)
  const [selectedUser, setSelectedUser] = useState<Usuario| null>(null);
  const [UsuarioAEliminar, setusuarioaEliminar] = useState<Usuario| null>(null);


  const handleEliminar = async (id : number) => {
          
  
          try {
              await eliminarUsuario(id);
              const nuevos = usuarios.filter(j => j.usuarioId !== id);
              setUsuarios(nuevos);
              setusuarioaEliminar(null);
          } catch (error) {
              console.error("Error al eliminar el usuario:", error);
          }
      };







  useEffect(() => {
        const cargarJuegos = async () => {
            try {
                const data = await obtenerUsuarios()
                setUsuarios(data)
            } catch (error) {
                console.error("Error al obtener usuarios:", error)
            }
        }
        cargarJuegos()
    }, [])
  
  
  
    useEffect(() => {
    
    
    const dataPendientes = JSON.parse(localStorage.getItem("usuariosPendientes") || "[]")
    
    setPendientes(dataPendientes)
    setJuegosList(getJuegos())
  }, [])

  const generarClaveAleatoria = (prefijo: string): string => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const longitud = 12
    let clave = prefijo + '-'
    
    for (let i = 0; i < longitud; i++) {
      if (i > 0 && i % 4 === 0) clave += '-'
      clave += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    
    return clave
  }

  const generarClaves = () => {
    if (!selectedGame) return

    const prefijo = selectedGame.nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 3)

    const nuevasClaves = Array.from({ length: cantidadClaves }, () => 
      generarClaveAleatoria(prefijo)
    )

    const nuevosJuegos = juegosList.map(juego => {
      if (juego.id === selectedGame.id) {
        return {
          ...juego,
          claves: [...(juego.claves || []), ...nuevasClaves]
        }
      }
      return juego
    })

    setJuegosList(nuevosJuegos)
    localStorage.setItem("juegos", JSON.stringify(nuevosJuegos))
    alert(`${cantidadClaves} clave(s) generada(s) para ${selectedGame.nombre}`)
  }

  

  const eliminarPendiente = (email: string) => {
    if (!confirm(`¿Eliminar usuario pendiente ${email}?`)) return

    const nuevos = pendientes.filter(u => u.email !== email)
    localStorage.setItem("usuariosPendientes", JSON.stringify(nuevos))
    setPendientes(nuevos)
  }

  const verificarUsuario = (email: string) => {
    const user = pendientes.find(u => u.email === email)
    if (!user) return

    const nuevosVerificados = [...usuarios, {
      name: user.name,
      email: user.email,
      password: user.password
    }]
    const nuevosPendientes = pendientes.filter(u => u.email !== email)

    localStorage.setItem("usuarios", JSON.stringify(nuevosVerificados))
    localStorage.setItem("usuariosPendientes", JSON.stringify(nuevosPendientes))

    
    setPendientes(nuevosPendientes)
  }

  const aplicarDescuento = () => {
    if (!selectedGame) return

    const nuevosJuegos = juegosList.map(juego => {
      if (juego.id === selectedGame.id) {
        return {
          ...juego,
          oferta: descuento > 0,
          descuento: descuento
        }
      }
      return juego
    })

    setJuegosList(nuevosJuegos)
    localStorage.setItem("juegos", JSON.stringify(nuevosJuegos))
    alert(`Descuento de ${descuento}% aplicado a ${selectedGame.nombre}`)
    setSelectedGame(null)
    setDescuento(0)
  }

  const agregarClave = () => {
    if (!selectedGame || !nuevaClave.trim()) return

    const nuevosJuegos = juegosList.map(juego => {
      if (juego.id === selectedGame.id) {
        return {
          ...juego,
          claves: [...juego.claves, nuevaClave.trim()]
        }
      }
      return juego
    })

    setJuegosList(nuevosJuegos)
    localStorage.setItem("juegos", JSON.stringify(nuevosJuegos))
    setNuevaClave('')
    alert(`Clave agregada a ${selectedGame.nombre}`)
  }

  const eliminarClave = (juegoId: number, claveIndex: number) => {
    if (!confirm('¿Eliminar esta clave?')) return

    const nuevosJuegos = juegosList.map(juego => {
      if (juego.id === juegoId) {
        const nuevasClaves = [...juego.claves]
        nuevasClaves.splice(claveIndex, 1)
        return {
          ...juego,
          claves: nuevasClaves
        }
      }
      return juego
    })

    setJuegosList(nuevosJuegos)
    localStorage.setItem("juegos", JSON.stringify(nuevosJuegos))
  }

  return (
    <section className="admin-panel">
      <h2><i className="fas fa-user-shield"></i> Panel de Administrador</h2>

      {/* Sección de Descuentos */}
      <div className="admin-section">
        <h3><i className="fas fa-tags"></i> Gestión de Descuentos</h3>
        <div className="discount-controls">
          <select 
            value={selectedGame?.id || ''} 
            onChange={(e) => {
              const game = juegosList.find(g => g.id === Number(e.target.value))
              setSelectedGame(game || null)
              setDescuento(game?.descuento || 0)
            }}
            className="form-select"
          >
            <option value="">Seleccionar juego</option>
            {juegosList.map(juego => (
              <option key={juego.id} value={juego.id}>
                {juego.nombre} - ${juego.precio}
              </option>
            ))}
          </select>

          <div className="discount-input">
            <label>Porcentaje de descuento:</label>
            <input
              type="number"
              min="0"
              max="100"
              value={descuento}
              onChange={(e) => setDescuento(Number(e.target.value))}
              className="form-control"
            />
          </div>

          <button 
            onClick={aplicarDescuento}
            disabled={!selectedGame}
            className="btn-primary"
          >
            Aplicar Descuento
          </button>
        </div>
      </div>

      {/* Sección de Claves */}
      <div className="admin-section">
        <h3><i className="fas fa-key"></i> Gestión de Claves</h3>
        <div className="keys-controls">
          <select 
            value={selectedGame?.id || ''} 
            onChange={(e) => {
              const game = juegosList.find(g => g.id === Number(e.target.value))
              setSelectedGame(game || null)
            }}
            className="form-select"
          >
            <option value="">Seleccionar juego</option>
            {juegosList.map(juego => (
              <option key={juego.id} value={juego.id}>
                {juego.nombre}
              </option>
            ))}
          </select>

          <div className="key-input">
            <label>Cantidad de claves a generar:</label>
            <input
              type="number"
              min="1"
              max="100"
              value={cantidadClaves}
              onChange={(e) => setCantidadClaves(Number(e.target.value))}
              className="form-control"
            />
          </div>

          <button 
            onClick={generarClaves}
            disabled={!selectedGame}
            className="btn-primary"
          >
            Generar Claves
          </button>
        </div>

        {selectedGame && (
          <div className="keys-list">
            <h4>Claves disponibles para {selectedGame.nombre}</h4>
            {(!selectedGame.claves || selectedGame.claves.length === 0) ? (
              <p>No hay claves disponibles</p>
            ) : (
              <ul>
                {selectedGame.claves.map((clave, index) => (
                  <li key={index}>
                    {clave}
                    <button 
                      onClick={() => eliminarClave(selectedGame.id, index)}
                      className="btn-danger"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="admin-stats">
        <p>Total de usuarios registrados: <strong>{usuarios.length}</strong></p>
        <p>Usuarios pendientes de verificación: <strong>{pendientes.length}</strong></p>
      </div>

      <div className="admin-table-container">
        <h3><i className="fas fa-users"></i> Lista de Usuarios Verificados</h3>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u, i) => (
                <tr key={i}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <button onClick={() => handleEliminar(u.usuarioId)} className="btn-danger">
                      <i className="fas fa-trash"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3><i className="fas fa-user-clock"></i> Usuarios Pendientes</h3>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Fecha Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.map((u, i) => (
                <tr key={i}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.fechaRegistro!).toLocaleString()}</td>
                  <td>
                    <button onClick={() => verificarUsuario(u.email)} className="btn-success">
                      <i className="fas fa-check"></i> Verificar
                    </button>
                    <button onClick={() => eliminarPendiente(u.email)} className="btn-danger">
                      <i className="fas fa-trash"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AdminPanel
