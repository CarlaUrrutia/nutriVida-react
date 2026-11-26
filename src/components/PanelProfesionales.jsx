import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import ProfesionalService from '../services/ProfesionalService';

const formVacio = { nombre: '', apellido: '', especialidad: '', email: '' };

function PanelProfesionales() {
  const [profesionales, setProfesionales] = useState([]);
  const [form, setForm] = useState(formVacio);
  const [editandoId, setEditandoId] = useState(null);

  const cargarProfesionales = () => {
    ProfesionalService.getAllProfesionales().then((response) => {
      setProfesionales(response.data);
    }).catch(() => {
      alert('No se pudieron cargar los profesionales. Revisa que el backend esté encendido y que tu sesión siga activa.');
    });
  };

  useEffect(() => {
    cargarProfesionales();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.nombre.trim() === '' || form.apellido.trim() === '' || form.especialidad.trim() === '' || form.email.trim() === '') {
      alert('Completa todos los campos');
      return;
    }

    const peticion = editandoId
      ? ProfesionalService.updateProfesional(editandoId, form)
      : ProfesionalService.createProfesional(form);

    peticion.then(() => {
      setForm(formVacio);
      setEditandoId(null);
      cargarProfesionales();
    }).catch(() => {
      alert('No se pudo guardar el profesional. Revisa los datos y que tu sesión siga activa.');
    });
  };

  const handleEditar = (profesional) => {
    setEditandoId(profesional.id_profesional);
    setForm({
      nombre: profesional.nombre,
      apellido: profesional.apellido,
      especialidad: profesional.especialidad,
      email: profesional.email
    });
  };

  const handleEliminar = (id) => {
    ProfesionalService.deleteProfesional(id).then(() => {
      cargarProfesionales();
    }).catch(() => {
      alert('No se pudo eliminar el profesional. Si tiene clientes asignados, primero cambia o elimina esos clientes.');
    });
  };

  const handleCancelar = () => {
    setForm(formVacio);
    setEditandoId(null);
  };

  return (
    <div>
      <h3>{editandoId ? 'Editar profesional' : 'Agregar profesional'}</h3>
      <Form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '20px 0' }}>
        <Form.Group className="mb-3" controlId="profesionalNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" className="caja" name="nombre" value={form.nombre} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="profesionalApellido">
          <Form.Label>Apellido</Form.Label>
          <Form.Control type="text" className="caja" name="apellido" value={form.apellido} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="profesionalEspecialidad">
          <Form.Label>Especialidad</Form.Label>
          <Form.Control type="text" className="caja" name="especialidad" value={form.especialidad} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="profesionalEmail">
          <Form.Label>Correo</Form.Label>
          <Form.Control type="email" className="caja" name="email" value={form.email} onChange={handleChange} />
        </Form.Group>

        <Button type="submit" className="btn-principal">
          {editandoId ? 'Actualizar profesional' : 'Agregar profesional'}
        </Button>
        {editandoId && (
          <Button type="button" className="btn-secundario" style={{ marginLeft: '10px' }} onClick={handleCancelar}>
            Cancelar
          </Button>
        )}
      </Form>

      <h3 style={{ marginTop: '30px' }}>Profesionales ({profesionales.length})</h3>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Especialidad</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesionales.map((p) => (
            <tr key={p.id_profesional}>
              <td>{p.id_profesional}</td>
              <td>{p.nombre}</td>
              <td>{p.apellido}</td>
              <td>{p.especialidad}</td>
              <td>{p.email}</td>
              <td>
                <Button size="sm" variant="outline-primary" onClick={() => handleEditar(p)}>Editar</Button>{' '}
                <Button size="sm" variant="outline-danger" onClick={() => handleEliminar(p.id_profesional)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PanelProfesionales;
