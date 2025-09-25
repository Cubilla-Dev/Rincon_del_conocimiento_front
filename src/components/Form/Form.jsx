import { useState, useEffect } from 'preact/hooks';
import { MultiImageUploader } from '../util/MultiImageUploader';
import { MultiLineInput } from '../util/MultiLineInput';
import config from '../../config/config.env';
import { useQuery } from '@tanstack/react-query';
import styleForm from '../Form/Form.module.css';
import peticionAxios from '../util/peticionAxios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const CREATE_GUIDE_ENDPOINT = import.meta.env.VITE_CREACION_GUIA;

export default function Form({ onSubmit }) {
  const [steps, setSteps] = useState([{ content: '', order: 1 }]);
  const [equipment, setEquipment] = useState([{ name: '' }]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Usando las variables de entorno directamente
  const url = `${API_BASE_URL}${CREATE_GUIDE_ENDPOINT}`;
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await peticionAxios({
          url: `${config.api.url}/${config.api.obtener_tags}`,
          tipoPeticion: 'GET',
        });
        console.log('la data de tags ', response);
        setTags(response);
      } catch (error) {
        console.error('Error al traer tags:', error);
      }
    };

    fetchTags();
  }, []);

  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagChange = (e) => {
    const options = e.target.options;
    const values = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    setSelectedTags(values);
  };

  // Función para manejar el envío al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      formData.append('title', title);
      formData.append('description', description);
      formData.append('steps', JSON.stringify(steps.filter((step) => step.content.trim() !== '')));
      formData.append(
        'equipments',
        JSON.stringify(equipment.filter((item) => item.name.trim() !== ''))
      );
      formData.append('tags', JSON.stringify(selectedTags));

      const result = await peticionAxios({
        url,
        tipoPeticion: 'POST',
        data: formData,
      });

      console.log('Guía creada:', result);
      onSubmit(result);
    } catch (error) {
      console.error('Error al enviar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className={styleForm.title}>Titulo</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titulo"
        required
        className={styleForm.input}
      />

      <h3 className={styleForm.title}>Descripcion</h3>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripcion"
        required
        className={styleForm.input}
      />

      <h3 className={styleForm.title}>Pasos a seguir:</h3>
      <MultiLineInput
        items={steps}
        setItems={setSteps}
        placeholderTemplate="Agrega el {order} paso"
        addButtonText="Añadir paso"
        fieldName="content"
      />

      <h3 className={styleForm.title}>Herramientas a usar:</h3>
      <MultiLineInput
        items={equipment}
        setItems={setEquipment}
        placeholderTemplate="Agrega herramienta {order}"
        addButtonText="Añadir herramienta"
        fieldName="name"
      />

      <h3 className={styleForm.title}>Subir imagen:</h3>
      <MultiImageUploader selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />

      {/* --- tags --- */}
      <h3 className={styleForm.title}>Selecciona tags:</h3>

      {tags && (
        <div className={styleForm.tags}>
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id_tag.toString());

            return (
              <button
                key={tag.id_tag}
                type="button" // importante, para que no dispare el submit
                className={`${styleForm.tagButton} ${isSelected ? styleForm.selected : ''}`}
                onClick={() => {
                  setSelectedTags(
                    (prev) =>
                      prev.includes(tag.id_tag.toString())
                        ? prev.filter((id) => id !== tag.id_tag.toString()) // si está, lo saco
                        : [...prev, tag.id_tag.toString()] // si no está, lo agrego
                  );
                }}
              >
                {tag.content}
              </button>
            );
          })}
        </div>
      )}

      <button type="submit" disabled={isSubmitting} className={styleForm.button}>
        {isSubmitting ? 'Enviando...' : 'Enviar datos'}
      </button>
    </form>
  );
}
