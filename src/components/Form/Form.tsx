import { useState } from 'preact/hooks';
import { Form as FinalForm, Field } from 'react-final-form';
import { MultiImageUploader } from '../util/MultiImageUploader';
import { MultiLineInput } from '../util/MultiLineInput';

import config from '../../config/config.env';
import styleForm from '../Form/form.module.css';
import axios from 'axios';
import { catchError } from '../hook/catchError';

type Props = {
  onSubmit: (data: any) => void;
  path?: string;
};

export default function Formulario({ onSubmit }: Props) {
  const [steps, setSteps] = useState([{ content: '', order: 1 }]);
  const [equipments, setEquipment] = useState([{ name: '' }]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const urlPeticion = `${config.api.url}${config.api.crear_guia}`;

  const fetch = async (formData: FormData) => {
    return axios({
      url: urlPeticion,
      method: 'POST',
      data: formData,
    });
  };

  const handleFormSubmit = async (values, form) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Título
      formData.append('title', values.title);

      // Imágenes
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      // Pasos y herramientas
      formData.append('steps', JSON.stringify(steps.filter((step) => step.content.trim() !== '')));
      formData.append(
        'equipments',
        JSON.stringify(equipments.filter((item) => item.name.trim() !== ''))
      );
      //envio de data
      // for (let pair of formData.entries()) {
      //   console.log(`${pair[0]}:`, pair[1]);
      // }
      const [data, error] = await catchError(fetch(formData));

      // console.table(data);
      if (error || !data || data.status !== 201) {
        throw new Error('Error al enviar datos');
      }

      // ✅ Limpiar campos después del envío
      setSteps([{ content: '', order: 1 }]);
      setEquipment([{ name: '' }]);
      setSelectedFiles([]);
      form.reset(); // limpia los inputs de título

      // ✅ Mensaje de éxito
      setSuccessMessage('¡Guía creada con éxito!');
      setTimeout(() => setSuccessMessage(''), 3000);

      onSubmit(data);
    } catch (error) {
      console.error('Error al enviar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {successMessage && (
        <div style={{ color: 'green', marginBottom: '1rem' }}>{successMessage}</div>
      )}

      <FinalForm
        onSubmit={(values, form) => handleFormSubmit(values, form)}
        // eslint-disable-next-line react/jsx-no-bind
        render={({ handleSubmit, form }) => (
          <form className={styleForm.formContainer} onSubmit={handleSubmit}>
            <h3>Título del trabajo</h3>
            <Field name="title">
              {({ input, meta }) => (
                <div>
                  <input
                    {...input}
                    type="text"
                    placeholder="Título del trabajo"
                    className={styleForm.input}
                  />
                  {meta.touched && meta.error && <span style={{ color: 'red' }}>{meta.error}</span>}
                </div>
              )}
            </Field>

            <h3>Pasos a seguir:</h3>
            <MultiLineInput
              items={steps}
              setItems={setSteps}
              placeholderTemplate="Agrega los paso"
              addButtonText="Añadir paso"
              fieldName="content"
            />

            <h3>Herramientas a usar:</h3>
            <MultiLineInput
              items={equipments}
              setItems={setEquipment}
              placeholderTemplate="Agrega herramienta"
              addButtonText="Añadir herramienta"
              fieldName="name"
            />

            <h3>Subir imagen:</h3>
            <MultiImageUploader selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />

            <button type="submit" disabled={isSubmitting} className={styleForm.button}>
              {isSubmitting ? 'Enviando...' : 'Enviar datos'}
            </button>
          </form>
        )}
      />
    </>
  );
}
