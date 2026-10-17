import Seccion from '../components/Seccion';
import GaleriaProductos from '../components/GaleriaProductos';
import { productosData } from '../data/productos';

function Productos() {
  return (
    <main id="contenido">
      <Seccion id="catalogo-planes" titulo="Planes Nutricionales">
        <GaleriaProductos productos={productosData} />
      </Seccion>
    </main>
  );
}

export default Productos;