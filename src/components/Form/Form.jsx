import { useState } from 'preact/hooks';
import { MultiImageUploader } from '../util/MultiImageUploader';
import { MultiLineInput } from '../util/MultiLineInput';
import config from '../../config/config.env';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const CREATE_GUIDE_ENDPOINT = import.meta.env.VITE_CREACION_GUIA;

export default function Form({ onSubmit }) {
  const [steps, setSteps] = useState([{ content: '', order: 1 }]);
  const [equipment, setEquipment] = useState([{ name: '' }]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  // Usando las variables de entorno directamente
  const url = `${API_BASE_URL}${CREATE_GUIDE_ENDPOINT}`;

  console.log('la url es ', config.api.url);

  // Función para manejar el envío al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Crear FormData para enviar tanto la imagen como los pasos
      const formData = new FormData();

      // Agregar múltiples imágenes
      selectedFiles.forEach((file) => {
        formData.append('images', file); // Mejor usar el mismo nombre para todos
      });

      //Agrega titulo
      formData.append('title', title);

      // Agregar otros datos
      formData.append('steps', JSON.stringify(steps.filter((step) => step.content.trim() !== '')));

      formData.append(
        'equipments',
        JSON.stringify(equipment.filter((item) => item.name.trim() !== ''))
      );

      // Enviar al backend (ejemplo con fetch)
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        // No necesitas headers para 'Content-Type' con FormData,
        // el navegador lo establecerá automáticamente con el boundary correcto
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const result = await response.json();
      onSubmit(result);
      console.log('Éxito:', result);
      // Aquí puedes manejar la respuesta exitosa (redirección, mensaje, etc.)
    } catch (error) {
      console.error('Error al enviar:', error);
      // Manejar el error (mostrar mensaje al usuario, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Titulo</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titulo"
        required
      />

      <h3>Pasos a seguir:</h3>
      <MultiLineInput
        items={steps}
        setItems={setSteps}
        placeholderTemplate="Agrega el {order} paso"
        addButtonText="Añadir paso"
        fieldName="content"
      />

      <h3>Herramientas a usar:</h3>
      <MultiLineInput
        items={equipment}
        setItems={setEquipment}
        placeholderTemplate="Agrega herramienta {order}"
        addButtonText="Añadir herramienta"
        fieldName="name"
      />

      <h3>Subir imagen:</h3>
      <MultiImageUploader selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />

      <button type="submit" disabled={isSubmitting} style={{ marginTop: '20px' }}>
        {isSubmitting ? 'Enviando...' : 'Enviar datos'}
      </button>
    </form>
  );
}
