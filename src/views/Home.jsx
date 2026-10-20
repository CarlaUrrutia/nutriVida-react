import Seccion from '../components/Seccion';
import { Link } from 'react-router-dom';

import imgPliegues from '../assets/img/pliegues-cutaneos.jpeg';
import imgClinica from '../assets/img/clinica.png';
import videoClinica from '../assets/video/video.mp4';

function Home() {
  return (
    <main id="contenido">
      <Seccion id="hero" titulo="Tu bienestar comienza con una buena alimentación" className="hero-seccion">
        <p className="subtitulo">
          Planes nutricionales personalizados y acompañamiento profesional para transformar tus hábitos de salud.
        </p>
        <div className="hero-acciones">
          <Link to="/productos" className="btn-principal">Ver Catálogo de Planes</Link>
          <Link to="/productos" className="btn-secundario">Reservar Hora</Link>
        </div>
      </Seccion>

      <Seccion id="caracteristicas" className="seccion">
        <div className="caracteristicas-grid">
          <div className="card-feature">
            <h3>Planes a Medida</h3>
            <p>Pautas 100% personalizadas según tu estilo de vida y objetivos.</p>
          </div>
          <div className="card-feature">
            <h3>Especialistas</h3>
            <p>Atención cercana de nutricionistas certificadas en cada consulta.</p>
          </div>
          <div className="card-feature">
            <h3>Seguimiento</h3>
            <p>Acompañamiento continuo para lograr resultados sostenibles.</p>
          </div>
        </div>
      </Seccion>

      <Seccion id="perdida-peso" className="seccion">
        <div className="seccion-perdida-peso">
          <div className="perdida-texto">
            <h2>¿Quieres perder peso de forma saludable?</h2>
            <p>
              En NutriVida usamos métodos precisos como la medición de pliegues cutáneos para evaluar tu composición corporal y diseñar un plan totalmente personalizado para ti.
            </p>
            <Link to="/productos" className="btn-principal">Ver Planes</Link>
          </div>
          <div className="perdida-imagen">
            <img src={imgPliegues} alt="Medición de pliegues cutáneos" />
          </div>
        </div>
      </Seccion>

      <Seccion id="servicios" titulo="Conoce Nuestra Clínica" className="seccion-servicios">
        <p className="bajada-servicios">
          Un espacio diseñado para brindarte una atención cómoda, moderna y familiar.
        </p>
        <div className="contenedor-img">
          <img src={imgClinica} alt="Fachada de la clínica NutriVida" className="imagen-clinica" />
        </div>
      </Seccion>

      <Seccion id="video" titulo="Conoce más sobre nosotros" className="seccion-video">
        <p>Descubre nuestras instalaciones y la filosofía de trabajo que nos mueve.</p>

        <div className="contenedor-video">
          <video controls autoPlay loop muted>
            <source src={videoClinica} type="video/mp4" />
          </video>
        </div>
      </Seccion>
    </main>
  );
}

export default Home;
