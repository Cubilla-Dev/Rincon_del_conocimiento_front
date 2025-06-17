import { useState } from 'preact/hooks';
import { Form as FinalForm, Field } from 'react-final-form';
import axios from 'axios';
import style from './sesion.module.css';
import { api } from '../../config/config.env';

type Props = {
  tipo: 'login' | 'registro';
  path?: string;
};

type FormValues = {
  nombre?: string;
  apellido?: string;
  correo: string;
  contrasenha: string;
};

export default function Sesion({ tipo }: Props) {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const endpoint = tipo === 'login' ? api.login : api.registre;

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setMensaje('');
    setError('');

    try {
      const response = await axios.post(`${api.url}${endpoint}`, values);

      if (response.status === 200 || response.status === 201) {
        setMensaje(tipo === 'login' ? 'Inicio de sesión exitoso' : 'Registro exitoso');
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (err) {
      setError('Error al enviar los datos. Verifica la información e intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={style.formContainer}>
      <h2>{tipo === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h2>

      {mensaje && <div className={style.success}>{mensaje}</div>}
      {error && <div className={style.error}>{error}</div>}

      <FinalForm
        onSubmit={handleSubmit}
        // eslint-disable-next-line react/jsx-no-bind
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            {tipo === 'registro' && (
              <>
                <Field name="nombre">
                  {({ input }) => (
                    <input {...input} type="text" placeholder="Nombre" className={style.input} />
                  )}
                </Field>
                <Field name="apellido">
                  {({ input }) => (
                    <input {...input} type="text" placeholder="Apellido" className={style.input} />
                  )}
                </Field>
              </>
            )}

            <Field name="correo">
              {({ input }) => (
                <input {...input} type="email" placeholder="Correo" className={style.input} />
              )}
            </Field>

            <Field name="contrasenha">
              {({ input }) => (
                <input
                  {...input}
                  type="password"
                  placeholder="Contraseña"
                  className={style.input}
                />
              )}
            </Field>

            <button type="submit" disabled={isSubmitting} className={style.button}>
              {isSubmitting ? 'Enviando...' : tipo === 'login' ? 'Ingresar' : 'Registrarse'}
            </button>
          </form>
        )}
      />
    </div>
  );
}
