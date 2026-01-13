// App.jsx
import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderDetails.css';


const kapebara_cart_Pic = "/assets/kapebara cart.jpg";


const ORDER_STATUS = {
  ALL: "All",
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
};


const STATUS_BADGE_CLASS = {
  [ORDER_STATUS.ALL]: "status-all",
  [ORDER_STATUS.ONGOING]: "status-ongoing",
  [ORDER_STATUS.COMPLETED]: "status-completed",
  [ORDER_STATUS.CANCELLED]: "status-cancelled"
};


const orderData = {
  id: "123456",
  date: "Nov 20, 2025",
  status: ORDER_STATUS.COMPLETED,


  customer: {
    name: "Jona Dela Cruz",
    address: "84A Road 14, Bagong Pag-Asa, Quezon City, Metro Manila",
    phone: "09171234567"
  },


  timeline: {
    order: "12:01 PM",
    payment: "12:03 PM",
    shipped: "12:09 PM",
    completed: "12:22 PM"
  },


  items: [
    {
      id: 1,
      name: "Classic Matchabara Cold Brew",
      size: "Medium",
      qty: 1,
      price: 120,
      image: "/assets/matchabara-cold-brew.png",
      note: "Please less ice on the Matcha. Thank you!"
    },
    {
      id: 2,
      name: "Classic Coffeebara Cold Brew",
      size: "Medium",
      qty: 1,
      price: 100,
      image: "/assets/coffeebara-cold-brew.png",
      note: "Please less ice on the Matcha. Thank you!"
    }
  ],


  payment: {
    method: "GCash",
    last4: "9283",
    deliveryFee: 0
  }
};


const OrderDetails = () => {  
  const subtotal = orderData.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );


  const grandTotal = subtotal + orderData.payment.deliveryFee;
  const statusClass = STATUS_BADGE_CLASS[orderData.status];


  return (
    <div className="order-details-container">


      {/* HEADER */}
      <div className="header-section">
        <h1 className="page-title">Order Details</h1>


        <Navbar expand="lg" className="navbar">
          <Container>
            <Navbar.Toggle aria-controls="center-nav" />
            <Navbar.Collapse id="center-nav" className="w-100 justify-content-center">
              <Nav className="ms-auto gap-4 align-items-center">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#menu">Menu</Nav.Link>
                <Nav.Link href="#my-orders">My Orders</Nav.Link>
                <Nav.Link href="#my-profile">My Profile</Nav.Link>
                <Nav.Link href="#cart">
                  <img src={kapebara_cart_Pic} height="30" style={{ objectFit: "contain" }} />
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>


      {/* MAIN CONTENT */}
      <div className="main-content">


        {/* LEFT COLUMN */}
        <div className="order-item-card">
          <div className="orders-section">
            <h4 className="section-header">ORDERS</h4>


            {orderData.items.map(item => (
              <React.Fragment key={item.id}>
                <div className="order-item">
                  <img src={item.image} alt={item.name} className="product-image" />


                  <div className="item-details">
                    <span className="quantity">{item.qty}x</span>
                    <div className="item-name">{item.name}</div>
                    <div className="item-size">{item.size}</div>
                  </div>


                  <span className="price">₱{item.price.toFixed(2)}</span>
                </div>


                {item.note && (
                  <div className="order-note">
                    <h4>Order Note:</h4>
                    <p>"{item.note}"</p>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>


          {/* FOOTER */}
          <div className="order-footer">
            <div className="left-footer">
              <span className={`status-badge ${statusClass}`}>
                {orderData.status}
              </span>


              <div className="order-id">
                <span>Order ID</span>{" "}
                <span className="id-number">
                  {orderData.id} - {orderData.date}
                </span>
              </div>
            </div>


            <button className="request-for-refund-btn">
              Request for Refund
            </button>
          </div>
        </div>


        {/* RIGHT COLUMN */}
        <div className="right-column">


          {/* SHIPPING INFO */}
          <div className="shipping-info-card">
            <h4 className="section-header">SHIPPING INFORMATION</h4>


            <div className="customer-info">
              <div className="info-row">
                <img src="/assets/user-icon.png" className="icon-image" />
                <span className="customer-name">{orderData.customer.name}</span>
              </div>


              <div className="info-row">
                <img src="/assets/location-icon.png" className="icon-image" />
                <span>{orderData.customer.address}</span>
              </div>


              <div className="info-row">
                <img src="/assets/contact-icon.png" className="icon-image" />
                <span>{orderData.customer.phone}</span>
              </div>
            </div>


            <div className="timeline">
              {Object.entries(orderData.timeline).map(([label, value]) => (
                <div className="timeline-item" key={label}>
                  <span className="timeline-label">
                    {label.replace(/^\w/, c => c.toUpperCase())} Time
                  </span>
                  <span className="timeline-value">{value}</span>
                </div>
              ))}
            </div>
          </div>


          {/* PAYMENT SUMMARY */}
          <div className="payment-summary-card">
            <h4 className="section-header">PAYMENT SUMMARY</h4>


            <div className="payment-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₱{orderData.payment.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>GRAND TOTAL</span>
                <span>₱{grandTotal.toFixed(2)}</span>
              </div>
            </div>


            <div className="payment-method">
              <h4>Payment Method</h4>
              <div className="payment-card">
                <div className="gcash-badge">{orderData.payment.method}</div>
                <span className="card-number">******* {orderData.payment.last4}</span>
                <span className="check-icon">✓</span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};


export default OrderDetails;