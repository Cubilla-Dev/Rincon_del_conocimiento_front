// getCookie.js
export const getCookie = (name) => {
  console.log('🍪 Buscando cookie:', name);
  console.log('🍪 Todas las cookies:', document.cookie);

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop().split(';').shift();
    console.log('🍪 Cookie encontrada:', cookieValue ? 'Sí' : 'No');
    return cookieValue;
  }

  console.log('🍪 Cookie NO encontrada');
  return null;
};
