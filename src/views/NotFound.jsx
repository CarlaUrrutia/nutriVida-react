import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main id="contenido">
      <section className="seccion" style={{ textAlign: 'center' }}>
        <h2>Error 404</h2>
        <p>La página que buscas no existe o fue movida.</p>
        <Link to="/" className="btn-principal" style={{ width: 'auto', display: 'inline-block' }}>
          Volver al Inicio
        </Link>
      </section>
    </main>
  );
}

export default NotFound;
