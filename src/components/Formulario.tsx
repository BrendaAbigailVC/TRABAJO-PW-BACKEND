import "../styles/Formulario.css";

interface FormularioProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Formulario = ({ children, onSubmit }: FormularioProps) => {
  return (
    <form className="formulario-contenedor" onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default Formulario;
