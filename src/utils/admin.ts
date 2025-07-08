import { hashPassword } from './hash'

export function inicializarAdmin() {
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
  const adminExiste = usuarios.some((user: any) => user.email === "admin@admin.com")

  if (!adminExiste) {
    const admin = {
      name: "Administrador",
      email: "admin@admin.com",
      password: hashPassword("admin")
    }
    usuarios.push(admin)
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
    console.log("Cuenta de administrador creada automáticamente.")
  }
}
