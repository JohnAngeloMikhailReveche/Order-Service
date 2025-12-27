import React from 'react';
import './App.css';

const OrderDetails = () => {
  return (
    <div className="order-details-container">
      {/* Header */}
      <div className="header-section">
        <h1 className="page-title">Order Details</h1>
        <div className="logo">Kapebara</div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Order Item Card */}
        <div className="order-item-card">
          <div className="product-header">
            <div className="product-image">
              <img 
                src="./assets/order dets.png" 
                alt="Classic Matchabara Cold Brew" 
                className="drink-image"
              />
            </div>
            
            <div className="product-info">
              <h2 className="item-name">Classic Matchabara Cold Brew</h2>
              <div className="item-quantity-price">
                <span className="quantity">x1</span>
                <span className="price">₱150</span>
              </div>
              
              <div className="notes-section">
                <h4>Notes:</h4>
                <p className="notes-text">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit. Tempus leo eu aenean sed diam uma tempor.
                </p>
              </div>
              
              <div className="favorite-icon">
                <span className="star-icon">☆</span>
              </div>
            </div>
          </div>
          
          <div className="order-footer">
            <div className="left-footer">
              <div className="order-status">
                <div className="status-label">Completed</div>
                <div className="payment-method">Paid by Cash on Delivery</div>
              </div>
              
              <div className="order-id">
                <strong>Order ID</strong> <span className="id-number">1234567891F01213N</span>
              </div>
            </div>
            
            <div className="right-footer">
              <div className="order-total">
                <strong>Order Total: ₱150</strong>
              </div>
              
              <button className="buy-again-btn">Buy Again</button>
            </div>
          </div>
        </div>
        
        {/* Shipping Information Card */}
        <div className="shipping-info-card">
          <h3 className="shipping-title">Shipping Information</h3>
          <div className="shipping-date">November 25, 2025</div>
          
          <div className="customer-info">
            <div className="info-row">
              <span className="icon">👤</span>
              <span>Ron Russel Urtola</span>
            </div>
            <div className="info-row">
              <span className="icon">📍</span>
              <span>84A Road 14, Bagong Pag-Asa, Quezon City, Metro Manila</span>
            </div>
            <div className="info-row">
              <span className="icon">📞</span>
              <span>0927-192-2194</span>
            </div>
          </div>
          
          <div className="timeline">
            <div className="timeline-item">
              <span className="timeline-label">Order Time</span>
              <span className="timeline-value">12:01 PM</span>
            </div>
            <div className="timeline-item">
              <span className="timeline-label">Payment Time</span>
              <span className="timeline-value">12:03 PM</span>
            </div>
            <div className="timeline-item">
              <span className="timeline-label">Shipped Time</span>
              <span className="timeline-value">12:09 PM</span>
            </div>
            <div className="timeline-item">
              <span className="timeline-label">Completed Time</span>
              <span className="timeline-value">12:22 PM</span>
            </div>
          </div>
          
          <div className="delivery-status">
            Order has been delivered
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;