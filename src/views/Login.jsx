import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

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

    const resultado = iniciarSesion(email, pass);

    if (!resultado.exito) {
      alert(resultado.mensaje);
      setPass('');
      return;
    }

    alert('Inicio de sesión exitoso!');
    navigate(resultado.esAdmin ? '/admin' : '/perfil');
  };

  return (
    <main id="contenido">
      <div className="formulario-contenedor">
        <Form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Iniciar Sesión</legend>

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
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="pass">
              <Form.Label>Contraseña: </Form.Label>
              <Form.Control
                type="password"
                className="caja"
                placeholder="Ingrese su contraseña"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" className="btn-principal" style={{ marginTop: '10px' }}>
              Ingresar
            </Button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <p>¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></p>
              <p><Link to="/">Volver al inicio</Link></p>
            </div>
          </fieldset>
        </Form>
      </div>
    </main>
  );
}

export default Login;
