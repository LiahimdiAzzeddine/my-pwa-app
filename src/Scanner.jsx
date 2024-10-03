import { useEffect, useState } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import frame from './assets/frame.svg';
import whiteLogo from './assets/logo-white.svg';

const Scanner = ({ onScan, scannerActive }) => {
  const [scanError, setScanError] = useState('');
  const [cameraAccess, setCameraAccess] = useState(false);

  useEffect(() => {
    const startScanner = async () => {
      if (!scannerActive) return; // Ne démarre pas le scan si scannerActive est false

      try {
        const status = await BarcodeScanner.checkPermission({ force: true });
        if (!status.granted) {
          setScanError('Permission caméra non accordée.');
          return;
        }
        
        setCameraAccess(true);

        BarcodeScanner.hideBackground(); // Cache l'arrière-plan
        const result = await BarcodeScanner.startScan(); // Démarre le scan

        if (result.hasContent) {
          onScan(result.content); // Passe le code scanné à la fonction onScan
          setScanError('');
        } else {
          setScanError('Aucun code-barres détecté.');
        }
      } catch (error) {
        console.error('Erreur lors du scan:', error);
        setScanError('Erreur lors du scan.');
      } finally {
        BarcodeScanner.showBackground(); // Restaure l'arrière-plan après le scan
        BarcodeScanner.stopScan(); // Arrête le scan
      }
    };

    if (scannerActive) {
      startScanner();
    }

    return () => {
      BarcodeScanner.stopScan();
      BarcodeScanner.showBackground();
    };
  }, [onScan, scannerActive]);

  return (
    <>
      <div className="scanner__marker-container">
        <img
          src={whiteLogo}
          alt="Logo"
          className="scanner__marker-container__white-logo"
        />
        <div className="scanner__marker-container__frame-container">
          <img
            src={frame}
            alt="Frame to scan the barcode"
            className="scanner__marker-container__frame-container__frame"
          />
          <p>Scannez le code-barres</p>
        </div>
      </div>

      {!cameraAccess && <p>L’accès à la caméra n’a pas été accordé ou n’est pas disponible.</p>}
      {scanError && <p className="error-message">{scanError}</p>}
    </>
  );
};

export default Scanner;
