import { createContext, useContext, useState } from 'react';
import { productosData } from '../data/productos';
import imagenGenerica from '../assets/img/generica.jpg';

const ProductosContext = createContext();

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState(productosData);

  const agregarProducto = (nuevo) => {
    const nuevoId = Math.max(...productos.map((p) => p.id)) + 1;
    setProductos((prev) => [
      ...prev,
      { id: nuevoId, imagen: imagenGenerica, duracion: '45 minutos', ...nuevo }
    ]);
  };

  return (
    <ProductosContext.Provider value={{ productos, agregarProducto }}>
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  return useContext(ProductosContext);
}
