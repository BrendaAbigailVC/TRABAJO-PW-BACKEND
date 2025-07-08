import { useState, useEffect } from "react";
import Boton from "../components/Boton";
import Formulario from "../components/Formulario";
import Titulo from "../components/Titulo";
import type { Game } from "../data/games";
import Modal from "../components/Modal";
import type { Categoria, Plataforma } from '../data/models';
import { obtenerCategorias, obtenerPlataformas } from '../services/juegosService';

interface EditarJuegoProps {
  juego: Game;

  onEditarJuego: (juego: Game) => void;
  onCerrar: () => void;
}

const EditarJuego = ({ juego, onEditarJuego, onCerrar }: EditarJuegoProps) => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Terror");
  const [precio, setPrecio] = useState("");
  const [descuento, setDescuento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [plataforma, setPlataforma] = useState('');
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imagenesAdicionales, setImagenesAdicionales] = useState<string[]>([]);
  const [mostrarMiniModal, setMostrarMiniModal] = useState(false);
  const [urlImagen, setUrlImagen] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const cats = await obtenerCategorias();
      setCategorias(cats);
      const plats = await obtenerPlataformas();
      setPlataformas(plats);
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    setNombre(juego.nombre || "");
    setCategoria(juego.categoria || "Terror");
    setPrecio(juego.precio !== undefined ? juego.precio.toString() : "");
    setDescuento(juego.descuento !== undefined ? juego.descuento.toString() : "0");
    setDescripcion(juego.descripcion || "");
    setPlataforma(juego.plataforma || "");
    setPreview(typeof juego.imagen === 'string' ? juego.imagen : null);
    setArchivoImagen(null);
    setImagenesAdicionales(juego.imagenes ?? []);
  }, [juego]);

  const agregarCampoImagen = () => {
    setImagenesAdicionales([...imagenesAdicionales, ""]);
  };

  const eliminarCampoImagen = (index: number) => {
    const nuevas = [...imagenesAdicionales];
    nuevas.splice(index, 1);
    setImagenesAdicionales(nuevas);
  };

  const handleImagenUrlChange = (index: number, nuevaUrl: string) => {
    const nuevas = [...imagenesAdicionales];
    nuevas[index] = nuevaUrl;
    setImagenesAdicionales(nuevas);
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArchivoImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSubmit = async () => {
    if (!categoria) {
      console.log("Selecciona una categoría");
      return;
    }
    if (!plataforma) {
      console.log("Selecciona una plataforma");
      return;
    }

    const precioNumber = parseFloat(precio);
    const descuentoNumber = parseFloat(descuento);

    if (isNaN(precioNumber) || isNaN(descuentoNumber)) {
      console.log("Precio y descuento deben ser números válidos");
      return;
    }

    if (precioNumber < 0 || descuentoNumber < 0 || descuentoNumber > 100) {
      console.log("Precio o descuento fuera de rango");
      return;
    }

    const imagenesValidas = imagenesAdicionales.filter((url) => url.trim() !== "");

    const juegoEditado: Game = {
      ...juego,
      nombre,
      categoria,
      precio: precioNumber,
      descuento: descuentoNumber,
      descripcion,
      plataforma,
      imagen: preview ? preview : juego.imagen,
      imagenes: imagenesValidas,
      oferta: juego.oferta ?? false,
      ventas: juego.ventas ?? 0,
      valoracion: juego.valoracion ?? 0,
      trailer: juego.trailer ?? '',
    };

    onEditarJuego(juegoEditado);
    onCerrar();
  };

  return (
    <Modal onCerrar={onCerrar}>
      <Titulo texto="Editar juego" />
      <Formulario >
        <div className="d-flex flex-row gap-4 justify-content-center align-items-start">
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
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

            <label htmlFor="precio">Precio</label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
              min={0}
              step="0.01"
            />

            <label htmlFor="descuento">Descuento (%)</label>
            <input
              type="number"
              id="descuento"
              name="descuento"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
              min={0}
              max={100}
              step={1}
            />
          </div>

          <div>
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>

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
        <Boton tipo="submit" texto="Guardar" onClick={handleSubmit} />
      </div>
    </Modal>
  );
};

export default EditarJuego;
