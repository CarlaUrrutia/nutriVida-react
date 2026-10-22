import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

function Carrito() {
  const { carrito, quitarDelCarrito, vaciarCarrito } = useCarrito();

  const total = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  const handleFinalizar = () => {
    if (carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    alert('¡Compra realizada con éxito!');
    vaciarCarrito();
  };

  if (carrito.length === 0) {
    return (
      <main id="contenido">
        <section className="seccion">
          <h2>Tu Carrito</h2>
          <p>Todavía no has agregado ningún plan.</p>
          <Link to="/productos" className="btn-principal" style={{ width: 'auto', display: 'inline-block' }}>
            Ver Planes
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main id="contenido">
      <section className="seccion">
        <h2>Tu Carrito</h2>

        <div className="galeria">
          {carrito.map((item) => (
            <article key={item.id} className="tarjeta-producto" data-precio={item.precio}>
              <div className="imagen-producto">
                <img src={item.imagen} alt={item.nombre} />
              </div>
              <h3>{item.nombre}</h3>
              <p className="descripcion-producto">Cantidad: {item.cantidad}</p>
              <p className="precio">${(item.precio * item.cantidad).toLocaleString('es-CL')}</p>
              <button className="btn-secundario" onClick={() => quitarDelCarrito(item.id)}>
                Quitar
              </button>
            </article>
          ))}
        </div>

        <div className="detalle-meta" style={{ maxWidth: '400px', margin: '30px auto', textAlign: 'center' }}>
          <p className="precio" style={{ fontSize: '1.5rem' }}>
            Total: ${total.toLocaleString('es-CL')}
          </p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            className="btn-principal"
            style={{ width: 'auto', display: 'inline-block' }}
            onClick={handleFinalizar}
          >
            Finalizar Compra
          </button>
        </div>
      </section>
    </main>
  );
}

export default Carrito;
