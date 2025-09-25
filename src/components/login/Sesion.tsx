import { useState, useEffect } from 'preact/hooks';
import { Form as FinalForm, Field } from 'react-final-form';
import axios from 'axios';
import style from './sesion.module.css';
import config from '../../config/config.env.js';
import { route } from 'preact-router';

type Props = {
  tipo: 'login' | 'registro';
  path?: string;
  onLogin: (userData: any) => void;
};

type FormValues = {
  nombre?: string;
  apellido?: string;
  correo: string;
  contrasena: string;
};

type ApiResponse = {
  token: string;
  message: string;
  user?: any;
};

// Función para guardar el token en una cookie
const setTokenCookie = (token: string, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = `authToken=${token}; ${expires}; path=/; Secure; SameSite=Strict`;
};

// Modal de Error
const ErrorModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className={style.modalOverlay} onClick={onClose}>
      <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={style.modalHeader}>
          <h3>{title}</h3>
          <button className={style.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={style.modalBody}>
          <p>{message}</p>
        </div>
        <div className={style.modalFooter}>
          <button className={style.btnPrimary} onClick={onClose}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Sesion({ tipo, onLogin }: Props) {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const endpoint = tipo === 'login' ? config.api.login : config.api.register;

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setMensaje('');
    setError('');

    try {
      const response = await axios.post(`${config.api.url}/${endpoint}`, values);
      console.log('Respuesta del backend:', response);

      if (response.status === 200 || response.status === 201) {
        const data = response.data as ApiResponse;

        // Guardar el token en cookie
        if (data.token) {
          setTokenCookie(data.token);
          console.log('Token guardado correctamente');
        }

        setMensaje(
          data.message || (tipo === 'login' ? 'Inicio de sesión exitoso' : 'Registro exitoso')
        );

        // Llamar a la función onLogin con los datos del usuario
        // ESTO DEBERÍA SER SUFICIENTE PARA REDIRIGIR
        onLogin(data.user || { email: values.correo });
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (err) {
      // Manejo de errores...
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={style.formContainer}>
      <h2 className={style.title}>{tipo === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h2>

      {mensaje && <div className={style.successMessage}>{mensaje}</div>}

      <FinalForm
        onSubmit={handleSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className={style.contentSesion}>
              {tipo === 'registro' && (
                <>
                  <Field name="nombre">
                    {({ input }) => (
                      <input
                        {...input}
                        type="text"
                        placeholder="Nombre"
                        className={style.input}
                        required
                      />
                    )}
                  </Field>
                  <Field name="apellido">
                    {({ input }) => (
                      <input
                        {...input}
                        type="text"
                        placeholder="Apellido"
                        className={style.input}
                        required
                      />
                    )}
                  </Field>
                </>
              )}
              <>
                <Field name="correo">
                  {({ input }) => (
                    <input
                      {...input}
                      type="email"
                      placeholder="Correo"
                      className={style.input}
                      required
                    />
                  )}
                </Field>

                <Field name="contrasena">
                  {({ input }) => (
                    <input
                      {...input}
                      type="password"
                      placeholder="Contraseña"
                      className={style.input}
                      required
                      minLength={6}
                    />
                  )}
                </Field>
              </>
              <button type="submit" disabled={isSubmitting} className={style.button}>
                {isSubmitting ? 'Enviando...' : tipo === 'login' ? 'Ingresar' : 'Registrarse'}
              </button>
              <div className={style.linkContainer}>
                {tipo === 'login' ? (
                  <p>
                    ¿No tienes cuenta?{' '}
                    <a href="/registro" className={style.link}>
                      Regístrate aquí
                    </a>
                  </p>
                ) : (
                  <p>
                    ¿Ya tienes cuenta?{' '}
                    <a href="/login" className={style.link}>
                      Inicia sesión aquí
                    </a>
                  </p>
                )}
              </div>
            </div>
          </form>
        )}
      />

      <ErrorModal isOpen={!!error} onClose={() => setError('')} title="Error" message={error} />
    </div>
  );
}
