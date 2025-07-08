import type { ReactNode } from 'react';
import '../styles/Boton.css';

interface BotonProps {
  texto: ReactNode;
  tipo?: 'button' | 'submit';
  onClick?: () => void;
}

const Boton = ({ texto, tipo = 'button', onClick }: BotonProps) => {
  return (
    <div>
      <button type={tipo} className="btn-primary" onClick={onClick}>
        {texto}
      </button>
    </div>
  );
};

export default Boton;
