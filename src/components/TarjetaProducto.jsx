import { Link } from 'react-router-dom';

function TarjetaProducto({ imagen, nombre, descripcion, precio, link }) {
  return (
    <article className="tarjeta-producto" data-precio={precio}>
      <div className="imagen-producto">
        <img src={imagen} alt={nombre} />
      </div>
      <h3>{nombre}</h3>
      <p className="descripcion-producto">{descripcion}</p>
      <p className="precio">${precio.toLocaleString('es-CL')}</p>

      {link ? (
        <Link to={link} className="btn-principal">
          Ver Detalle
        </Link>
      ) : (
        <button className="btn-principal">
          Ver Detalle
        </button>
      )}
    </article>
  );
}

export default TarjetaProducto;
