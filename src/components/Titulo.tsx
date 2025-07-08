interface TituloProps {
    texto : string
}

const Titulo =(props : TituloProps) => {
    return <h1 className="text-white">{props.texto}</h1>
}

export default Titulo