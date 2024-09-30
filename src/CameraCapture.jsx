import React, { useState } from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';

const CameraCapture = () => {
  // State pour stocker l'image capturée
  const [imageUrl, setImageUrl] = useState(null);

  // Fonction pour prendre une photo
  const takePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, // On récupère l'URL de l'image
      });

      // On stocke l'URL de l'image dans le state
      setImageUrl(photo.webPath);
    } catch (error) {
      console.error('Erreur lors de la prise de photo :', error);
    }
  };

  return (
    <div>
      <h1>Prendre une photo</h1>

      {/* Bouton pour capturer une photo */}
      <button onClick={takePhoto} className="btn btn-primary">
        Prendre une photo
      </button>

      {/* Affichage de l'image capturée si elle existe */}
      {imageUrl && (
        <div>
          <h3>Image capturée :</h3>
          <img src={imageUrl} alt="Captured" style={{ width: '300px', height: 'auto' }} />
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
