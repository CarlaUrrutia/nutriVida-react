import { createContext, useContext, useState, useEffect } from 'react';
import { productosData } from '../data/productos';
import imagenGenerica from '../assets/img/generica.jpg';
import ServicioService from '../services/ServicioService';

const ProductosContext = createContext();

const aProducto = (servicio) => {
  const conocido = productosData.find((p) => p.nombre === servicio.nombre);
  return {
    id: servicio.id_servicio,
    nombre: servicio.nombre,
    descripcion: servicio.descripcion || '',
    precio: servicio.precio || 0,
    imagen: conocido ? conocido.imagen : imagenGenerica,
    duracion: '45 minutos'
  };
};

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarProductos = () => {
    return ServicioService.getAllServicios().then((response) => {
      setProductos(response.data.map(aProducto));
      setCargando(false);
    }).catch(() => {
      setProductos([]);
      setCargando(false);
    });
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarProducto = (nuevo) => {
    return ServicioService.createServicio(nuevo).then(() => cargarProductos());
  };

  const editarProducto = (id, datos) => {
    return ServicioService.updateServicio(id, datos).then(() => cargarProductos());
  };

  const eliminarProducto = (id) => {
    return ServicioService.deleteServicio(id).then(() => cargarProductos());
  };

  return (
    <ProductosContext.Provider value={{ productos, cargando, agregarProducto, editarProducto, eliminarProducto }}>
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  return useContext(ProductosContext);
}
