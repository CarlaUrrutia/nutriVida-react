import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavoritos } from '../context/FavoritosContext';
import { useProductos } from '../context/ProductosContext';
import OrdenService from '../services/OrdenService';

const objetivosLabels = {
  peso: 'Pérdida de peso',
  metabolico: 'Control metabólico',
  deportivo: 'Nutrición deportiva',
  vegano: 'Alimentación vegetariana / vegana'
};

function MiPerfil() {
  const { usuario, cerrarSesion } = useAuth();
  const { favoritos } = useFavoritos();
  const { productos } = useProductos();
  const navigate = useNavigate();
  const [ordenes, setOrdenes] = useState([]);
  const productosFavoritos = productos.filter((p) => favoritos.includes(p.id));

  useEffect(() => {
    if (usuario && !usuario.esAdmin) {
      OrdenService.misOrdenes().then(setOrdenes).catch(() => setOrdenes([]));
    }
  }, [usuario]);

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login');
  };

  if (usuario?.esAdmin) {
    return (
      <main id="contenido">
        <section className="seccion">
          <h2>Mi Perfil</h2>
          <p>Sesión de administrador iniciada como <strong>{usuario.email}</strong>.</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/admin" className="btn-principal" style={{ width: 'auto' }}>Ir al Panel de Admin</Link>
            <button className="btn-secundario" style={{ width: 'auto' }} onClick={handleCerrarSesion}>Cerrar sesión</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="contenido">
      <section className="seccion" style={{ textAlign: 'left' }}>
        <h2 style={{ textAlign: 'center' }}>Mi Perfil</h2>
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ flex: 1, minWidth: '250px', maxWidth: '450px' }}>
            {usuario?.username && <p><strong>Usuario:</strong> {usuario.username}</p>}
            {usuario?.rol && <p><strong>Rol:</strong> {usuario.rol}</p>}
            <p><strong>Nombre:</strong> {usuario?.nombre} {usuario?.apellido}</p>
            <p><strong>RUT:</strong> {usuario?.rut}</p>
            <p><strong>Correo:</strong> {usuario?.email}</p>
            <p><strong>Fecha de nacimiento:</strong> {usuario?.fechaNacimiento}</p>
            <p><strong>Objetivo nutricional:</strong> {objetivosLabels[usuario?.objetivo] || usuario?.objetivo}</p>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button className="btn-secundario" style={{ width: 'auto' }} onClick={handleCerrarSesion}>Cerrar sesión</button>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '250px', maxWidth: '350px' }}>
            <h3>♥ Favoritos</h3>
            {productosFavoritos.length === 0 && <p>Aún no tienes productos favoritos.</p>}
            <ul>
              {productosFavoritos.map((p) => (
                <li key={p.id}>
                  <Link to={`/producto/${p.id}`}>{p.nombre}</Link> — ${p.precio.toLocaleString('es-CL')}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3>📋 Mis Órdenes</h3>
          {ordenes.length === 0 && <p>Aún no tienes órdenes registradas.</p>}
          <ul>
            {ordenes.map((orden) => (
              <li key={orden.id}>
                <strong>Orden #{orden.id}</strong> — {new Date(orden.fecha).toLocaleDateString('es-CL')} — ${orden.total.toLocaleString('es-CL')}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default MiPerfil;
