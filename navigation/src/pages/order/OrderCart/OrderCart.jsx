import React, { createContext, useState } from 'react';
import { Card, Row, Col, Button, Form } from 'react-bootstrap';
import './OrderCart.css';
import classic_matchabara_cold_brew_Pic from './classic matchabara cold brew.png';
import { useParams } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import Cart from '../../../components/Cart';

// 1. Create the Context outside the component
export const UserContext = createContext();

function App() {
    const { addToCart, toggleCart } = useCart();

    // 2. Define the User State (Hardcoded gaya ng iyong example)
    const [user] = useState({ 
        role: 'customer', 
        name: 'Kape Lover', 
        isAuthenticated: true 
    });

    const product = {
    name: "Classic Matchabara Cold Brew",
    image: classic_matchabara_cold_brew_Pic,
    type: "drink",
    prices: { M: 120, L: 140 }
  };

    const getSizeOptions = (type) => {
    switch (type) {
        case "drink":
            return ["M", "L"];
        case "food":
            return ["1S", "3S"];
        default:
            return [];
    }
    };

    const sizeOptions = getSizeOptions(product.type);
    const [size, setSize] = React.useState(sizeOptions[0] || null);

    // React.useEffect(() => {
    //     setSize(sizeOptions[0] || null);
    // }, [sizeOptions]);

  const [quantity, setQuantity] = React.useState(1);
  const [notes, setNotes] = React.useState("");

  const price = product.prices[size] || 0;

  const handleAddToBag = () => {
    
    const variantId = 2;
    const menuItemId = (30*2)-variantId;
    addToCart(menuItemId, variantId, 1, notes || "None"); // This will depend on the menudb id where the menuitemid is stored in our mock.
    
    /*
    const cartItem = {
      productId: product.id,
      name: product.name,
      image: product.image,
      size,
      quantity,
      price,
      total: price * quantity,
      notes
    };
     */
    
    setQuantity(1);
    setSize("M");
    setNotes("");
    
  };

  return (
    <UserContext.Provider value={user}>
      {/* Main Content */}
      <div style={{ display: "flex", justifyContent: "center", padding: "40px 20px" }}>
        <Card className="main-card">
          <Row className="g-0" style={{ width: '100%', height: '100%' }}>
            <h1 className="fw-bold mb-1">Customize Your Order</h1>
            <p className="text-muted mb-4">Review and adjust item details before adding it to your bag.</p>

            <Col md={6} className="d-flex align-items-center justify-content-center">
              <Card.Img
                src={product.image}
                className="img-fluid rounded-start"
                style={{ height: '100%', width: '100%', objectFit: 'cover' }}
              />
            </Col>

            <Col md={6} className="d-flex">
              <div style={{ margin: 'auto', width: '100%' }}>
                <Card className="glossy-card">
                  <Card.Body>
                    <div style={{ width: '100%', textAlign: 'left', marginBottom: '15px' }}>
                      <Card.Title className="product-title">{product.name}</Card.Title>
                      <Card.Title className="product-price">₱{price}.00</Card.Title>
                    </div>

            {/* Labels */}
            <Row style={{ width: '100%', marginBottom: '10px', fontWeight: 500 }}>
                <Col xs={6} className="text-left mb-1">Quantity</Col>
                <Col xs={6} className="text-left mb-1">Size</Col>
            </Row>
                    
            {/* Stepper + Size Boxes */}
            <Row style={{ width: '100%', marginBottom: '15px' }}>
                    
            {/* Quantity Stepper */}
            <Col xs={6} className="d-flex justify-content-start">
                <div style={{ display: 'flex', alignItems: 'center', width: '92%', justifyContent: 'space-between', padding: '5px 10px' }}>
                    <Button variant="light" style={{ padding: 0, width: '25px', height: '25px' }}
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    >-</Button>
                        <span style={{ textAlign: 'center', flex: 1 }}>{quantity}</span>
                            <Button variant="light" style={{ padding: 0, width: '25px', height: '25px' }}
                                onClick={() => setQuantity(q => q + 1)}
                            >+</Button>
                </div>
            </Col>

                    {sizeOptions.length > 0 && (
                      <Col xs={6} className="d-flex justify-content-start">
                        <div style={{ display: 'flex', gap: '10px', width: '92%' }}>
                          {sizeOptions.map(s => (
                            <div
                            key={s}
                            onClick={() => setSize(s)}
                            style={{
                            flex: 1,
                            textAlign: 'center',
                            padding: '8px 0',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            backgroundColor: size === s ? '#AA6E39' : 'white',
                            color: size === s ? 'white' : '#333',
                            fontWeight: 500
                            }}
                            >
                            {s}
                        </div>
                        ))}
                        </div>
                      </Col>
                    )}
                    </Row>

                    <Form.Group controlId="formNotes" style={{ width: '100%', marginTop: '10px' }}>
                      <Form.Label className="notes-label">Notes</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add any special instructions..."
                        className="notes-textarea"
                      />
                    </Form.Group>

                    <Button onClick={handleAddToBag} className="add-to-bag-btn">
                      Add to Bag
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Cart */}
      <Cart />
    </UserContext.Provider>
  );
}

export default App;