// config/config.env.js
export default {
  api: {
    url: import.meta.env.VITE_API_URL,
    login: import.meta.env.LOGIN,
    registre: import.meta.env.REGISTER,
    crear_guia: import.meta.env.VITE_CREACION_GUIA,
  },
};
