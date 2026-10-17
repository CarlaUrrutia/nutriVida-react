import Seccion from '../components/Seccion';

import imgPliegues from '../assets/img/pliegues-cutaneos.jpeg';
import imgClinica from '../assets/img/clinica.png';
import videoClinica from '../assets/video/video.mp4';

function Home() {
  return (
    <main id="contenido">
      <Seccion id="hero" titulo="Tu bienestar comienza con una buena alimentación">
        <p className="subtitulo">
          Planes nutricionales personalizados y acompañamiento profesional para transformar tus hábitos de salud.
        </p>
        <div className="hero-acciones">
          <a href="/productos" className="btn-principal">Ver Catálogo de Planes</a>
          <a href="/productos" className="btn-secundario">Reservar Hora</a>
        </div>
      </Seccion>

      <Seccion id="caracteristicas" titulo="¿Por qué elegirnos?">
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

      <Seccion id="perdida-peso" titulo="¿Quieres perder peso de forma saludable?">
        <div className="seccion-perdida-peso">
          <div className="perdida-texto">
            <p>
              En NutriVida usamos métodos precisos como la medición de pliegues cutáneos para evaluar tu composición corporal y diseñar un plan totalmente personalizado para ti.
            </p>
            <a href="/productos" className="btn-principal">Ver Planes</a>
          </div>
          <div className="perdida-imagen">
            <img src={imgPliegues} alt="Medición de pliegues cutáneos" />
          </div>
        </div>
      </Seccion>

      <Seccion id="servicios" titulo="Conoce Nuestra Clínica">
        <p className="bajada-servicios">
          Un espacio diseñado para brindarte una atención cómoda, moderna y familiar.
        </p>
        <div className="contenedor-img">
          <img src={imgClinica} alt="Fachada de la clínica NutriVida" className="imagen-clinica" />
        </div>
      </Seccion>

      <Seccion id="video" titulo="Conoce más sobre nosotros">
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