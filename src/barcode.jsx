import React, { useState } from 'react';
import { Plugins } from '@capacitor/core';

const { BarcodeScanner } = Plugins;

const Barcode = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = async () => {
    setIsScanning(true);
    try {
      const result = await BarcodeScanner.scan({
        preferFrontCamera: false, // true pour utiliser la caméra avant
        showFlipCameraButton: true,
        showTorchButton: true,
        showCancelButton: true,
        openSettingsIfPermissionWasPreviouslyDenied: true,
      });

      // Vérifiez si le scan a réussi
      if (result.hasContent) {
        const scannedData = {
          content: result.content,
          format: result.format,
        };
        setScanResult(scannedData);
        console.log('Code scanné:', scannedData);
      }
    } catch (error) {
      console.error('Erreur lors du scan :', error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div>
      <h1>Scanner de codes-barres</h1>
      <button onClick={startScan} className="btn btn-primary" disabled={isScanning}>
        {isScanning ? 'Scan en cours...' : 'Démarrer le scan'}
      </button>

      {scanResult && (
        <div>
          <h3>Résultat du scan :</h3>
          <p>Contenu: {scanResult.content}</p>
          <p>Format: {scanResult.format}</p>
        </div>
      )}
    </div>
  );
};

export default Barcode;
