
const BASE_URL = "http://localhost:5000"

export const obtenerUsuarios = async () => {
  const resp = await fetch(`${BASE_URL}/usuarios`)
  if (!resp.ok) {
    throw new Error("Error al obtener usuarios")
  }
  return await resp.json()
};

export const eliminarUsuario = async (id: number) => {
    const idu = id.toString()
  const resp = await fetch(`${BASE_URL}/usuarios/${idu}`, {
    method: 'DELETE'
  });
  if (!resp.ok) {
    throw new Error('Error al eliminar el usuario');
  }
};


