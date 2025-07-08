import React, { useState, useEffect } from "react"
import Boton from "../components/Boton"
import Formulario from "../components/Formulario"
import ImgPerfil from "../components/ImgUsuario"
import Titulo from "../components/Titulo"
import Modal from "../components/Modal"

interface EditarPerfilProps {
  onCerrar: () => void
}

const EditarPerfil = ({ onCerrar }: EditarPerfilProps) => {
  const [primerNombre, setPrimerNombre] = useState("")
  const [segundoNombre, setSegundoNombre] = useState("")
  const [correo, setCorreo] = useState("")
  const [imagen, setImagen] = useState<string | undefined>(undefined)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      if (user.username) {
        const [first, second] = user.username.split(" ")
        setPrimerNombre(first || "")
        setSegundoNombre(second || "")
        setCorreo(user.email || "")
        setImagen(user.imagen)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullName = `${primerNombre} ${segundoNombre}`.trim()

    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const user = JSON.parse(storedUser)
      const userActualizado = {
        ...user,
        username: fullName,
        email: correo,
        imagen,
        password: user.password || "48690", // mantener si lo necesitas
      }

      localStorage.setItem("user", JSON.stringify(userActualizado))
      console.log("Usuario actualizado:", userActualizado)
    }
    onCerrar()
  }

  return (
    <Modal>
      <Titulo texto="Edita la información de tu perfil" />
      <ImgPerfil
        imagen={imagen}
        onImagenChange={(nuevaImagen) => setImagen(nuevaImagen)}
      />

      <Formulario onSubmit={handleSubmit}>
        <label htmlFor="primerNombre">Primer Nombre</label>
        <input
          type="text"
          id="primerNombre"
          name="primerNombre"
          value={primerNombre}
          onChange={e => setPrimerNombre(e.target.value)}
        />

        <label htmlFor="segundoNombre">Segundo Nombre</label>
        <input
          type="text"
          id="segundoNombre"
          name="segundoNombre"
          value={segundoNombre}
          onChange={e => setSegundoNombre(e.target.value)}
        />

        <label htmlFor="correo">Correo</label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
        />

        <div className="row-btn1">
          <Boton tipo="button" texto="Cancelar" onClick={onCerrar} />
          <Boton tipo="submit" texto="Guardar" />
        </div>
      </Formulario>
    </Modal>
  )
}

export default EditarPerfil
