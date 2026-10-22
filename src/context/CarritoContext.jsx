import { createContext, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [mensajeToast, setMensajeToast] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });

    setMensajeToast(producto.nombre);
    setMostrarToast(true);
  };

  const quitarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => setCarrito([]);

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, quitarDelCarrito, vaciarCarrito }}>
      {children}

      {mostrarToast && (
        <div className="toast-overlay" onClick={() => setMostrarToast(false)} />
      )}
      <ToastContainer position="middle-center" className="p-3" style={{ zIndex: 1050 }}>
        <Toast show={mostrarToast} onClose={() => setMostrarToast(false)} bg="light">
          <Toast.Header>
            <strong className="me-auto">¡Agregado al carrito!</strong>
          </Toast.Header>
          <Toast.Body>
            <p style={{ margin: '0 0 10px' }}>{mensajeToast}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link
                to="/carrito"
                className="btn-principal"
                style={{ width: 'auto', padding: '6px 16px', fontSize: '14px' }}
                onClick={() => setMostrarToast(false)}
              >
                Ver Carrito
              </Link>
              <button
                className="btn-secundario"
                style={{ width: 'auto', padding: '6px 16px', fontSize: '14px' }}
                onClick={() => setMostrarToast(false)}
              >
                Seguir Comprando
              </button>
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
