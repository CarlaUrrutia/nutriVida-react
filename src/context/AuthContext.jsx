import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const ADMIN_EMAIL = 'admin@duocuc.cl';
const ADMIN_PASS = 'Admin123';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('nutrivida_sesion');
    return guardado ? JSON.parse(guardado) : null;
  });

  const obtenerUsuarios = () => {
    const guardado = localStorage.getItem('nutrivida_usuarios');
    return guardado ? JSON.parse(guardado) : [];
  };

  const registrarUsuario = (datos) => {
    if (datos.email === ADMIN_EMAIL) {
      return { exito: false, mensaje: 'Ese correo está reservado, usa otro.' };
    }

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

  const iniciarSesion = (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      const sesion = { email, esAdmin: true };
      localStorage.setItem('nutrivida_sesion', JSON.stringify(sesion));
      setUsuario(sesion);
      return { exito: true, esAdmin: true };
    }

    const usuarios = obtenerUsuarios();
    const encontrado = usuarios.find((u) => u.email === email && u.password === password);
    if (encontrado) {
      const { password: _password, ...datosSinPassword } = encontrado;
      const sesion = { ...datosSinPassword, esAdmin: false };
      localStorage.setItem('nutrivida_sesion', JSON.stringify(sesion));
      setUsuario(sesion);
      return { exito: true, esAdmin: false };
    }

    return { exito: false, mensaje: 'Credenciales incorrectas' };
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
