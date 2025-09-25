import axios from 'axios';
import { getCookie } from './getCookie';

const peticionAxios = async ({ url, tipoPeticion = 'GET', data }) => {
  const token = getCookie('authToken');

  console.log('🔍 Debug peticionAxios:');
  console.log('URL:', url);
  console.log('Método:', tipoPeticion);
  console.log('Token encontrado:', token ? 'Sí' : 'No');
  console.log('Token (primeros 50 chars):', token ? token.substring(0, 50) + '...' : 'null');

  try {
    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Solo agregamos Content-Type si es JSON
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    console.log('Headers enviados:', headers);

    const response = await axios({
      method: tipoPeticion,
      url,
      data,
      headers,
    });

    console.log('✅ Respuesta exitosa:', response.status);
    return response.data;
  } catch (error) {
    console.error('❌ Error en la petición Axios:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Headers enviados:', error.config?.headers);
    console.error('Error completo:', error);
    throw error;
  }
};

export default peticionAxios;
