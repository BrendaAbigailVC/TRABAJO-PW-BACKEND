import React, { useRef } from "react"
import '../styles/ImgPerfil.css'

interface ImgPerfilProps {
  imagen?: string
  nombre?: string
  onImagenChange?: (imagen: string) => void
}

const ImgPerfil = ({ imagen, nombre, onImagenChange }: ImgPerfilProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = () => {
    if (onImagenChange) {
      inputRef.current?.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onImagenChange) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        onImagenChange(result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div
      style={{ textAlign: "center", cursor: onImagenChange ? "pointer" : "default" }}
      onClick={handleClick}
    >
      <div className="perfil-imagen">
        {imagen ? (
          <img
            src={imagen}
            alt={`Imagen de perfil de ${nombre || "usuario"}`}
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        ) : (
          <span>Tu imagen de perfil</span>
        )}
      </div>
      {nombre && <p className="text-white">{nombre}</p>}
      {onImagenChange && (
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={inputRef}
          onChange={handleFileChange}
        />
      )}
    </div>
  )
}

export default ImgPerfil
