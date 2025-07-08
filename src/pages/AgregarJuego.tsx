import { useState, useEffect } from 'react';
import Boton from "../components/Boton";
import Formulario from "../components/Formulario";
import Titulo from "../components/Titulo";
import Modal from '../components/Modal';
import type { GameInput } from '../types';
import { obtenerCategorias, obtenerPlataformas } from '../services/juegosService';
import type { Categoria, Plataforma } from '../data/models';

interface AgregarJuegoProps {
    onAgregarJuego: (juego: GameInput) => void;
    onCerrar: () => void;
}

const AgregarJuego = ({ onAgregarJuego, onCerrar }: AgregarJuegoProps) => {
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [precio, setPrecio] = useState('');
    const [descuento, setDescuento] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [plataforma, setPlataforma] = useState('');
    const [imagen, setImagen] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
    const [trailer, setTrailer] = useState('');
    const [imagenesAdicionales, setImagenesAdicionales] = useState<string[]>(['']);
    const [mostrarMiniModal, setMostrarMiniModal] = useState(false);
    const [urlImagen, setUrlImagen] = useState('');

    const handleImagenUrlChange = (index: number, value: string) => {
        const nuevasImagenes = [...imagenesAdicionales];
        nuevasImagenes[index] = value;
        setImagenesAdicionales(nuevasImagenes);
    };

    const agregarCampoImagen = () => {
        setImagenesAdicionales([...imagenesAdicionales, '']);
    };

    const eliminarCampoImagen = (index: number) => {
        const nuevas = imagenesAdicionales.filter((_, i) => i !== index);
        setImagenesAdicionales(nuevas);
    };

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

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagen(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAgregarJuego = async () => {
        if (!nombre || !categoria || !precio || !descripcion || !plataforma || !preview || !trailer) {
            console.log('Por favor, completa todos los campos obligatorios y sube una imagen.');
            return;
        }

        const precioNumerico = parseFloat(precio);
        const descuentoNumerico = parseFloat(descuento) || 0;

        const nuevoJuego: GameInput = {
            nombre,
            descripcion,
            categoria,
            plataforma,
            precio: precioNumerico,
            descuento: descuentoNumerico,
            oferta: descuentoNumerico > 0,
            ventas: 0,
            valoracion: 0,
            imagen: preview,
            trailer,
            imagenes: imagenesAdicionales.filter((url) => url.trim() !== '')
        };

        onAgregarJuego(nuevoJuego);
        limpiarFormulario();
        onCerrar();
    };

    const limpiarFormulario = () => {
        setNombre('');
        setCategoria('');
        setPrecio('');
        setDescuento('');
        setDescripcion('');
        setPlataforma('');
        setImagen(null);
        setPreview(null);
    };

    return (
        <Modal onCerrar={onCerrar}>
            <Titulo texto="Agregar juego" />
            <Formulario>
                <div className="d-flex flex-row gap-4 justify-content-center align-items-start">
                    <div>
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />

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

                        <label htmlFor="precio">Precio</label>
                        <input type="number" id="precio" value={precio} onChange={(e) => setPrecio(e.target.value)} />

                        <label htmlFor="descuento">Descuento (%)</label>
                        <input type="number" id="descuento" value={descuento} onChange={(e) => setDescuento(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

                        <label htmlFor="trailer">Trailer</label>
                        <input type="text" id="trailer" value={trailer} onChange={(e) => setTrailer(e.target.value)} />

                        <label className="form-label">Imagen principal</label>
                        <div className="imagen-subida-container">

                            <div className="d-flex justify-content-start mb-3">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setMostrarMiniModal(true)}
                                >
                                    Subir imagen
                                </button>
                            </div>

                            {preview && (
                                <div className="preview-container">
                                    <img src={preview} alt="Vista previa" />
                                </div>
                            )}
                        </div>

                        {mostrarMiniModal && (
                            <div className="mini-modal-backdrop">
                                <div className="mini-modal">
                                    <h5>Subir imagen principal</h5>

                                    <div className="mt-3">
                                        <label htmlFor="imagenArchivo" className="form-label">Desde computadora</label>
                                        <input
                                            type="file"
                                            id="imagenArchivo"
                                            accept="image/*"
                                            onChange={handleImagenChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mt-3">
                                        <label htmlFor="urlImagen" className="form-label">Desde URL</label>
                                        <input
                                            type="text"
                                            id="urlImagen"
                                            value={urlImagen}
                                            onChange={(e) => setUrlImagen(e.target.value)}
                                            placeholder="https://ejemplo.com/imagen.jpg"
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between mt-4">

                                        <button
                                            className="btn btn-sm btn-secondary mt-2"
                                            onClick={() => setMostrarMiniModal(false)}
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            className="btn btn-sm btn-secondary mt-2"
                                            onClick={() => {
                                                if (urlImagen) {
                                                    setPreview(urlImagen);
                                                }
                                                setMostrarMiniModal(false);
                                            }}
                                        >
                                            Usar imagen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <label>Imágenes adicionales</label>
                        {imagenesAdicionales.map((url, index) => (
                            <div key={index} className="d-flex flex-row gap-2 align-items-center mb-2">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => handleImagenUrlChange(index, e.target.value)}
                                    placeholder={`Imagen ${index + 1}`}
                                    style={{ flexGrow: 1 }}
                                />
                                <button type="button" onClick={() => eliminarCampoImagen(index)} className="btn btn-sm btn-danger">X</button>
                            </div>
                        ))}
                        <button type="button" onClick={agregarCampoImagen} className="btn btn-sm btn-secondary mt-2">
                            + Añadir otra imagen
                        </button>

                    </div>
                </div>
            </Formulario>

            <div className="row-btn1">
                <Boton tipo="button" texto="Cancelar" onClick={onCerrar} />
                <Boton tipo="button" texto="Enviar" onClick={handleAgregarJuego} />
            </div>
        </Modal>
    );
};

export default AgregarJuego;
