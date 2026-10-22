import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useProductos } from '../context/ProductosContext';
import { useCarrito } from '../context/CarritoContext';
import { useFavoritos } from '../context/FavoritosContext';

function Producto() {
  const { id } = useParams();
  const { productos } = useProductos();
  const producto = productos.find((p) => p.id === Number(id));
  const { agregarAlCarrito } = useCarrito();
  const { esFavorito, toggleFavorito } = useFavoritos();

  const [agendado, setAgendado] = useState(false);

  const handleAgendar = () => {
    agregarAlCarrito(producto);
    setAgendado(true);
  };

  if (!producto) {
    return (
      <main id="contenido">
        <p>No encontramos ese plan.</p>
        <Link to="/productos" className="btn-secundario">← Volver al catálogo</Link>
      </main>
    );
  }

  return (
    <main id="contenido">
      <section className="detalle-producto">
        <div className="detalle-imagen">
          <img src={producto.imagen} alt={producto.nombre} />
          <button
            type="button"
            className={`btn-favorito ${esFavorito(producto.id) ? 'activo' : ''}`}
            onClick={() => toggleFavorito(producto.id)}
            aria-label={esFavorito(producto.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            {esFavorito(producto.id) ? '♥' : '♡'}
          </button>
        </div>

        <div className="detalle-info">
          <h2>{producto.nombre}</h2>
          <p className="detalle-descripcion">{producto.descripcion}</p>

          <div className="detalle-meta">
            <span>⏱ Duración: {producto.duracion}</span>
          </div>

          <p className="precio">${producto.precio.toLocaleString('es-CL')}</p>

          <div className="detalle-acciones">
            <button
              className="btn-principal"
              onClick={handleAgendar}
              disabled={agendado}
              style={agendado ? { backgroundColor: 'green' } : {}}
            >
              {agendado ? '✔ Agendado y en el carrito' : 'Agendar Hora y Agregar al Carrito'}
            </button>

            <Link to="/productos" className="btn-secundario">← Volver al catálogo</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Producto;
