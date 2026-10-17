import TarjetaProducto from './TarjetaProducto';

function GaleriaProductos({ productos }) {
  const [listaProductos, setListaProductos] = useState(productos);
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  // Función para ordenar por precio 
  const ordenarPorPrecio = () => {
    const ordenados = [...listaProductos].sort((a, b) => {
      return ordenAscendente ? a.precio - b.precio : b.precio - a.precio;
    });
    setListaProductos(ordenados);
    setOrdenAscendente(!ordenAscendente);
  };

  return (
    <div className="seccion-header-galeria">
      <div className="seccion-header">
        <button className="btn-ordenar" id="btn-ordenar" onClick={ordenarPorPrecio}>
          <span id="icono-orden">{ordenAscendente ? '↑' : '↓'}</span> Ordenar por precio
        </button>
      </div>

      <div className="galeria">
        {listaProductos.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            imagen={producto.imagen}
            nombre={producto.nombre}
            descripcion={producto.descripcion}
            precio={producto.precio}
            link={producto.link}
          />
        ))}
      </div>
    </div>
  );
}

export default GaleriaProductos;