import type { Game } from "../data/games"

const BASE_URL = "http://localhost:5000"

export const obtenerJuegos = async () => {
  const resp = await fetch(`${BASE_URL}/juegos`)
  if (!resp.ok) {
    throw new Error("Error al obtener juegos")
  }
  return await resp.json()
}

export const eliminarJuego = async (id: number) => {
  const resp = await fetch(`${BASE_URL}/juegos/${id}`, {
    method: 'DELETE'
  });
  if (!resp.ok) {
    throw new Error('Error al eliminar el juego');
  }
};

export const agregarJuego = async (juego: any) => {
  const resp = await fetch(`${BASE_URL}/juegos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(juego),
  })
  return await resp.json()
}


export const obtenerCategorias = async () => {
  const resp = await fetch(`${BASE_URL}/juegos/categorias`);
  if (!resp.ok) throw new Error("Error al obtener categorías");
  return await resp.json();
};

export const obtenerPlataformas = async () => {
  const resp = await fetch(`${BASE_URL}/juegos/plataformas`);
  if (!resp.ok) throw new Error("Error al obtener plataformas");
  return await resp.json();
};


export const obtenerJuegoPorId = async (id: number) => {
  const resp = await fetch(`${BASE_URL}/juegos/${id}`);
  if (!resp.ok) throw new Error("Error al obtener el juego");
  return await resp.json();
};

export const editarJuego = async (juego: Game): Promise<Game> => {
  try {
    const response = await fetch(`${BASE_URL}/juegos/${juego.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(juego),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el juego");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en editarJuego (frontend):", error);
    throw error;
  }
};

interface FiltroParams {
  categoria?: string;
  fecha?: string;
  precioMin?: number;
  precioMax?: number;
  plataforma?: string;
}

export const filtrarJuegosService = async (filtros: FiltroParams): Promise<Game[]> => {
  const params = new URLSearchParams();

  if (filtros.categoria) params.append("categoria", filtros.categoria);
  if (filtros.plataforma) params.append("plataforma", filtros.plataforma);
  if (filtros.fecha) params.append("fecha", filtros.fecha);
  if (filtros.precioMin !== undefined) params.append("precioMin", filtros.precioMin.toString());
  if (filtros.precioMax !== undefined) params.append("precioMax", filtros.precioMax.toString());

  try {
    const response = await fetch(`${BASE_URL}/juegos/filtrar?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Error al filtrar juegos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en filtrarJuegosService:", error);
    throw error;
  }
};