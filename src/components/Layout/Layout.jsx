import MenuNavegacion from '../Menu/MenuNavegacion';
import styleHome from './Layout.module.css';
import { Link } from 'preact-router';

const Layout = ({ children }) => {
  const handleLogout = () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  return (
    <div className={styleHome.containerPrincipal}>
      <header className={styleHome.header}>
        <nav className={styleHome.nav}>
          <a href="/" className={styleHome.title}>
            Inicio
          </a>
          <button onClick={handleLogout} className={styleHome.logoutButton}>
            Cerrar Sesión
          </button>
        </nav>
      </header>

      {/* Contenido principal */}
      <main className={styleHome.mainContent}>{children}</main>

      {/* Botón flotante */}
      <Link href={`/form`} className={styleHome.addForm}>
        <h2>+</h2>
      </Link>
    </div>
  );
};

export default Layout;
