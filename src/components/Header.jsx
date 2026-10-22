import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import logoNutriVida from '../assets/img/logo-nutrivida.png';

function Header({ titulo, subtitulo, itemsMenu }) {
  const { carrito } = useCarrito();
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  const handleCerrarSesion = (event) => {
    event.preventDefault();
    cerrarSesion();
    navigate('/login');
  };

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
          <Link to="/carrito" className="btn-hamburguesa" style={{ marginRight: '10px' }}>
            🛒{totalItems > 0 ? ` ${totalItems}` : ''}
          </Link>

          <div className="dropdown">
            <a href="#" className="btn-hamburguesa">&#9776;</a>
            <div className="dropdown-content menu-alineado">
              {itemsMenu && itemsMenu.map((item) => (
                <Link key={item.href} to={item.href}>
                  {item.label}
                </Link>
              ))}

              {!usuario && (
                <>
                  <Link to="/login">Iniciar Sesión</Link>
                  <Link to="/registro">Registrarse</Link>
                </>
              )}

              {usuario && (
                <>
                  <Link to="/perfil">Mi Perfil</Link>
                  {usuario.esAdmin && <Link to="/admin">Panel de Admin</Link>}
                  <a href="#" onClick={handleCerrarSesion}>Cerrar sesión</a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
