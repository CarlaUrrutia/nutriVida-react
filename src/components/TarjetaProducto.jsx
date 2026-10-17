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
        <a href={link} className="btn-principal">
          Ver Detalle
        </a>
      ) : (
        <button className="btn-principal btn-inactivo">
          Ver Detalle
        </button>
      )}
    </article>
  );
}

export default TarjetaProducto;