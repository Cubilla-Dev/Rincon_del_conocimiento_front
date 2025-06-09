import 'dotenv/config'; 

// config/config.env.js
export default {
    api: {
        url: import.meta.env.VITE_API_URL,
        crear_guia: import.meta.env.VITE_CREACION_GUIA,
    },
};