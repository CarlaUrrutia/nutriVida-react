import { createContext, useContext, useState } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('nutrivida_sesion');
    const sesion = guardado ? JSON.parse(guardado) : null;
    if (sesion && sesion.esAdmin && !sesion.token) {
      return null;
    }
    return sesion;
  });

  const registrarUsuario = async (datos) => {
    try {
      await AuthService.registro({
        username: datos.email,
        email: datos.email,
        password: datos.password
      });

      const loginDatos = await AuthService.login(datos.email, datos.password);
      const sesion = {
        username: loginDatos.username,
        email: loginDatos.username,
        nombre: datos.nombre,
        apellido: datos.apellido,
        rut: datos.rut,
        fechaNacimiento: datos.fechaNacimiento,
        objetivo: datos.objetivo,
        rol: loginDatos.rol,
        esAdmin: loginDatos.rol === 'ADMIN',
        token: loginDatos.token
      };
      localStorage.setItem('nutrivida_sesion', JSON.stringify(sesion));
      setUsuario(sesion);
      return { exito: true };
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return { exito: false, mensaje: 'Ese correo ya está registrado, inicia sesión.' };
      }
      return { exito: false, mensaje: error.response ? 'Error al registrar usuario.' : 'No se pudo conectar con el servidor.' };
    }
  };

  const iniciarSesion = (username, password) => {
    return AuthService.login(username, password).then((datos) => {
      const sesion = {
        username: datos.username,
        email: datos.username,
        rol: datos.rol,
        esAdmin: datos.rol === 'ADMIN',
        token: datos.token
      };
      localStorage.setItem('nutrivida_sesion', JSON.stringify(sesion));
      setUsuario(sesion);
      return { exito: true, esAdmin: sesion.esAdmin };
    }).catch((error) => {
      if (!error.response) {
        return { exito: false, mensaje: 'No se pudo conectar con el servidor. ¿Está encendido el backend?' };
      }
      return { exito: false, mensaje: 'Usuario o contraseña incorrectos' };
    });
  };

  const cerrarSesion = () => {
    localStorage.removeItem('nutrivida_sesion');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, registrarUsuario, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
