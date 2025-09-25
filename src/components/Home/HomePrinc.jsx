import MenuNavegacion from '../Menu/MenuNavegacion';
import GuidesList from '../../pages/GuidesAllList/GuidesList';
import styleHome from './Home.module.css';
import { Link } from 'preact-router';

const HomePrinc = () => {
  const handleLogout = () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login'; // Usa location.href para forzar recarga
  };

  return (
    <div className={styleHome.containerPrincipal}>
      <header className={styleHome.header}>
        <nav className={styleHome.nav}>
          <a href="/" className={styleHome.navLink}>
            Inicio
          </a>
          <button onClick={handleLogout} className={styleHome.logoutButton}>
            Cerrar Sesión
          </button>
        </nav>
      </header>
      <GuidesList />
      <Link href={`/form`} className={styleHome.addForm}>
        {/* <div className={GuideList.containerTag}> */}
        <h2>+</h2>
        {/* </div> */}
      </Link>
    </div>
  );
};

export default HomePrinc;
