import { useState, useEffect } from 'preact/hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, route } from 'preact-router';
import config from '../src/config/config.env';
import GuidesList from '../src/pages/GuidesAllList/GuidesList';
import Form from './components/Form/Form';
import Sesion from './components/login/Sesion';
import GuideDetail from '../src/pages/GuidesOne/GuideDetail';
import styleApp from './styles/app.module.css';
import Layout from '../src/components/Layout/Layout';

// Función utilitaria para obtener cookies
const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Componente para rutas protegidas
// const ProtectedRoute = ({ component: Component, ...props }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);

//   useEffect(() => {
//     const token = getCookie('authToken');
//     console.log('Token en ProtectedRoute:', token);

//     if (!token) {
//       console.log('Redirigiendo a login desde ProtectedRoute');
//       route('/login', true);
//     } else {
//       setIsAuthenticated(true);
//     }
//   }, []);

//   if (isAuthenticated === null) {
//     return <div className={styleApp.loading}>Verificando...</div>;
//   }

//   return isAuthenticated ? <Component {...props} /> : null;
// };

// Componente para redirección pública (si ya está autenticado)
const PublicRoute = ({ component: Component, ...props }) => {
  const [shouldRender, setShouldRender] = useState(null);

  useEffect(() => {
    const token = getCookie('authToken');
    if (token) {
      console.log('Ya autenticado, redirigiendo a home');
      route('/', true);
    } else {
      setShouldRender(true);
    }
  }, []);

  if (shouldRender === null) {
    return <div className={styleApp.loading}>Cargando...</div>;
  }

  return shouldRender ? <Component {...props} /> : null;
};

const ProtectedRoute = ({ component: Component, ...props }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = getCookie('authToken');
    if (!token) {
      route('/login', true);
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated === null) {
    return <div className={styleApp.loading}>Verificando...</div>;
  }

  return isAuthenticated ? (
    <Layout>
      <Component {...props} />
    </Layout>
  ) : null;
};

export default function App() {
  const queryClient = new QueryClient();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = getCookie('authToken');
    console.log('Token al cargar App:', token);

    if (token) {
      setUser({ token });
    }
    setAuthChecked(true);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    route('/', true); // Redirigir a home después de login
  };

  const handleLogout = () => {
    setUser(null);
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    route('/login', true);
  };

  if (!authChecked) {
    return <div className={styleApp.loading}>Cargando aplicación...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className={styleApp.containerPrincipal}>
        <Router>
          <PublicRoute path="/login" component={Sesion} tipo="login" onLogin={handleLogin} />
          <PublicRoute path="/registro" component={Sesion} tipo="registro" onLogin={handleLogin} />

          {/* Ahora las rutas protegidas usan Layout */}
          <ProtectedRoute path="/" component={GuidesList} />
          <ProtectedRoute path="/form" component={Form} />
          <ProtectedRoute path="/:idGuide" component={GuideDetail} />

          <PublicRoute default component={Sesion} tipo="login" onLogin={handleLogin} />
        </Router>
      </div>
    </QueryClientProvider>
  );
}
