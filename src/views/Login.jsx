import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email.trim() === '') {
      alert('El correo electrónico no puede estar vacío');
      return;
    }

    if (pass.trim() === '') {
      alert('La contraseña no puede estar vacía');
      return;
    }

    if (email !== 'admin@duocuc.cl' || pass !== 'Admin123') {
      alert('Credenciales incorrectas');
      setPass('');
      return;
    }

    alert('Inicio de sesión exitoso!');
    setEmail('');
    setPass('');
  };

  return (
    <main id="contenido">
      <div className="formulario-contenedor">
        <form name="login" id="contacto" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Iniciar Sesión</legend>

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

            <label htmlFor="pass">Contraseña: </label>
            <input
              type="password"
              id="pass"
              className="caja"
              placeholder="Ingrese su contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />

            <button type="submit" className="btn-principal" style={{ marginTop: '20px' }}>
              Ingresar
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p>¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></p>
              <p><Link to="/">Volver al inicio</Link></p>
            </div>
          </fieldset>
        </form>
      </div>
    </main>
  );
}

export default Login;
