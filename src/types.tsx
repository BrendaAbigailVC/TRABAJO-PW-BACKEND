import type { Game } from "./data/games"

export type GameInput = Omit<Game, 'id' | 'reviews' | 'claves' | 'fecha'>

