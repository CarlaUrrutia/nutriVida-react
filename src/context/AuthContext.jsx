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

  const obtenerUsuarios = () => {
    const guardado = localStorage.getItem('nutrivida_usuarios');
    return guardado ? JSON.parse(guardado) : [];
  };

  const registrarUsuario = (datos) => {
    const usuarios = obtenerUsuarios();
    const yaExiste = usuarios.some((u) => u.email === datos.email);
    if (yaExiste) {
      return { exito: false, mensaje: 'Ese correo ya está registrado, inicia sesión.' };
    }

    const usuariosActualizados = [...usuarios, datos];
    localStorage.setItem('nutrivida_usuarios', JSON.stringify(usuariosActualizados));

    const { password: _password, ...datosSinPassword } = datos;
    const sesion = { ...datosSinPassword, esAdmin: false };
    localStorage.setItem('nutrivida_sesion', JSON.stringify(sesion));
    setUsuario(sesion);
    return { exito: true };
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
      const usuarios = obtenerUsuarios();
      const encontrado = usuarios.find((u) => u.email === username && u.password === password);
      if (encontrado) {
        const { password: _password, ...datosSinPassword } = encontrado;
        const sesion = { ...datosSinPassword, esAdmin: false };
        localStorage.setItem('nutrivida_sesion', JSON.stringify(sesion));
        setUsuario(sesion);
        return { exito: true, esAdmin: false };
      }
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
