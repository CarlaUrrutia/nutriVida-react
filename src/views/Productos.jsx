import GaleriaProductos from '../components/GaleriaProductos';
import { useProductos } from '../context/ProductosContext';

function Productos() {
  const { productos, cargando } = useProductos();

  if (cargando) {
    return (
      <main id="contenido">
        <p>Cargando planes...</p>
      </main>
    );
  }

  return (
    <main id="contenido">
      <GaleriaProductos productos={productos} titulo="Planes Nutricionales" />
    </main>
  );
}

export default Productos;
