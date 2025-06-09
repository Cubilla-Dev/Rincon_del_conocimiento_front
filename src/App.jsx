import { useState } from 'preact/hooks';
import Form from './components/Form/Form';
import config from '../src/config/config.env'
import DataDisplay from './components/DataDisplay';
import './styles/global.css';
const API_BASE_URL = import.meta.env.VITE_API_URL;
const CREATE_GUIDE_ENDPOINT = import.meta.env.VITE_CREACION_GUIA;

export default function App() {
  const [data, setData] = useState(null);
  const url = `${API_BASE_URL}${CREATE_GUIDE_ENDPOINT}`;
  console.log('la url es ', url)

  const handleSubmit = (formData) => {
    setData(formData);
  };

  return (
    <div>
      <h1>Mi App Preact</h1>
      <Form onSubmit={handleSubmit} />
      {/* <MultiLineInput /> */}
      {data && <DataDisplay data={data} />}
    </div>
  );
}