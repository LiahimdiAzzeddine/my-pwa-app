import { useEffect, useState } from "react";
import { Card as AntCard } from "antd";
import { Button as AntButton, Flex } from "antd";


const Result = (props) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  let output = null;

  // Chargement des infos du produit
  useEffect(() => {
    if (props.barcode) {
      setProduct(props.barcode);
      setError(null); // Réinitialiser l'erreur s'il y a un produit
    } 
  }, [props.barcode]);

  const resetAll = () => {
    props.resetBarcode();
    setProduct(null);
    setError(null);
  };

  // Affichage du produit si disponible
  if (product) {
    output = (
      <>
        <AntCard size="large" className="card-container result__card" title="Produit scanné">
          <div className="result__info">
            <h4 className="result__product" style={{marginBottom:"1.5rem"}}>Barcode: {product}</h4>
            <Flex vertical gap="small" style={{ width: "100%" }}>
              <AntButton
              style={{backgroundColor:"#f7b668",fontWeight:"bold"}}
              size={'large'} 
                type="primary"
                className="result__reset-btn"
                onClick={resetAll}
              >
                Réinitialiser
              </AntButton>
            </Flex>
          </div>
        </AntCard>
      </>
    );
  }

  // Affichage de l'erreur si aucune donnée produit n'est disponible
  if (error && !product) {
    output = (
      <AntCard size="large" className="card-container result__card" title="Erreur">
     
        <div className="result__info">
          <h2 className="result__error">Erreur de lecture du code-barres</h2>
          <Flex vertical gap="small" style={{ width: "100%" }}>
            <AntButton
              type="primary"
              className="result__reset-btn"
              onClick={resetAll}
            >
              Réinitialiser
            </AntButton>
          </Flex>
        </div>
      </AntCard>
    );
  }

  return <div className="result">{output}</div>;
};

export default Result;
