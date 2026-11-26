import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PanelServicios from '../components/PanelServicios';
import PanelClientes from '../components/PanelClientes';
import PanelProfesionales from '../components/PanelProfesionales';

function Panel() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState('servicios');

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login');
  };

  return (
    <main id="contenido">
      <section className="seccion" style={{ textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h2 style={{ margin: 0 }}>Panel de Control</h2>
          <button className="btn-secundario" style={{ width: 'auto' }} onClick={handleCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
        <p>Sesión iniciada como {usuario?.username} (rol {usuario?.rol})</p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '15px 0' }}>
          <button
            className={seccion === 'servicios' ? 'btn-principal' : 'btn-secundario'}
            style={{ width: 'auto' }}
            onClick={() => setSeccion('servicios')}
          >
            Planes
          </button>
          <button
            className={seccion === 'clientes' ? 'btn-principal' : 'btn-secundario'}
            style={{ width: 'auto' }}
            onClick={() => setSeccion('clientes')}
          >
            Clientes
          </button>
          <button
            className={seccion === 'profesionales' ? 'btn-principal' : 'btn-secundario'}
            style={{ width: 'auto' }}
            onClick={() => setSeccion('profesionales')}
          >
            Profesionales
          </button>
        </div>

        {seccion === 'servicios' && <PanelServicios />}
        {seccion === 'clientes' && <PanelClientes />}
        {seccion === 'profesionales' && <PanelProfesionales />}
      </section>
    </main>
  );
}

export default Panel;
