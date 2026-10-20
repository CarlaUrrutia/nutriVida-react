import { useState } from 'react';
import { Link } from 'react-router-dom';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [fenac, setFenac] = useState('');
  const [objetivo, setObjetivo] = useState('');

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

    alert('Registro exitoso!');
    setNombre('');
    setApellido('');
    setRut('');
    setEmail('');
    setPass('');
    setPass2('');
    setFenac('');
    setObjetivo('');
  };

  return (
    <main id="contenido">
      <div className="formulario-contenedor">
        <form name="registro" id="contacto" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Registro de Paciente</legend>

            <label htmlFor="nombre">Nombre: </label>
            <input
              type="text"
              id="nombre"
              className="caja"
              placeholder="Ingrese su nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />

            <label htmlFor="apellido">Apellido: </label>
            <input
              type="text"
              id="apellido"
              className="caja"
              placeholder="Ingrese su apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />

            <label htmlFor="rut">
              RUT: <span className="ayuda">(Sin puntos y con guion. Ej: 12345678-9)</span>
            </label>
            <input
              type="text"
              id="rut"
              className="caja"
              placeholder="Ingrese su RUT"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              required
            />

            <label htmlFor="email">
              Correo electrónico: <span className="ayuda">(Solo @gmail.com, @outlook.com o @duocuc.cl)</span>
            </label>
            <input
              type="email"
              id="email"
              className="caja"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="pass">
              Contraseña: <span className="ayuda">(Mínimo 6 caracteres)</span>
            </label>
            <input
              type="password"
              id="pass"
              className="caja"
              placeholder="Cree una contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />

            <label htmlFor="pass2">Confirmar Contraseña: </label>
            <input
              type="password"
              id="pass2"
              className="caja"
              placeholder="Repita su contraseña"
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
              required
            />

            <label htmlFor="fenac">Fecha de nacimiento: </label>
            <input
              type="date"
              id="fenac"
              className="caja"
              value={fenac}
              onChange={(e) => setFenac(e.target.value)}
              required
            />

            <label htmlFor="objetivo">Objetivo Nutricional: </label>
            <select
              id="objetivo"
              className="caja"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              required
            >
              <option value="">-- Seleccione su objetivo --</option>
              <option value="peso">Pérdida de peso</option>
              <option value="metabolico">Control metabólico</option>
              <option value="deportivo">Nutrición deportiva</option>
              <option value="vegano">Alimentación vegetariana / vegana</option>
            </select>

            <button type="submit" className="btn-principal" style={{ marginTop: '20px' }}>
              Registrarse
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
              <p><Link to="/">Volver al inicio</Link></p>
            </div>
          </fieldset>
        </form>
      </div>
    </main>
  );
}

export default Registro;
