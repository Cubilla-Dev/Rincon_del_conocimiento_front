import { useState } from 'preact/hooks';

export function MultiImageUploader({ selectedFiles, setSelectedFiles }) {
  const [previewUrls, setPreviewUrls] = useState([]);
  const MAX_IMAGES = 5;
  const MIN_IMAGES = 3;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validar cantidad de imágenes
    const totalFiles = selectedFiles.length + files.length;
    if (totalFiles > MAX_IMAGES) {
      alert(`Solo puedes subir un máximo de ${MAX_IMAGES} imágenes`);
      return;
    }

    // Validar que sean imágenes
    const invalidFiles = files.filter(file => !file.type.match('image.*'));
    if (invalidFiles.length > 0) {
      alert('Por favor, selecciona solo archivos de imagen');
      return;
    }

    // Actualizar archivos seleccionados
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // Generar previsualizaciones para los nuevos archivos
    const newPreviews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === files.length) {
          setPreviewUrls([...previewUrls, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        multiple
        disabled={selectedFiles.length >= MAX_IMAGES}
        style={{ display: 'block', margin: '10px 0' }}
      />
      <p>
        {selectedFiles.length}/{MAX_IMAGES} imágenes seleccionadas. 
        {selectedFiles.length < MIN_IMAGES && 
          ` Mínimo requerido: ${MIN_IMAGES}`}
      </p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
        {previewUrls.map((url, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img 
              src={url} 
              alt={`Previsualización ${index + 1}`} 
              style={{ 
                width: '100px', 
                height: '100px',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
            <button 
              onClick={() => removeImage(index)}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              {selectedFiles[index].name.slice(0, 15)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}