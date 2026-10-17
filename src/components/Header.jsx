import { Link } from 'react-router-dom';
import logoNutriVida from '../assets/img/logo-nutrivida.png';

function Header({ titulo, subtitulo, itemsMenu }) {
  return (
    <header id="encabezado">
      {titulo && <h1>{titulo}</h1>}
     

      <nav className="navbar-clinica">
        <div className="nav-logo">
          <Link to="/">
            <img src={logoNutriVida} alt="Logo NutriVida" height="50" />
          </Link>
        </div>

        <div className="nav-centro">
          <Link to="/productos" className="btn-principal">
            Reservar hora
          </Link>
        </div>

        <div className="nav-derecha">
          <div className="dropdown">
            <a href="#" className="btn-hamburguesa">&#9776;</a>
            <div className="dropdown-content menu-alineado">
              {itemsMenu && itemsMenu.map((item) => (
                <Link key={item.href} to={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;