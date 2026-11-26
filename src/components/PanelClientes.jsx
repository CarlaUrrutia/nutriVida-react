import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import ClienteService from '../services/ClienteService';
import ProfesionalService from '../services/ProfesionalService';

const formVacio = { nombre: '', apellido: '', email: '', id_profesional: '' };

function PanelClientes() {
  const [clientes, setClientes] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null);

  const cargarClientes = () => {
    ClienteService.getAllClientes().then((response) => {
      setClientes(response.data);
    }).catch(() => {
      alert('No se pudieron cargar los clientes. Revisa que el backend esté encendido y que tu sesión siga activa.');
    });
  };

  useEffect(() => {
    cargarClientes();
    ProfesionalService.getAllProfesionales().then((response) => {
      setProfesionales(response.data);
    }).catch(() => {
      setProfesionales([]);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.nombre.trim() === '' || form.apellido.trim() === '' || form.email.trim() === '') {
      alert('Completa nombre, apellido y correo');
      return;
    }

    const cliente = {
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      id_profesional: form.id_profesional === '' ? null : Number(form.id_profesional)
    };
    const peticion = editandoId
      ? ClienteService.updateCliente(editandoId, cliente)
      : ClienteService.createCliente(cliente);

    peticion.then(() => {
      setForm(formVacio);
      setEditandoId(null);
      cargarClientes();
    }).catch(() => {
      alert('No se pudo guardar el cliente. Revisa los datos y que tu sesión siga activa.');
    });
  };

  const handleEditar = (cliente) => {
    setEditandoId(cliente.id_cliente);
    setForm({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      id_profesional: cliente.id_profesional || ''
    });
  };

  const handleEliminar = (id) => {
    ClienteService.deleteCliente(id).then(() => {
      cargarClientes();
    }).catch(() => {
      alert('No se pudo eliminar el cliente.');
    });
  };

  const handleCancelar = () => {
    setForm(formVacio);
    setEditandoId(null);
  };

  const nombreProfesional = (id) => {
    const profesional = profesionales.find((p) => p.id_profesional === id);
    return profesional ? `${profesional.nombre} ${profesional.apellido}` : '-';
  };

  return (
    <div>
      <h3>{editandoId ? 'Editar cliente' : 'Agregar cliente'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0' }}>
        <Form.Group className="mb-3" controlId="clienteNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" className="caja" name="nombre" value={form.nombre} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="clienteApellido">
          <Form.Label>Apellido</Form.Label>
          <Form.Control type="text" className="caja" name="apellido" value={form.apellido} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="clienteEmail">
          <Form.Label>Correo</Form.Label>
          <Form.Control type="email" className="caja" name="email" value={form.email} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="clienteProfesional">
          <Form.Label>Profesional asignado</Form.Label>
          <Form.Select className="caja" name="id_profesional" value={form.id_profesional} onChange={handleChange}>
            <option value="">Sin profesional</option>
            {profesionales.map((p) => (
              <option key={p.id_profesional} value={p.id_profesional}>
                {p.nombre} {p.apellido} ({p.especialidad})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button type="submit" className="btn-principal">
          {editandoId ? 'Actualizar cliente' : 'Agregar cliente'}
        </Button>
        {editandoId && (
          <Button type="button" className="btn-secundario" style={{ marginLeft: '10px' }} onClick={handleCancelar}>
            Cancelar
          </Button>
        )}
      </Form>

      <h3 style={{ marginTop: '30px' }}>Clientes ({clientes.length})</h3>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Profesional</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id_cliente}>
              <td>{c.id_cliente}</td>
              <td>{c.nombre}</td>
              <td>{c.apellido}</td>
              <td>{c.email}</td>
              <td>{nombreProfesional(c.id_profesional)}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => handleEditar(c)}>Editar</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => handleEliminar(c.id_cliente)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PanelClientes;
