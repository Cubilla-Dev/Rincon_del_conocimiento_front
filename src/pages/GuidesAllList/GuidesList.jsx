import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'preact/hooks';
import config from '../../config/config.env';
import GuideList from './GuidesList.module.css';
import { Link, route } from 'preact-router';

async function fetchGuides() {
  const url = `${config.api.url}/api/guides`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error al obtener las guías');
  }
  return response.json();
}

function GuidesList() {
  const {
    data: guides = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['guides'], // Identificador único para el cache
    queryFn: fetchGuides, // Función que hace la petición
  });

  if (isLoading) return <div>Cargando guías...</div>;
  if (error) return <div>Error: {error.message}</div>;
  console.log('la data es ', guides);

  return (
    <>
      {guides.length === 0 ? (
        <p>No hay guías disponibles.</p>
      ) : (
        <ul className={GuideList.containerPage}>
          {guides.map((guide) => (
            <li key={guide.id_guide}>
              <Link href={`/${guide.id_guide}`} className={GuideList.guideCard}>
                <h2>{guide.title}</h2>
                <p>Verificada: {guide.isVerified ? 'Sí' : 'No'}</p>
                <div className={GuideList.containerTag}>
                  {guide.tags.map((tag) => (
                    <span key={tag.id_tag} className={GuideList.tag}>
                      {tag.content}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default GuidesList;
