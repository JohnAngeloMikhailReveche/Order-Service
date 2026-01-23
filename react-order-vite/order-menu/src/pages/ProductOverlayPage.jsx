import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import RelatedItems from '../components/RelatedItems';
import { getRelatedItems } from '../menuData';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { menuData } from '../menuData';
import './ProductOverlayPage.css';

export default function ProductOverlayPage() {
  const params = useParams();
  const location = useLocation();
  // support both route params (if configured) and direct pathname matching
  let menuItemId = params.menuItemId;
  if (!menuItemId) {
    const match = location.pathname.match(/\/order\/cart\/(\d+)/);
    menuItemId = match ? match[1] : undefined;
  }
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('M');
  const [imageError, setImageError] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);

  const product = menuData.find(item => item.id === menuItemId);

  const handleClose = () => {
    navigate('/');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleAddToCart = () => {
    // Navigate to order cart with product details
    const currentPrice = product.hasSize 
      ? (selectedSize === 'M' ? product.priceM : product.priceL)
      : product.price;
    
    // Navigate to order cart page - adjust path as needed
    navigate('/order/cart', { 
      state: { 
        productId: product.id,
        name: product.displayName || product.name,
        size: product.hasSize ? selectedSize : null,
        price: currentPrice,
        image: product.image
      } 
    });
  };

  // Prevent body scroll when modal is open and initialise selectors
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';

      // initialize selectors depending on product type
      if (product.hasSize) {
        setSelectedSize('M');
        setSelectedPack(null);
      } else if (product.category === 'cupcakes') {
        setSelectedPack('solo');
        setSelectedSize(null);
      } else if (product.category === 'snacks') {
        setSelectedPack('3pcs');
        setSelectedSize(null);
      } else {
        setSelectedPack(null);
        setSelectedSize(null);
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [product]);

  if (!product) {
    return null;
  }

  let currentPrice;
  if (product.hasSize) {
    currentPrice = (selectedSize === 'M' ? product.priceM : product.priceL);
  } else if (product.category === 'cupcakes') {
    currentPrice = (selectedPack === 'solo' ? product.priceSolo : product.price3);
  } else if (product.category === 'snacks') {
    currentPrice = (selectedPack === '3pcs' ? product.price3 : product.price6);
  } else {
    currentPrice = product.price;
  }

  return (
    <div className="product-overlay-backdrop" onClick={handleBackdropClick}>
      <div className="product-overlay-container" onClick={(e) => e.stopPropagation()}>
        <Button 
          className="product-overlay-close-btn"
          onClick={handleClose}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>

        <Container fluid className="product-overlay-content">
          <Row className="product-overlay-main">
            <Col md={6} className="product-overlay-image-col">
              {!imageError ? (
                <img 
                  src={product.image} 
                  alt={product.displayName || product.name}
                  className="product-overlay-image"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="product-overlay-image" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: '#F5F5F5',
                  color: '#757575',
                  minHeight: '400px'
                }}>
                  Image not available
                </div>
              )}
            </Col>
            <Col md={6} className="product-overlay-details-col">
              <div className="product-overlay-details">
                <h1 className="product-overlay-name">{product.displayName || product.name}</h1>
                <p className="product-overlay-price">₱{currentPrice}</p>
                <p className="product-overlay-description">
                  {product.description || "Short description of the product. Pwede siya mas mahaba depende sa maisip ilagay, pero for now ito muna placeholder kase katamad magcopy ng lorem ipsum sa google."}
                </p>
                
                {product.hasSize && (
                  <div className="product-overlay-size-selector">
                    <Button
                      className={`size-btn ${selectedSize === 'M' ? 'active' : ''}`}
                      onClick={() => setSelectedSize('M')}
                    >
                      M
                    </Button>
                    <Button
                      className={`size-btn ${selectedSize === 'L' ? 'active' : ''}`}
                      onClick={() => setSelectedSize('L')}
                    >
                      L
                    </Button>
                  </div>
                )}

                {/* Pack selector for cupcakes and snacks */}
                {product.category === 'cupcakes' && (
                  <div className="product-overlay-size-selector">
                    <Button
                      className={`size-btn ${selectedPack === 'solo' ? 'active' : ''}`}
                      onClick={() => setSelectedPack('solo')}
                    >
                      Solo
                    </Button>
                    <Button
                      className={`size-btn ${selectedPack === '3pcs' ? 'active' : ''}`}
                      onClick={() => setSelectedPack('3pcs')}
                    >
                      3pcs
                    </Button>
                  </div>
                )}

                {product.category === 'snacks' && (
                  <div className="product-overlay-size-selector">
                    <Button
                      className={`size-btn ${selectedPack === '3pcs' ? 'active' : ''}`}
                      onClick={() => setSelectedPack('3pcs')}
                    >
                      3pcs
                    </Button>
                    <Button
                      className={`size-btn ${selectedPack === '6pcs' ? 'active' : ''}`}
                      onClick={() => setSelectedPack('6pcs')}
                    >
                      6pcs
                    </Button>
                  </div>
                )}

                <Button 
                  className="product-overlay-add-btn"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
        {product && (
          <div className="product-overlay-related">
            <RelatedItems items={getRelatedItems(product)} />
          </div>
        )}
      </div>
    </div>
  );
}