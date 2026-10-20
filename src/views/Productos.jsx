import GaleriaProductos from '../components/GaleriaProductos';
import { productosData } from '../data/productos';

function Productos() {
  return (
    <main id="contenido">
      <GaleriaProductos productos={productosData} titulo="Planes Nutricionales" />
    </main>
  );
}

export default Productos;
