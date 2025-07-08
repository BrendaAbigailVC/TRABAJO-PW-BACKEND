import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'
import AgregarJuego from './AgregarJuego';
import EliminarJuego from './EliminarJuego';
import FiltrarJuego from './FiltrarJuego';
import Boton from "../components/Boton";
import Titulo from "../components/Titulo";
import EditarJuego from './EditarJuego';
import { type Game } from '../data/games';
import '../styles/Juegos.css';
import { obtenerJuegos, eliminarJuego, agregarJuego as agregarJuegoService, obtenerJuegoPorId, editarJuego as editarJuegoService, filtrarJuegosService } from '../services/juegosService'
import type { GameInput } from '../types';

interface Filtro {
    fecha?: string;
    categoria: string;
    plataforma: string;
    precioMin?: number;
    precioMax?: number;
}

const Juegos = () => {
    console.log("Página Juegos renderizada");
    const [juegos, setJuegos] = useState<Game[]>([]);
    const [mostrarModAgregar, setMostrarModAgregar] = useState(false);
    const [mostrarEditarJuego, setMostrarEditarJuego] = useState(false);
    const [juegoAEliminar, setJuegoAEliminar] = useState<Game | null>(null);
    const [juegoAEditar, setJuegoAEditar] = useState<Game | null>(null);
    const [mostrarFiltro, setMostrarFiltro] = useState(false);
    const [filtrosActivos, setFiltrosActivos] = useState<Filtro | null>(null);

    useEffect(() => {
        const cargarJuegos = async () => {
            try {
                const data = await obtenerJuegos()
                setJuegos(data)
            } catch (error) {
                console.error("Error al obtener juegos:", error)
            }
        }
        cargarJuegos()
    }, [])

    const actualizarJuegos = (nuevosJuegos: Game[]) => {
        setJuegos(nuevosJuegos);
        localStorage.setItem('juegos', JSON.stringify(nuevosJuegos));
    };

    const agregarJuego = async (nuevoJuego: GameInput) => {
        try {
            await agregarJuegoService(nuevoJuego);
            const juegosActualizados = await obtenerJuegos();
            setJuegos(juegosActualizados);
        } catch (error) {
            console.error("Error al agregar juego:", error);
        }
    };


    const handleEliminar = async () => {
        if (!juegoAEliminar) return;

        try {
            await eliminarJuego(juegoAEliminar.id);
            const nuevos = juegos.filter(j => j.id !== juegoAEliminar.id);
            setJuegos(nuevos);
            setJuegoAEliminar(null);
        } catch (error) {
            console.error("Error al eliminar juego:", error);
        }
    };

    const editarJuego = async (juegoActualizado: Game) => {
        try {
            const juegoDesdeServidor = await editarJuegoService(juegoActualizado);

            setJuegos((prev) =>
                prev.map((j) => (j.id === juegoDesdeServidor.id ? juegoDesdeServidor : j))
            );
        } catch (error) {
            console.error("Error al editar juego:", error);
        }
    };

    const handleEditarClick = (juego: Game) => {
        setJuegoAEditar(juego);
        setMostrarEditarJuego(true);
    };

    const aplicarFiltro = async (filtros: Filtro) => {
        try {
            const filtrosLimpios: any = {};

            if (filtros.categoria) filtrosLimpios.categoria = filtros.categoria;
            if (filtros.plataforma) filtrosLimpios.plataforma = filtros.plataforma;
            if (filtros.fecha) filtrosLimpios.fecha = filtros.fecha;
            if (filtros.precioMin !== undefined) filtrosLimpios.precioMin = filtros.precioMin;
            if (filtros.precioMax !== undefined) filtrosLimpios.precioMax = filtros.precioMax;

            const juegosFiltrados = await filtrarJuegosService(filtrosLimpios);
            setJuegos(juegosFiltrados);
        } catch (error) {
            console.error("Error al aplicar filtros:", error);
        }
    };

    return (
        <div className="d-flex flex-column w-100 h-100">
            <div className="pagina-juegos">
                <div className="encabezado">
                    <Titulo texto="Juegos" />
                    <div className='row-btn2'>
                        <Boton tipo="button" texto="Filtrar" onClick={() => setMostrarFiltro(true)} />
                        {filtrosActivos && (
                            <Boton
                                tipo="button"
                                texto="Limpiar filtros"
                                onClick={async () => {
                                    setFiltrosActivos(null);
                                    try {
                                        const juegosOriginales = await obtenerJuegos();
                                        setJuegos(juegosOriginales);
                                    } catch (error) {
                                        console.error("Error al cargar juegos originales:", error);
                                    }
                                }}
                            />
                        )}
                        <Boton tipo="button" texto="+ Añadir" onClick={() => setMostrarModAgregar(true)} />
                    </div>

                </div>

                <table className="tabla-juegos">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Plataforma</th>
                            <th>Precio</th>
                            <th>Descuento</th>
                            <th>Precio final</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {juegos.map((juego) => {
                            const precioFinal = juego.oferta
                                ? (juego.precio - (juego.precio * juego.descuento / 100)).toFixed(2)
                                : juego.precio.toFixed(2);
                            return (
                                <tr key={juego.id}>
                                    <td>{juego.fecha}</td>
                                    <td>{juego.nombre}</td>
                                    <td>{juego.categoria}</td>
                                    <td>{juego.plataforma}</td>
                                    <td>${juego.precio.toFixed(2)}</td>
                                    <td>{juego.oferta ? `${juego.descuento}%` : '0%'}</td>
                                    <td>${precioFinal}</td>
                                    <td>
                                        <div className='row-btn1'>
                                            <Boton
                                                tipo="button"
                                                texto={<FaEdit />}
                                                onClick={async () => {
                                                    try {
                                                        const juegoCompleto = await obtenerJuegoPorId(juego.id);
                                                        setJuegoAEditar(juegoCompleto);
                                                        setMostrarEditarJuego(true);
                                                    } catch (error) {
                                                        console.error("Error al cargar el juego para editar:", error);
                                                    }
                                                }}
                                            />
                                            <Boton
                                                tipo="button"
                                                texto={<FaTrash />}
                                                onClick={() => setJuegoAEliminar(juego)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {mostrarModAgregar && (
                <AgregarJuego
                    onAgregarJuego={agregarJuego}
                    onCerrar={() => setMostrarModAgregar(false)}
                />
            )}

            {juegoAEliminar && (
                <EliminarJuego
                    onConfirmar={handleEliminar}
                    onCancelar={() => setJuegoAEliminar(null)}
                />
            )}

            {mostrarEditarJuego && juegoAEditar && (
                <EditarJuego
                    juego={juegoAEditar}
                    onEditarJuego={editarJuego}
                    onCerrar={() => {
                        setMostrarEditarJuego(false);
                        setJuegoAEditar(null);
                    }}
                />
            )}

            {mostrarFiltro && (
                <FiltrarJuego
                    onFiltrar={(filtroAplicado) => {
                        setFiltrosActivos(filtroAplicado);
                        aplicarFiltro(filtroAplicado);
                        setMostrarFiltro(false);
                    }}
                    onCerrar={() => setMostrarFiltro(false)}
                />
            )}

        </div>
    );
};

export default Juegos;
