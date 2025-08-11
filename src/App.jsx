import { useState } from 'preact/hooks';
import config from '../src/config/config.env';
import styleApp from './styles/app.module.css';
import { Router } from 'preact-router';

import './styles/global.css';
import Form from './components/Form/Form';
import Sesion from './components/login/Sesion';
import HomePrinc from './components/Home/HomePrinc';

export default function App() {
  const [data, setData] = useState(null);
  const url = `${config.api.url}${config.api.crear_guia}`;
  console.log('la url es ', url);

  const handleSubmit = (formData) => {
    setData(formData);
  };

  return (
    <div className={styleApp.containerPrincipal}>
      <Router>
        {/* <HomePrinc path="/" /> */}
        {/* <Sesion path="/login" tipo="login" />
        <Sesion path="/registro" tipo="registro" /> */}
        <Form onSubmit={handleSubmit} path="/form" />
      </Router>
    </div>
  );
}
