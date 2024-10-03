import { useState } from 'react';
import Scanner from "./Scanner";
import "./scanner.css";
import Result from './Result';
import 'antd/dist/reset.css';  

function App() {
  const [barcode, setBarcode] = useState(null);
  const [scannerActive, setScannerActive] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const handleScan = (code) => {
    setBarcode(code);
    setScannerActive(false); // Désactiver le scanner après la détection du code-barres
    setShowDetails(true);    // Montrer les détails après le scan
  };

  const resetMain = () => {
    setBarcode(null);         // Réinitialiser le code-barres
    setScannerActive(true);   // Réactiver le scanner
    setShowDetails(false);    // Masquer les détails
  };

  return (
    <>
      {showDetails ? (
        <Result
          barcode={barcode}
          resetBarcode={resetMain}
        />
      ) : (
        <Scanner
          onScan={handleScan}
          scannerActive={scannerActive}
          deactivateScanner={() => setScannerActive(false)}
        />
      )}
    </>
  );
}

export default App;
