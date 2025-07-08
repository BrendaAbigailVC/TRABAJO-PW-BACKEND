import type { ReactNode } from "react";
import '../styles/Modal.css'

interface ModalProps {
  children: ReactNode;      
  mostrarCerrar?: boolean;          
  onCerrar?: () => void;             
}

const Modal = ({ children, mostrarCerrar = false, onCerrar }: ModalProps) => {
  return (
    <div className="mi-modal">
      <div className="mi-modal-contenido">
        {mostrarCerrar && (
          <button className="cerrar-modal" onClick={onCerrar}>
            &times;
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
