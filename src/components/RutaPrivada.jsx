import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RutaPrivada({ children, soloAdmin = false }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (soloAdmin && !usuario.esAdmin) {
    return <Navigate to="/perfil" replace />;
  }

  return children;
}

export default RutaPrivada;
