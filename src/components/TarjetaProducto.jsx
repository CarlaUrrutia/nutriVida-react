import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useFavoritos } from '../context/FavoritosContext';

function TarjetaProducto({ id, imagen, nombre, descripcion, precio }) {
  const { agregarAlCarrito } = useCarrito();
  const { esFavorito, toggleFavorito } = useFavoritos();

  return (
    <article className="tarjeta-producto" data-precio={precio}>
      <div className="imagen-producto">
        <img src={imagen} alt={nombre} />
        <button
          type="button"
          className={`btn-favorito ${esFavorito(id) ? 'activo' : ''}`}
          onClick={() => toggleFavorito(id)}
          aria-label={esFavorito(id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {esFavorito(id) ? '♥' : '♡'}
        </button>
      </div>
      <h3>{nombre}</h3>
      <p className="descripcion-producto">{descripcion}</p>
      <p className="precio">${precio.toLocaleString('es-CL')}</p>

      <Link to={`/producto/${id}`} className="btn-secundario">
        Ver Detalle
      </Link>
      <button
        className="btn-principal"
        style={{ marginTop: '8px' }}
        onClick={() => agregarAlCarrito({ id, nombre, precio, imagen })}
      >
        Agregar al Carrito
      </button>
    </article>
  );
}

export default TarjetaProducto;
