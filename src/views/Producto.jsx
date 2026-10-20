import { useState } from 'react';
import { Link } from 'react-router-dom';
import imgDetalle from '../assets/img/pliegues_cutaneos.jpg';

function Producto() {
  const [agendado, setAgendado] = useState(false);

  const handleAgendar = () => {
    if (!agendado) {
      alert('Agendamiento exitoso!');
      setAgendado(true);
    } else {
      alert('Ya tienes una hora agendada para este plan');
    }
  };

  return (
    <main id="contenido">
      <section className="detalle-producto">
        <div className="detalle-imagen">
          <img src={imgDetalle} alt="Detalle Pérdida de Peso" />
        </div>

        <div className="detalle-info">
          <h2>Plan de Pérdida de Peso</h2>
          <p className="detalle-descripcion">
            Evaluación nutricional completa, entrega de pauta alimentaria personalizada y medición de pliegues cutáneos.
          </p>

          <div className="detalle-meta">
            <span>⏱ Duración: 45 minutos</span>
          </div>

          <p className="precio">$25.000</p>

          <div className="detalle-acciones">
            <button
              className="btn-principal"
              onClick={handleAgendar}
              style={agendado ? { backgroundColor: 'green' } : {}}
            >
              {agendado ? '✔ Agendado' : 'Agendar Hora'}
            </button>

            <Link to="/productos" className="btn-secundario">← Volver al catálogo</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Producto;
