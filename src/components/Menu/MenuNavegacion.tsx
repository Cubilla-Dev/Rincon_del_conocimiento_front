import { Link } from 'preact-router';
import style from './menu.desplegable.module.css';
import { useState } from 'preact/hooks';
import Sesion from '../login/Sesion';

const MenuNavegacion = () => {
  const [sesion, setSesion] = useState<'login' | 'registro' | null>(null);

  const toggleSesion = (tipo: 'login' | 'registro') => {
    setSesion(prev => (prev === tipo ? null : tipo));
  };

  return (
    <nav className={style.containerNavegacion}>
      <Link href="/">Inicio</Link>

      <button onClick={() => toggleSesion('login')} className={style.button}>
        Sesión
      </button>

      <button onClick={() => toggleSesion('registro')} className={style.button}>
        Registro
      </button>

      {sesion === 'login' && <Sesion tipo="login" />}
      {sesion === 'registro' && <Sesion tipo="registro" />}
    </nav>
  );
};

export default MenuNavegacion;
