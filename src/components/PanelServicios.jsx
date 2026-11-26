import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { useProductos } from '../context/ProductosContext';

const formVacio = { nombre: '', descripcion: '', precio: '' };

function PanelServicios() {
  const { productos, agregarProducto, editarProducto, eliminarProducto } = useProductos();
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.nombre.trim() === '' || form.descripcion.trim() === '' || form.precio === '') {
      alert('Completa todos los campos');
      return;
    }

    const servicio = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio)
    };
    const mensaje = editandoId ? 'Plan actualizado' : 'Plan agregado al catálogo';
    const peticion = editandoId
      ? editarProducto(editandoId, servicio)
      : agregarProducto(servicio);

    peticion.then(() => {
      setForm(formVacio);
      setEditandoId(null);
      alert(mensaje);
    }).catch(() => {
      alert('No se pudo guardar el plan. Revisa que el backend esté encendido y que tu sesión siga activa.');
    });
  };

  const handleEditar = (producto) => {
    setEditandoId(producto.id);
    setForm({ nombre: producto.nombre, descripcion: producto.descripcion, precio: producto.precio });
  };

  const handleEliminar = (id) => {
    eliminarProducto(id).catch(() => {
      alert('No se pudo eliminar el plan.');
    });
  };

  const handleCancelar = () => {
    setForm(formVacio);
    setEditandoId(null);
  };

  return (
    <div>
      <h3>{editandoId ? 'Editar plan' : 'Agregar plan'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0' }}>
        <Form.Group className="mb-3" controlId="servicioNombre">
          <Form.Label>Nombre del plan</Form.Label>
          <Form.Control
            type="text"
            className="caja"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Plan Detox"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="servicioDescripcion">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            className="caja"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Describe el plan..."
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="servicioPrecio">
          <Form.Label>Precio (CLP)</Form.Label>
          <Form.Control
            type="number"
            className="caja"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            placeholder="25000"
          />
        </Form.Group>

        <Button type="submit" className="btn-principal">
          {editandoId ? 'Actualizar plan' : 'Agregar al catálogo'}
        </Button>
        {editandoId && (
          <Button type="button" className="btn-secundario" style={{ marginLeft: '10px' }} onClick={handleCancelar}>
            Cancelar
          </Button>
        )}
      </Form>

      <h3 style={{ marginTop: '30px' }}>Planes actuales ({productos.length})</h3>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>${p.precio.toLocaleString('es-CL')}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => handleEditar(p)}>Editar</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => handleEliminar(p.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PanelServicios;
