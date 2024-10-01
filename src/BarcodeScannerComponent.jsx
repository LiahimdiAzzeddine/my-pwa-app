import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

const BarcodeScannerComponent = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const status = await BarcodeScanner.checkPermission({ force: true });
    setHasPermission(status.granted);
  };

  const startScan = async () => {
    if (!hasPermission) {
      console.log('Permission not granted');
      return;
    }

    setIsScanning(true);

    // Préparer l'interface pour le scan (surtout important pour iOS)
    document.body.style.background = 'transparent';
    document.querySelector('body')?.classList.add('scanner-active');

    try {
      const result = await BarcodeScanner.startScan({
        targetedFormats: ['EAN_8', 'EAN_13', 'QR_CODE', 'CODE_39', 'CODE_128', 'UPC_A', 'UPC_E']
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
    // Restaurer l'interface
    document.body.style.background = '';
    document.querySelector('body')?.classList.remove('scanner-active');
  };

  return (
    <div style={{ visibility: isScanning ? 'hidden' : 'visible' }}>
      <h1>Scanner de codes-barres</h1>

      {!hasPermission && (
        <p>L'autorisation d'utiliser la caméra n'a pas été accordée.</p>
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

      {isScanning && (
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999
        }}>
          {/* Zone de scan transparente */}
        </div>
      )}
    </div>
  );
};

export default BarcodeScannerComponent;