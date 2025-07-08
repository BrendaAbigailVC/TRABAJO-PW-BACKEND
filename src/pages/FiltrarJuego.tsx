import { useState, useEffect } from "react";
import Boton from "../components/Boton";
import Formulario from "../components/Formulario";
import Titulo from "../components/Titulo";
import Modal from "../components/Modal";
import { obtenerCategorias, obtenerPlataformas } from '../services/juegosService';
import type { Categoria, Plataforma } from '../data/models';


interface FiltrarJuegoProps {
    onFiltrar: (filtro: {
        fecha?: string;
        categoria: string;
        plataforma: string;
        precioMin?: number;
        precioMax?: number;
    }) => void;
    onCerrar: () => void;
}

const FiltrarJuego = ({ onFiltrar, onCerrar }: FiltrarJuegoProps) => {
    const [fecha, setFecha] = useState('');
    const [categoria, setCategoria] = useState('');
    const [plataforma, setPlataforma] = useState('');
    const [precioMin, setPrecioMin] = useState<number | undefined>();
    const [precioMax, setPrecioMax] = useState<number | undefined>();
    const [error, setError] = useState<string | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [plataformas, setPlataformas] = useState<Plataforma[]>([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const cats = await obtenerCategorias();
                console.log("CATEGORÍAS DESDE BACKEND:", cats);
                setCategorias(cats);
            } catch (e) {
                console.error("Error cargando categorías", e);
            }

            try {
                const plats = await obtenerPlataformas();
                setPlataformas(plats);
            } catch (e) {
                console.error("Error cargando plataformas", e);
            }
        };

        cargarDatos();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            precioMin !== undefined &&
            precioMax !== undefined &&
            precioMin > precioMax
        ) {
            setError("El precio mínimo no puede ser mayor que el máximo");
            return;
        }

        setError(null);

        onFiltrar({
            fecha,
            categoria,
            plataforma,
            precioMin,
            precioMax
        });

        onCerrar();
    };

    return (
        <Modal onCerrar={onCerrar}>
            <Titulo texto="Filtrar Juegos" />
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <Formulario onSubmit={handleSubmit}>
                <label htmlFor="lanzamiento-fecha">Fecha de lanzamiento desde</label>
                <input
                    type="date"
                    id="lanzamiento-fecha"
                    name="lanzamiento-fecha"
                    value={fecha ?? ''}
                    onChange={(e) => setFecha(e.target.value)}
                />

                <label htmlFor="categoria">Categoría</label>
                <select id="categoria" value={categoria} onChange={e => setCategoria(e.target.value)}>
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(cat => (
                        <option key={cat.categoriaId} value={cat.nombre}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>

                <label htmlFor="plataforma">Plataforma</label>
                <select id="plataforma" value={plataforma} onChange={(e) => setPlataforma(e.target.value)}>
                    <option value="">Selecciona una plataforma</option>
                    {plataformas.map(plat => (
                        <option key={plat.plataformaId} value={plat.nombre}>
                            {plat.nombre}
                        </option>
                    ))}
                </select>

                <label>Rango de precios</label>
                <div className="d-flex flex-row gap-4 justify-content-center align-items-start">
                    <input
                        type="number"
                        value={precioMin ?? ""}
                        min={0}
                        step={0.01}
                        onChange={(e) => setPrecioMin(e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <span style={{ margin: "0 0.5rem" }}>a</span>
                    <input
                        type="number"
                        value={precioMax ?? ""}
                        min={0}
                        step={0.01}
                        onChange={(e) => setPrecioMax(e.target.value ? Number(e.target.value) : undefined)}
                    />
                </div>

                <div className="row-btn1">
                    <Boton tipo="button" texto="Cancelar" onClick={onCerrar} />
                    <Boton tipo="submit" texto="Aplicar" />
                </div>
            </Formulario>
        </Modal>
    );
};

export default FiltrarJuego;
