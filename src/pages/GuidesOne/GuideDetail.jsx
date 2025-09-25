import { useState, useEffect } from 'preact/hooks';
import { route } from 'preact-router';
import { useQuery } from '@tanstack/react-query';
import config from '../../config/config.env';
import GuidesDetail from './GuidesDetail.module.css';

async function fetchGuide(idGuide) {
  const url = `${config.api.url}${config.api.obtener_guia}/${idGuide}`;
  console.log('la id y url es ', idGuide, url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error al obtener la guía');
  }
  return response.json();
}

function GuidesList({ idGuide }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const {
    data: guide,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['guides', idGuide],
    queryFn: () => fetchGuide(idGuide),
    enabled: !!idGuide,
  });
  console.log('la data es ', guide.equipments);

  if (isLoading) return <div>Cargando guías...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={GuidesDetail.containerPage}>
      <h1 className={GuidesDetail.title}>{guide.title}</h1>
      <h3 className={GuidesDetail.description}>{guide.description}</h3>
      <h3>Equipos...</h3>
      {guide.equipments.map((equipment, index) => (
        <li key={equipment.id} className={GuidesDetail.contaiEquipStep}>
          {index + 1}. {equipment.id_equipment} {equipment.name}
        </li>
      ))}

      <h3>Pasos:</h3>
      {guide.steps.map((step, index) => (
        <li key={step.order} className={GuidesDetail.contaiEquipStep}>
          {index + 1}. {step.content}
        </li>
      ))}
      <div className={GuidesDetail.imgContainer}>
        {guide.images.map((img) => (
          <img
            key={img.id}
            src={img.url}
            alt="Imagen de la guía"
            onClick={() => setSelectedImage(img.url)}
          />
        ))}
      </div>
      {/* Modal de imagen completa */}
      {selectedImage && (
        <div className={GuidesDetail.modal} onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Imagen completa" />
        </div>
      )}
    </div>
  );
}

export default GuidesList;
