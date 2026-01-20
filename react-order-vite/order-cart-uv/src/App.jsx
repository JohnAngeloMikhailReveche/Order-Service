import React from 'react';
import {
  Navbar,
  Container,
  Nav,
  Card,
  Row,
  Col,
  Button,
  Form,
  Modal
} from 'react-bootstrap';
import './App.css';
import productImg from "./classic-matchabara-cold-brew.png";
import logoImg from "./kapebara-logo-transparent.png";
import cartImg from "./kapebara-cart.jpg";

// --- Cart Component ---
function Cart({ items, isOpen, onClose, onRemove, onUpdateQuantity, onPlaceOrder }) {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="cart">
      {/* Cart Header */}
      <div className="cart-header">
        <div>
          <h1 className="cart-title">My KapeBag</h1>
          <p className="cart-subtitle">All your picks in one spot.</p>
        </div>
        <Button variant="link" onClick={onClose} className="cart-close-btn">
          X
        </Button>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {items.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          items.map((item, index) => (
            <div key={item.key} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-size">Size: {item.size}</div>
                <div className="cart-item-notes">
                  {item.notes ? item.notes : 'No special instructions'}
                </div>
              </div>
              <div className="cart-item-controls">
                <div className="cart-item-price">₱{item.price * item.quantity}.00</div>
                <div className="quantity-controls">
                <Button
                    variant="light"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.key, item.quantity - 1)}
                    className="cart-quantity-btn"
                  >
                    -
                </Button>

                <span className="cart-quantity-display">{item.quantity}</span>

                <Button
                  variant="light"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.key, item.quantity + 1)}
                  className="cart-quantity-btn"
                >
                  +
                </Button>

                </div>
                <button
                onClick={() => onRemove(item.key)}
                className="cart-remove-btn"
                >
                Remove
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Footer */}
      <div className="cart-footer">
        <div className="cart-total-row">
          <span>Estimated Total:</span>
          <span className="cart-total-amount">₱{total}.00</span>
        </div>
        <Button 
          variant="none"
          onClick={onPlaceOrder} 
          className="place-order-btn"
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}

function App() {
  const product = {
    id: 1,
    name: "Classic Matchabara Cold Brew",
    image: productImg,
    prices: { M: 120, L: 140 }
  };

  const [quantity, setQuantity] = React.useState(1);
  const [size, setSize] = React.useState("M");
  const [notes, setNotes] = React.useState("");
  const [cartItems, setCartItems] = React.useState([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  //  Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [itemToRemove, setItemToRemove] = React.useState(null);
  const createCartKey = (id, size, notes) =>
  `${id}-${size}-${notes?.trim() || 'none'}`;

  const price = product.prices[size] || 0;

  const handleAddToBag = () => {
    const cartKey = createCartKey(product.id, size, notes);
    const cartItem = {
     key: cartKey,
     productId: product.id,
     name: product.name,
    image: product.image,
    size,
    quantity,
    price,
    total: price * quantity,
    notes
  };


    const existingItemIndex = cartItems.findIndex(
      item =>
        item.productId === cartItem.productId &&
        item.size === cartItem.size &&
        item.notes === cartItem.notes
    );

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += cartItem.quantity;
      updatedCartItems[existingItemIndex].total =
        updatedCartItems[existingItemIndex].price * updatedCartItems[existingItemIndex].quantity;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, cartItem]);
    }

    setQuantity(1);
    setSize("M");
    setNotes("");
    setIsCartOpen(true);
  };

const handleRemoveFromCart = (itemKey) => {
  setCartItems(cartItems.filter(item => item.key !== itemKey));
};


const handleUpdateQuantity = (itemKey, newQuantity) => {
  if (newQuantity <= 0) {
    setItemToRemove(itemKey);
    setShowConfirmModal(true);
    return;
  }

  setCartItems(prev =>
    prev.map(item =>
      item.key === itemKey
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    )
  );
};

const handlePlaceOrder = () => {
  setShowSuccessModal(true);
  setCartItems([]);
  setIsCartOpen(false);
};

  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  //  Confirmation Modal Component
const ConfirmRemoveModal = () => {
  if (!showConfirmModal) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <h5 className="confirm-title">
          Do you want to remove this order?
        </h5>
        <div className="confirm-actions">
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
            className="confirm-btn keep"
          >
            Keep Order
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleRemoveFromCart(itemToRemove); 
              setShowConfirmModal(false);
            }}
            className="confirm-btn remove"
          >
            Remove Order
          </Button>
        </div>
      </div>
    </div>
  );
};



return (
  <>
    {/* Cart */}
    <Cart
      items={cartItems}
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      onRemove={handleRemoveFromCart}
      onUpdateQuantity={handleUpdateQuantity}
      onPlaceOrder={handlePlaceOrder}
    />

    {ConfirmRemoveModal()}
    <Modal
      show={showSuccessModal}
      onHide={() => setShowSuccessModal(false)}
      centered
    >
      <Modal.Body className="text-center">
        <h5 style={{ fontWeight: 600 }}>Order Placed!</h5>
        <p>Your order was successfully Placed.</p>
        <Button
          onClick={() => setShowSuccessModal(false)}
          className="place-order-btn"
        >
          OK
        </Button>
      </Modal.Body>
    </Modal>

      {/* Navbar */}
      <Navbar expand="lg" className="navbar" fixed="top">
        <Container>
          <Navbar.Brand href="#home">
            <img src={logoImg} height="30" className="d-inline-block align-text-top" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="center-nav" />
          <Navbar.Collapse id="center-nav" className="w-100 justify-content-center">
            <Nav className="ms-auto gap-4 align-items-center">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#menu">Menu</Nav.Link>
              <Nav.Link href="#my-orders">My Orders</Nav.Link>
              <Nav.Link href="#my-profile">My Profile</Nav.Link>
              <Nav.Link
                href="#cart"
                onClick={(e) => {
                  e.preventDefault();
                  setIsCartOpen(!isCartOpen);
                }}
              >
                <img src={cartImg} height="30" style={{ objectFit: "contain" }} />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

       {/* Main Card */}
      <div style={{ display: "flex", justifyContent: "center", padding: "40px 20px" }}>
        <Card className="card" style={{ maxWidth: "800px", width: "100%", padding: "24px", height: "600px" }}>
          <Row className="g-0" style={{ width: '100%', height: '100%' }}>
            <h1 className="fw-semibold">Customize Your Order</h1>
          <p className="text-muted mb-4">Review and adjust item details before adding it to your bag.</p>

            {/* Image */}
            <Col md={6} className="d-flex align-items-center justify-content-center">
              <Card.Img src={product.image} className="img-fluid rounded-start" style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
            </Col>

            {/* Card Contents */}
            <Col md={6} className="d-flex">
              <div style={{ margin: 'auto', width: '100%' }}>

                <Card className="card-glossy" style={{ maxWidth: "500px", width: "100%", padding: "20px", height: "440px" }}>
                <Card.Body style={{ width: '100%' }}>

                  {/* Product Info */}
                  <div style={{ width: '100%', textAlign: 'left', marginBottom: '15px' }}>
                    <Card.Title style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '20px', fontWeight: 600 }}>{product.name}</Card.Title>
                    <Card.Title style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '40px', fontWeight: 700 }}>₱{price}.00</Card.Title>
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

                    {/* Size Boxes */}
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

                  {/* Notes */}
                  <Form.Group controlId="formNotes" style={{ width: '100%', marginTop: '10px' }}>
                    <Form.Label style={{ fontWeight: 500 }}>Notes</Form.Label>
                    <Form.Control
                      className="notes-textarea"
                      as="textarea"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any special instructions..."
                      style={{ width: '100%', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '15px', fontWeight: 400 }}
                    />
                  </Form.Group>

                 <Button
  className="add-to-bag-btn"
  style={{ 
    width: '100%', 
    marginTop: '25px', 
    fontFamily: "'DM Sans', sans-serif", 
    fontSize: "15px", 
    fontWeight: 700 
  }}
  onClick={handleAddToBag}   
>
                  Add to Bag
                </Button>
                </Card.Body>
              </Card>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
}

export default App;