import React, { useEffect, useState, useCallback } from "react";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { Capacitor } from "@capacitor/core";
import frame from "./assets/frame.svg";
import whiteLogo from "./assets/logo-white.svg";

const Scanner = ({ onScan, scannerActive }) => {
  const [scanError, setScanError] = useState("");
  const [cameraAccess, setCameraAccess] = useState(false);
  const [permissionDeniedCount, setPermissionDeniedCount] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const requestCameraPermission = useCallback(async () => {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        setCameraAccess(true);
        setScanError("");
        setPermissionDeniedCount(0);
      } else if (status.denied) {
        setCameraAccess(false);
        setScanError("Permission caméra non accordée.");
        setPermissionDeniedCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
      setScanError("Erreur lors de la demande de permission de la caméra.");
    }
  }, []);

  const openAppSettings = useCallback(async () => {
    try {
      await BarcodeScanner.openAppSettings();
    } catch (error) {
      console.error("Erreur lors de l'ouverture des paramètres:", error);
      setScanError("Impossible d'ouvrir les paramètres de l'application.");
    }
  }, []);

  const startScanner = useCallback(async () => {
    if (!scannerActive || !cameraAccess || isScanning) return;

    try {
      setIsScanning(true);
      await BarcodeScanner.hideBackground();
      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        onScan(result.content);
        setScanError("");
      } else {
        setScanError("Aucun code-barres détecté.");
      }
    } catch (error) {
      console.error("Erreur lors du scan:", error);
      setScanError("Erreur lors du scan.");
    } finally {
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
      setIsScanning(false);
    }
  }, [scannerActive, cameraAccess, isScanning, onScan]);

  useEffect(() => {
    if (scannerActive && cameraAccess) {
      startScanner();
    }

    return () => {
      if (isScanning) {
        BarcodeScanner.stopScan();
        BarcodeScanner.showBackground();
      }
    };
  }, [scannerActive, cameraAccess, startScanner, isScanning]);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  return (
    <div className="scanner-container">
      {cameraAccess && (
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
      )}
      {!cameraAccess && (
        <div className="permission-container">
          <p className="permission-message">
            L'accès à la caméra n'a pas été accordé ou n'est pas disponible.
          </p>
          {permissionDeniedCount < 2 ? (
            <button
              onClick={requestCameraPermission}
              className="permission-button"
            >
              Demander l'accès à la caméra
            </button>
          ) : (
            <button onClick={openAppSettings} className="permission-button">
              Ouvrir les paramètres de l'application
            </button>
          )}
        </div>
      )}
      {scanError && <p className="error-message">{scanError}</p>}
    </div>
  );
};

export default React.memo(Scanner);
