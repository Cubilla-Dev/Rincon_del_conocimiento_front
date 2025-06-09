import { useState } from 'preact/hooks';
import Form from './components/Form/Form';
import {MultiLineInput} from './components/util/MultiLineInput'
import DataDisplay from './components/DataDisplay';
import './styles/global.css';

export default function App() {
  const [data, setData] = useState(null);

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