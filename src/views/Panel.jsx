import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';
import { useProductos } from '../context/ProductosContext';

function Panel() {
  const { usuario, cerrarSesion } = useAuth();
  const { productos, agregarProducto } = useProductos();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracion, setDuracion] = useState('45 minutos');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (nombre.trim() === '' || descripcion.trim() === '' || precio === '') {
      alert('Completa todos los campos');
      return;
    }

    agregarProducto({ nombre, descripcion, precio: Number(precio), duracion });

    setNombre('');
    setDescripcion('');
    setPrecio('');
    setDuracion('45 minutos');
    alert('Plan agregado al catálogo');
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <main id="contenido">
      <section className="seccion" style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ margin: 0 }}>Panel de Control</h2>
          <button className="btn-secundario" style={{ width: 'auto' }} onClick={handleCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
        <p>Sesión iniciada como {usuario?.email}</p>

        <Form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0' }}>
          <Form.Group className="mb-3" controlId="nombrePlan">
            <Form.Label>Nombre del plan</Form.Label>
            <Form.Control
              type="text"
              className="caja"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Plan Detox"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="descripcionPlan">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              className="caja"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe el plan..."
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="precioPlan">
            <Form.Label>Precio (CLP)</Form.Label>
            <Form.Control
              type="number"
              className="caja"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="25000"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="duracionPlan">
            <Form.Label>Duración de la sesión</Form.Label>
            <Form.Select
              className="caja"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
            >
              <option value="30 minutos">30 minutos</option>
              <option value="45 minutos">45 minutos</option>
              <option value="60 minutos">60 minutos</option>
              <option value="90 minutos">90 minutos</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" className="btn-principal">
            Agregar al catálogo
          </Button>
        </Form>

        <h3 style={{ marginTop: '30px' }}>Planes actuales ({productos.length})</h3>
        <ul>
          {productos.map((p) => (
            <li key={p.id}>{p.nombre} — ${p.precio.toLocaleString('es-CL')} — {p.duracion}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Panel;
