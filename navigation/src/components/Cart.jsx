import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../pages/order/OrderCart/OrderCart.css';

// Confirmation Modal Component
const ConfirmRemoveModal = ({ show, itemToRemove, onConfirm, onCancel }) => {
  if (!show) return null;

  const { productId } = itemToRemove || {};

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '24px',
        borderRadius: '12px',
        textAlign: 'center',
        width: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        <h5 style={{ 
          marginBottom: '20px', 
          fontWeight: 500,
          fontSize: '16px',
          color: '#1C1C1C'
        }}>
          Do you want to remove this order?
        </h5>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button
            variant="secondary"
            onClick={onCancel}
            style={{
              backgroundColor: '#ddd',
              borderColor: '#ddd',
              color: '#333',
              fontWeight: 600,
              fontSize: '14px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            Keep Order
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm(productId);
              onCancel();
            }}
            style={{
              backgroundColor: '#E53935',
              borderColor: '#E53935',
              fontWeight: 600,
              fontSize: '14px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontFamily: 'DM Sans, sans-serif'
            }}
          >
            Remove Order
          </Button>
        </div>
      </div>
    </div>
  );
};

// Cart Component
const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, placeOrder, orderID } = useCart();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  if (!isCartOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.total, 0);

  const handleUpdateQuantity = (productId, newQuantity, quantity) => {
    
    if(newQuantity === -1 && quantity === 1)
    {
      quantity -= 1;
    }

    if (quantity <= 0) {
      setItemToRemove({ productId });
      setShowConfirmModal(true);
      return;
    } else {
      console.log("Updating quantity for productId:", productId, "to", quantity + newQuantity);
      updateQuantity(productId, newQuantity);
    }

    
  };

  const handleRemove = (productId) => {
    setItemToRemove({ productId });
    setShowConfirmModal(true);
  };

  const handleConfirmRemove = (productId) => {
    removeFromCart(productId);
  };

  const handlePlaceOrder = async () => {
  if (cartItems.length === 0) return;

  const createdOrderID = await placeOrder(); // call API and get orderID
  if (!createdOrderID) return; // failed to place order

  setIsCartOpen(false);
  navigate("/order/orderstatus", { state: { orderId: createdOrderID } }); // pass orderID to next page
};

  return (
    <>
      <div className="cart">
        {/* Cart Header */}
        <div className="cart-header">
          <div>
            <h1 className="cart-title">My KapeBag</h1>
            <p className="cart-subtitle">All your picks in one spot.</p>
          </div>
          <Button variant="link" onClick={() => setIsCartOpen(false)} className="cart-close-btn">
            X
          </Button>
        </div>

        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="cart-empty">Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item.cartItemID}-${item.size}-${item.notes}-${index}`} className="cart-item">
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
                      onClick={() => handleUpdateQuantity(item.cartItemID, -1, item.quantity)}
                      className="cart-quantity-btn"
                    >
                      -
                    </Button>
                    <span className="cart-quantity-display">{item.quantity}</span>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.cartItemID, 1, item.quantity)}
                      className="cart-quantity-btn"
                    >
                      +
                    </Button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.cartItemID)}
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
            onClick={handlePlaceOrder} 
            className="place-order-btn"
            disabled={cartItems.length === 0}
            style={{
              opacity: cartItems.length === 0 ? 0.5 : 1,
              cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Place Order
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmRemoveModal
        show={showConfirmModal}
        itemToRemove={itemToRemove}
        onConfirm={handleConfirmRemove}
        onCancel={() => setShowConfirmModal(false)}
      />
    </>
  );
};

export default Cart;
