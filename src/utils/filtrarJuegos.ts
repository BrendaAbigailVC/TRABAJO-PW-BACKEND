/*import type { Game } from "../data/games";

interface Filtro {
  fechaLanzamiento: string;
  categoria: string;
  precioMin: number;
  precioMax: number;
}

export function filtrarJuegos(juegos: Game[], filtro: Filtro): Game[] {
  return juegos.filter((juego) => {
    const [dia, mes, anio] = juego.fecha.split("-");
    const fechaJuego = new Date(`${anio}-${mes}-${dia}`);
    const fechaFiltro = new Date(filtro.fechaLanzamiento);

    return (
      fechaJuego >= fechaFiltro &&
      juego.categoria === filtro.categoria &&
      juego.precio >= filtro.precioMin &&
      juego.precio <= filtro.precioMax
    );
  });
}
*/