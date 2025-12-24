// src/App.jsx
import React, { useState } from 'react';
import { Navbar, Container, Nav, Card, Row, Col, Button, Form, ListGroup, ListGroupItem } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// import classic_matchabara_cold_brew_Pic from './classic matchabara cold brew.png';
// import kapebara_logo_transparent_Pic from './kapebara logo transparent.png';
// import kapebara_cart_Pic from './kapebara cart.jpg';

// Placeholder images
const classic_matchabara_cold_brew_Pic = 'https://via.placeholder.com/300x300?text=Coffee';
const kapebara_logo_transparent_Pic = 'https://via.placeholder.com/100x50?text=Logo';
const kapebara_cart_Pic = 'https://via.placeholder.com/30x30?text=Cart';

function App() {
  // Mock product data
  const product = {
    id: 1,
    name: "Classic Matchabara Cold Brew",
    image: classic_matchabara_cold_brew_Pic,
    prices: {
      M: 120,
      L: 140
    }
  };

  // Local state for customizing this product
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");
  const [notes, setNotes] = useState("");

  // Cart state - holds all added items
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // Track if cart is visible

  const price = product.prices[size] || 0;
  const totalPrice = price * quantity;

  // Function to add item to cart
  const handleAddToBag = () => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      size,
      quantity,
      price,
      total: totalPrice,
      notes,
      image: product.image
    };

    setCartItems(prev => [...prev, cartItem]);
    setIsCartOpen(true); // Open cart after adding
    console.log("Added to bag:", cartItem);
  };

  // Function to remove item from cart
  const handleRemoveItem = (index) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.12; // 12% tax
  const estimatedTotal = subtotal + tax;

  // Function to place order
  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    setCartItems([]); // Clear cart
    setIsCartOpen(false); // Close cart
  };

  return (
    <>
      {/* Default Bootstrap Navigation Bar */}
      <Navbar expand="lg" className="navbar">
        <Container>
          <div className="d-flex align-items-center">
            <Navbar.Brand href="#home">
              <img src={kapebara_logo_transparent_Pic} height="30" className="d-inline-block align-text-top"/>
            </Navbar.Brand>
          </div>
          <Navbar.Toggle aria-controls="center-nav" />
          <Navbar.Collapse id="center-nav" className="w-100 justify-content-center">
            <Nav className="ms-auto gap-4 align-items-center">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#menu">Menu</Nav.Link>
              <Nav.Link href="#my-orders">My Orders</Nav.Link>
              <Nav.Link href="#my-profile">My Profile</Nav.Link>
              {/* Clicking this toggles the cart */}
              <Nav.Link onClick={() => setIsCartOpen(!isCartOpen)}>
                <img src={kapebara_cart_Pic} height="30" style={{ objectFit: "contain" }}/>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Product Card */}
      <div style={{ display: "flex", justifyContent: "center", padding: "40px 20px" }}>
        <Card className="card" style={{ maxWidth: "800px", width: "100%", padding: "24px" }}>
          <h1 className="fw-bold mb-1">Customize Your Order</h1>
          <p className="text-muted mb-4">Review and adjust item details before adding it to your bag.</p>
          <Row className="g-0">
            {/* Image */}
            <Col md={6} className="d-flex align-items-center justify-content-center">
              <Card.Img src={product.image} className="img-fluid rounded-start" style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }} />
            </Col>

            {/* Card Contents */}
            <Col md={6} className="d-flex">
              <div style={{ margin: 'auto', width: '100%' }}>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Size</Form.Label>
                      <Form.Select value={size} onChange={(e) => setSize(e.target.value)}>
                        <option value="M">Medium - P{product.prices.M}</option>
                        <option value="L">Large - P{product.prices.L}</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Special Instructions</Form.Label>
                      <Form.Control as="textarea" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requests?" />
                    </Form.Group>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span>Total: P{totalPrice}</span>
                      <Button variant="primary" onClick={handleAddToBag}>Add to Bag</Button>
                    </div>
                  </Form>
                </Card.Body>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Persistent Cart Sidebar - Only shown when isCartOpen is true */}
      {isCartOpen && (
        <div className="cart-sidebar">
          <Card className="h-100" style={{ width: '300px', position: 'fixed', right: 0, top: 0, bottom: 0, borderLeft: '1px solid #dee2e6', background: '#fff' }}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Kapebara KAPE CART</h5>
              <Button variant="link" size="sm" onClick={() => setIsCartOpen(false)}>Close</Button>
            </Card.Header>
            <Card.Body className="p-0">
              {cartItems.length === 0 ? (
                <div className="text-center p-4">Your cart is empty.</div>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <img src={item.image} alt={item.name} height="50" className="me-3" />
                        <div>
                          <strong>{item.name}</strong>
                          <div className="text-muted">{item.notes || "No notes"}</div>
                          <small>Size: {item.size} • Qty: {item.quantity}</small>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <div>P {item.price}</div>
                        <div className="btn-group btn-group-sm mb-1">
                          <button className="btn btn-outline-secondary" onClick={() => handleRemoveItem(index)}>-</button>
                          <span className="btn btn-outline-secondary disabled">{item.quantity}</span>
                          <button className="btn btn-outline-secondary">+</button>
                        </div>
                        <Button variant="link" size="sm" onClick={() => handleRemoveItem(index)}>Remove</Button>
                      </div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
            {cartItems.length > 0 && (
              <Card.Footer>
                <Row>
                  <Col>Subtotal:</Col>
                  <Col className="text-end">P {subtotal.toFixed(2)}</Col>
                </Row>
                <Row>
                  <Col>Estimated Total:</Col>
                  <Col className="text-end">P {estimatedTotal.toFixed(2)}</Col>
                </Row>
                <Button
                  variant="dark"
                  className="mt-3 w-100"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </Card.Footer>
            )}
          </Card>
        </div>
      )}
    </>
  );
}

export default App;
