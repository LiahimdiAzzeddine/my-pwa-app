import React, { useState, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';

const BarcodeScannerComponent = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const status = await BarcodeScanner.checkPermission({ force: false });
    setHasPermission(status.granted);
  };

  const requestPermission = async () => {
    const status = await BarcodeScanner.checkPermission({ force: true });
    setHasPermission(status.granted);
  };

  const startScan = async () => {
    if (!hasPermission) {
      await requestPermission();
      if (!hasPermission) return;
    }

    setIsScanning(true);

    // Préparer l'interface pour le scan
    document.querySelector('body').classList.add('scanner-active');

    try {
      const result = await BarcodeScanner.startScan({
        targetedFormats: ['EAN_8', 'EAN_13', 'QR_CODE', 'CODE_39', 'CODE_128', 'UPC_A', 'UPC_E'],
        // Optimisations pour la lecture horizontale
        torchEnabled: true,
        prompt: "Placez le code-barres dans le cadre, horizontalement ou verticalement",
        orientation: 'portrait',
        disableSuccessBeep: false
      });

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

  const stopScan = () => {
    BarcodeScanner.stopScan();
    setIsScanning(false);
    document.querySelector('body').classList.remove('scanner-active');
  };

  return (
    <div style={{ display: isScanning ? 'none' : 'block' }}>
      <h1>Scanner de codes-barres</h1>

      {!hasPermission && (
        <button onClick={requestPermission} className="btn btn-secondary">
          Demander la permission
        </button>
      )}

      <button 
        onClick={isScanning ? stopScan : startScan} 
        className="btn btn-primary"
        disabled={!hasPermission}
      >
        {isScanning ? 'Arrêter le scan' : 'Démarrer le scan'}
      </button>

      {scanResult && (
        <div>
          <h3>Résultat du scan :</h3>
          <p>Contenu: {scanResult.content}</p>
          <p>Format: {scanResult.format}</p>
        </div>
      )}

      {isScanning && Capacitor.getPlatform() === 'ios' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          zIndex: 9999
        }} />
      )}
    </div>
  );
};

export default BarcodeScannerComponent;