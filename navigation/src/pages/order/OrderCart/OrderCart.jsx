import React from 'react';
import { Navbar, Container, Nav, Card, Row, Col, Button, Form } from 'react-bootstrap';
import './OrderCart.css';
import classic_matchabara_cold_brew_Pic from './classic matchabara cold brew.png';
import kapebara_logo_transparent_Pic from './kapebara logo transparent.png';
import kapebara_cart_Pic from './kapebara cart.jpg';
import { Link } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import Cart from '../../../components/Cart';

function App() {

  const { addToCart, toggleCart } = useCart();

  const product = {
    id: 1,
    name: "Classic Matchabara Cold Brew",
    image: classic_matchabara_cold_brew_Pic,
    prices: { M: 120, L: 140 }
  };

  
  const [size, setSize] = React.useState("M");
  const [quantity, setQuantity] = React.useState(1);
  const [notes, setNotes] = React.useState("");

  const price = product.prices[size] || 0;
  

  const handleAddToBag = () => {
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

    addToCart(cartItem);

    setQuantity(1);
    setSize("M");
    setNotes("");
  };
  
  

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="navbar" fixed="top">
  <Container>
    <Navbar.Brand as={Link} to="/">
      <img src={kapebara_logo_transparent_Pic} height="30" className="d-inline-block align-text-top" />
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="center-nav" />
    <Navbar.Collapse id="center-nav" className="w-100 justify-content-center">
      <Nav className="ms-auto gap-4 align-items-center">
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        <Nav.Link as={Link} to="/admin/admincancellations">Menu</Nav.Link>
        <Nav.Link as={Link} to="/order/orderhistory">My Orders</Nav.Link>
        <Nav.Link as={Link} to="/admin/admindashboard">My Profile</Nav.Link>
        <Nav.Link
          as={Link} 
          to="#cart"
          onClick={(e) => {
            e.preventDefault();
            toggleCart();
          }}
        >
          <img src={kapebara_cart_Pic} height="30" style={{ objectFit: "contain" }} />
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

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

                      <Col xs={6} className="d-flex justify-content-start">
                        <div style={{ display: 'flex', gap: '10px', width: '92%' }}>
                          {['M', 'L'].map(s => (
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
    </>
  );
}

export default App;