import GaleriaProductos from '../components/GaleriaProductos';
import { useProductos } from '../context/ProductosContext';

function Productos() {
  const { productos } = useProductos();

  return (
    <main id="contenido">
      <GaleriaProductos productos={productos} titulo="Planes Nutricionales" />
    </main>
  );
}

export default Productos;
