import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [fenac, setFenac] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const { registrarUsuario } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (nombre.trim() === '') {
      alert('El nombre esta vacio!');
      return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
      alert('El nombre solo debe contener letras');
      return;
    }

    if (apellido.trim() === '') {
      alert('El apellido está vacio!');
      return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(apellido)) {
      alert('El apellido solo debe contener letras');
      return;
    }

    const vRut = /^(0?[1-9][0-9]{6}|[1-9][0-9]{7})-[0-9kK]$/;
    if (!vRut.test(rut)) {
      alert('El RUT debe tener el formato 12345678-9 (sin puntos y con guion)');
      return;
    }

    const vCorreo = /^[^\s@]+@(gmail\.com|outlook\.com|duocuc\.cl)$/;
    if (!vCorreo.test(email)) {
      alert('Ingrese un correo valido (@gmail.com, @outlook.com o @duocuc.cl)');
      return;
    }

    if (pass.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (pass !== pass2) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!fenac) {
      alert('Ingrese su fecha de nacimiento.');
      return;
    }

    const fechaNacimiento = new Date(fenac);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    if (edad < 18) {
      alert('Debes ser mayor de 18 años para registrarte');
      return;
    }

    if (objetivo === '') {
      alert('Por favor, seleccione su objetivo nutricional');
      return;
    }

    const resultado = registrarUsuario({
      nombre,
      apellido,
      rut,
      email,
      password: pass,
      fechaNacimiento: fenac,
      objetivo
    });

    if (!resultado.exito) {
      alert(resultado.mensaje);
      return;
    }

    alert('Registro exitoso!');
    navigate('/perfil');
  };

  return (
    <main id="contenido">
      <div className="formulario-contenedor">
        <Form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Registro de Paciente</legend>

            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre: </Form.Label>
              <Form.Control
                type="text"
                className="caja"
                placeholder="Ingrese su nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="apellido">
              <Form.Label>Apellido: </Form.Label>
              <Form.Control
                type="text"
                className="caja"
                placeholder="Ingrese su apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="rut">
              <Form.Label>
                RUT: <span className="ayuda">(Sin puntos y con guion. Ej: 12345678-9)</span>
              </Form.Label>
              <Form.Control
                type="text"
                className="caja"
                placeholder="Ingrese su RUT"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>
                Correo electrónico: <span className="ayuda">(Solo @gmail.com, @outlook.com o @duocuc.cl)</span>
              </Form.Label>
              <Form.Control
                type="email"
                className="caja"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="pass">
              <Form.Label>
                Contraseña: <span className="ayuda">(Mínimo 6 caracteres)</span>
              </Form.Label>
              <Form.Control
                type="password"
                className="caja"
                placeholder="Cree una contraseña"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="pass2">
              <Form.Label>Confirmar Contraseña: </Form.Label>
              <Form.Control
                type="password"
                className="caja"
                placeholder="Repita su contraseña"
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="fenac">
              <Form.Label>Fecha de nacimiento: </Form.Label>
              <Form.Control
                type="date"
                className="caja"
                value={fenac}
                onChange={(e) => setFenac(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="objetivo">
              <Form.Label>Objetivo Nutricional: </Form.Label>
              <Form.Select
                className="caja"
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
              >
                <option value="">-- Seleccione su objetivo --</option>
                <option value="peso">Pérdida de peso</option>
                <option value="metabolico">Control metabólico</option>
                <option value="deportivo">Nutrición deportiva</option>
                <option value="vegano">Alimentación vegetariana / vegana</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" className="btn-principal" style={{ marginTop: '10px' }}>
              Registrarse
            </Button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
              <p><Link to="/">Volver al inicio</Link></p>
            </div>
          </fieldset>
        </Form>
      </div>
    </main>
  );
}

export default Registro;
