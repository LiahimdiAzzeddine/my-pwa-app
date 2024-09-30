import React, { useState } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

const BarcodeScannerComponent = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Fonction pour démarrer le scan
  const startScan = async () => {
    setIsScanning(true);

    try {
      // Demander l'autorisation pour utiliser la caméra
      await BarcodeScanner.checkPermission({ force: true });

      // Démarrer le scanner de codes-barres avec des options spécifiques
      const result = await BarcodeScanner.startScan({
        targetedFormats: [
          'EAN_8',
          'EAN_13',
          'QR_CODE',
          'CODE_39',
          'CODE_128',
          'UPC_A',
          'UPC_E'
        ]
      });

      // Vérifier si un code a été scanné
      if (result.hasContent) {
        const scannedData = {
          content: result.content,
          format: result.format
        };
        setScanResult(scannedData);
        console.log('Code scanné:', scannedData);
      }
    } catch (error) {
      console.error('Erreur lors du scan :', error);
    } finally {
      stopScan();
    }
  };

  // Fonction pour arrêter le scan
  const stopScan = () => {
    BarcodeScanner.stopScan();
    setIsScanning(false);
  };

  return (
    <div>
      <h1>Scanner de codes-barres</h1>

      <button onClick={isScanning ? stopScan : startScan} className="btn btn-primary">
        {isScanning ? 'Arrêter le scan' : 'Démarrer le scan'}
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

export default BarcodeScannerComponent;