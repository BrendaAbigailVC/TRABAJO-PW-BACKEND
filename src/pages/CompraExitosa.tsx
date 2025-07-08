
import Modal from "../components/Modal"
import Titulo from "../components/Titulo"
import '../styles/CompraExitosa.css'

const CompraExitosa = () => {
    return (
        <Modal mostrarCerrar={true}>
            <div className="mensaje-compra">
                <Titulo texto="¡Compra completada con éxito!" />
                <div className="check-icono">&#10003;</div>
            </div>
            <p className="text-white">Las claves de los juegos adquiridos se han enviado a la dirección de correo electrónico proporcionada.</p>
        </Modal>
    )
}

export default CompraExitosa