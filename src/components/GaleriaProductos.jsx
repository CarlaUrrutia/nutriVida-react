import { useState } from 'react';
import TarjetaProducto from './TarjetaProducto';

function GaleriaProductos({ productos, titulo }) {
  const [listaProductos, setListaProductos] = useState(productos);
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const ordenarPorPrecio = () => {
    const ordenados = [...listaProductos].sort((a, b) => {
      return ordenAscendente ? a.precio - b.precio : b.precio - a.precio;
    });
    setListaProductos(ordenados);
    setOrdenAscendente(!ordenAscendente);
  };

  return (
    <div>
      <div className="seccion-header">
        {titulo && <h2>{titulo}</h2>}
        <button className="btn-ordenar" onClick={ordenarPorPrecio}>
          <span>{ordenAscendente ? '↑' : '↓'}</span> Ordenar por precio
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
