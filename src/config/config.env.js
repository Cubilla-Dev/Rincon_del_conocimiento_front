// config/config.env.js
export default {
  api: {
    url: import.meta.env.VITE_API_URL,
    crear_guia: import.meta.env.VITE_CREACION_GUIA,
    obtener_guia: import.meta.env.VITE_FINDALL_GUIA,
    obtener_tags: import.meta.env.VITE_FINDALL_TAGS,
    login: import.meta.env.VITE_LOGIN,
    register: import.meta.env.VITE_REGISTER,
  },
};
