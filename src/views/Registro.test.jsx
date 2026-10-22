import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Registro from './Registro';

// Registro usa useNavigate y useAuth, así que necesita router y el auth
function dibujarRegistro() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Registro />
      </AuthProvider>
    </BrowserRouter>
  );
}

// reemplazo el alert para poder revisar qué mensaje mostró
let ultimoMensaje = '';
window.alert = function (mensaje) {
  ultimoMensaje = mensaje;
};

describe('Registro', () => {

  beforeEach(() => {
    ultimoMensaje = '';
    localStorage.clear();
  });

  it('Debe permitir escribir el nombre', () => {
    dibujarRegistro();
    const inputNombre = screen.getByLabelText(/^Nombre:/i);
    fireEvent.change(inputNombre, { target: { value: 'Juan' } });
    expect(inputNombre.value).toBe('Juan');
  });

  it('Debe permitir escribir el apellido', () => {
    dibujarRegistro();
    const inputApellido = screen.getByLabelText(/^Apellido:/i);
    fireEvent.change(inputApellido, { target: { value: 'Pérez' } });
    expect(inputApellido.value).toBe('Pérez');
  });

  it('Debe permitir escribir el RUT', () => {
    dibujarRegistro();
    const inputRut = screen.getByLabelText(/RUT:/i);
    fireEvent.change(inputRut, { target: { value: '12345678-9' } });
    expect(inputRut.value).toBe('12345678-9');
  });

  it('Debe permitir escribir el correo electrónico', () => {
    dibujarRegistro();
    const inputCorreo = screen.getByLabelText(/Correo electrónico:/i);
    fireEvent.change(inputCorreo, { target: { value: 'juan@gmail.com' } });
    expect(inputCorreo.value).toBe('juan@gmail.com');
  });

  it('Debe permitir escribir la contraseña', () => {
    dibujarRegistro();
    const inputPass = screen.getByLabelText(/^Contraseña:/i);
    fireEvent.change(inputPass, { target: { value: 'miClave123' } });
    expect(inputPass.value).toBe('miClave123');
  });

  it('Debe permitir escribir la confirmación de la contraseña', () => {
    dibujarRegistro();
    const inputPass2 = screen.getByLabelText(/Confirmar Contraseña:/i);
    fireEvent.change(inputPass2, { target: { value: 'miClave123' } });
    expect(inputPass2.value).toBe('miClave123');
  });

  it('Debe permitir ingresar la fecha de nacimiento', () => {
    dibujarRegistro();
    const inputFecha = screen.getByLabelText(/Fecha de nacimiento:/i);
    fireEvent.change(inputFecha, { target: { value: '2000-05-20' } });
    expect(inputFecha.value).toBe('2000-05-20');
  });

  it('Debe permitir seleccionar un objetivo nutricional', () => {
    dibujarRegistro();
    const selectObjetivo = screen.getByLabelText(/Objetivo Nutricional:/i);
    fireEvent.change(selectObjetivo, { target: { value: 'deportivo' } });
    expect(selectObjetivo.value).toBe('deportivo');
  });

  it('Debe mostrar un error si el nombre queda vacío', () => {
    dibujarRegistro();

    fireEvent.change(screen.getByLabelText(/^Nombre:/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/^Apellido:/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/RUT:/i), { target: { value: '12345678-9' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico:/i), { target: { value: 'juan@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña:/i), { target: { value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña:/i), { target: { value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento:/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Objetivo Nutricional:/i), { target: { value: 'peso' } });
    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

    expect(ultimoMensaje).toBe('El nombre esta vacio!');
  });

  it('Debe mostrar un error si las contraseñas no coinciden', () => {
    dibujarRegistro();

    fireEvent.change(screen.getByLabelText(/^Nombre:/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/^Apellido:/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/RUT:/i), { target: { value: '12345678-9' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico:/i), { target: { value: 'juan@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña:/i), { target: { value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña:/i), { target: { value: 'ghijkl' } });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento:/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Objetivo Nutricional:/i), { target: { value: 'peso' } });
    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

    expect(ultimoMensaje).toBe('Las contraseñas no coinciden');
  });

  it('Debe registrar correctamente cuando todos los datos son válidos', () => {
    dibujarRegistro();

    fireEvent.change(screen.getByLabelText(/^Nombre:/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/^Apellido:/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/RUT:/i), { target: { value: '12345678-9' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico:/i), { target: { value: 'juan@gmail.com' } });
    fireEvent.change(screen.getByLabelText(/^Contraseña:/i), { target: { value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Contraseña:/i), { target: { value: 'abcdef' } });
    fireEvent.change(screen.getByLabelText(/Fecha de nacimiento:/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Objetivo Nutricional:/i), { target: { value: 'peso' } });
    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));

    expect(ultimoMensaje).toBe('Registro exitoso!');
  });

});
