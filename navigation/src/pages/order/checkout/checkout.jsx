import React, { useState } from 'react';
import { Navbar, Container, Nav, Card, Row, Col, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { GeoAltFill } from 'react-bootstrap-icons';
import './Checkout.css';
import { useCart } from '../../../contexts/CartContext';
import Cart from '../../../components/Cart';

// Assets
import kapebara_logo_transparent_Pic from '../OrderCart/kapebara logo transparent.png';
import kapebara_cart_Pic from '../OrderCart/kapebara cart.jpg';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, placeOrder, toggleCart } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('gcash');

  // Mock user data - in production, this would come from user context/API
  const deliveryAddress = {
    name: "Jona Dela Cruz",
    phone: "09123456789",
    address: "84A Road 14 Bagong Pag-Asa. Quezon City, Metro manila"
  };

  const paymentMethods = [
    { id: 'gcash', name: 'GCash', logo: 'GCash', maskedNumber: '0912******', color: '#007BFF' },
    { id: 'maya', name: 'maya', logo: 'Maya', maskedNumber: '0912******', color: '#00C851' },
    { id: 'cod', name: 'Cash on Delivery', logo: null, maskedNumber: null, color: null }
  ];

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    // Store cart items and total before clearing
    const orderItems = [...cartItems];
    const orderTotal = cartTotal > 0 ? cartTotal : cartItems.reduce((sum, item) => sum + (item.total || 0), 0);
    
    // Get the selected payment method name
    const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
    const paymentMethodName = selectedMethod ? selectedMethod.name : 'GCash';

    const createdOrderID = await placeOrder();
    if (!createdOrderID) return;

    // Navigate with order data including payment method
    navigate("/order/orderstatus", { 
      state: { 
        orderId: createdOrderID,
        orderItems: orderItems,
        orderTotal: orderTotal,
        paymentMethod: paymentMethodName
      } 
    });
  };

  const total = cartTotal > 0 ? cartTotal : cartItems.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <>
      {/* Navbar Section */}
      <Navbar expand="lg" className="navbar" fixed="top">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={kapebara_logo_transparent_Pic} height="30" className="d-inline-block align-text-top" alt="Logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="center-nav" />
          <Navbar.Collapse id="center-nav" className="w-100 justify-content-center">
            <Nav className="ms-auto gap-4 align-items-center">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/admin/admincancellations">Menu</Nav.Link>
              <Nav.Link as={Link} to="/order/orderhistory">My Orders</Nav.Link>
              <Nav.Link as={Link} to="/admin/admindashboard">My Profile</Nav.Link>
              <Nav.Link as={Link} to="#" onClick={(e) => { e.preventDefault(); toggleCart(); }}>
                <img src={kapebara_cart_Pic} height="30" style={{ objectFit: "contain" }} alt="Cart" />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <div className="checkout-container">
        <Container>
          <Row className="g-4">
            {/* Left Side - Order Items and Payment Details */}
            <Col lg={8}>
              <Card className="checkout-main-card">
                <Card.Body>
                  {/* Order Items */}
                  <div className="order-items-section">
                    {cartItems.length === 0 ? (
                      <p className="text-muted">Your cart is empty.</p>
                    ) : (
                      cartItems.map((item, index) => (
                        <div key={`${item.productId}-${item.size}-${item.notes}-${index}`} className="order-item">
                          <div className="order-item-image">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="order-item-details">
                            <div className="order-item-name">{item.quantity}x {item.name}</div>
                            <div className="order-item-size">Size: {item.size}</div>
                            <div className="order-item-notes">
                              {item.notes && item.notes !== "None" ? `[${item.notes}]` : '[notes]'}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Payment Details */}
                  <div className="payment-details-section">
                    <div className="payment-details-header">Payment Details</div>
                    <div className="payment-details-divider"></div>
                    <div className="payment-total-row">
                      <span>Estimated Total:</span>
                      <span className="payment-total-amount">₱ {(total || 0).toFixed(2)}</span>
                    </div>
                    <Button 
                      className="checkout-btn"
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0}
                    >
                      Check out
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Side - Delivery Address and Payment Method */}
            <Col lg={4}>
              {/* Delivery Address Card */}
              <Card className="checkout-sidebar-card">
                <Card.Body>
                  <div className="sidebar-card-header">
                    <GeoAltFill className="sidebar-icon" />
                    <span>DELIVERY ADDRESS</span>
                  </div>
                  <div className="delivery-address-content">
                    <div>{deliveryAddress.name}</div>
                    <div>{deliveryAddress.phone}</div>
                    <div>{deliveryAddress.address}</div>
                  </div>
                </Card.Body>
              </Card>

              {/* Payment Method Card */}
              <Card className="checkout-sidebar-card">
                <Card.Body>
                  <div className="sidebar-card-header">
                    <span>PAYMENT METHOD</span>
                  </div>
                  <div className="payment-method-options">
                    {paymentMethods.map((method) => (
                      <div 
                        key={method.id} 
                        className={`payment-method-option ${selectedPaymentMethod === method.id ? 'selected' : ''}`}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                      >
                        <Form.Check
                          type="radio"
                          name="paymentMethod"
                          id={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => setSelectedPaymentMethod(method.id)}
                          label={
                            <div className="payment-method-label">
                              {method.logo && (
                                <span 
                                  className="payment-method-logo"
                                  style={{ color: method.color }}
                                >
                                  {method.logo}
                                </span>
                              )}
                              <span className="payment-method-name">{method.name}</span>
                              {method.maskedNumber && (
                                <span className="payment-method-number">{method.maskedNumber}</span>
                              )}
                            </div>
                          }
                        />
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Cart */}
      <Cart />
    </>
  );
};

export default Checkout;
