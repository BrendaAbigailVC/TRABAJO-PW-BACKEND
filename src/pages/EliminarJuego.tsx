import Boton from "../components/Boton"
import Modal from "../components/Modal";
import Titulo from "../components/Titulo"

interface EliminarJuegoProps {
    onCancelar: () => void;
    onConfirmar: () => void;
}

const EliminarJuego = ({ onCancelar, onConfirmar }: EliminarJuegoProps) => {
    return (
        <Modal  onCerrar={onCancelar}>
            <Titulo texto="¿Estas seguro que deseas eliminar este registro?" />
            <div className="row-btn1">
                <Boton tipo="button" texto="Cancelar" onClick={onCancelar} />
                <Boton tipo="button" texto="Eliminar" onClick={onConfirmar} />
            </div>
        </Modal>
    )
}

export default EliminarJuego