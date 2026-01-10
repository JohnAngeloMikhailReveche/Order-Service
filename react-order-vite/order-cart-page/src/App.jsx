import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  
  const userID = 1; // Example user ID - This is based on our Database, the Order Service DB one where the userID also lives.

  // This part is a bit confusing since in the fetch part.
  /*
    First is that HTTPS is used instead of HTTP. This is because the backend API is set to use HTTPS.
    Second you have to make sure that you use the ${userID} for frontend control.
    Third you must use `` back ticks instead of '' single quotes for the fetch URL to work with the ${userID} variable.
  */
  useEffect(() => {
    fetch(`https://localhost:7237/api/Cart/item/user/${userID}`)
    .then(response => response.json())
    .then(cart => {
      setCartItems(
        cart.cartItems.map(item => ({
          id: item.cart_item_id,
          name: item.item_name,
          size: item.variant_name,
          price: item.variant_price,
          quantity: item.quantity,
          image: item.img_url
        }))
      );
    })
    .catch(err => console.error(err));
  }, []);

  const updateQuantity = (id, change) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  };

  const removeItem = (id) => setCartItems((prev) => prev.filter((item) => item.id !== id));

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container-fluid p-4" style={{ paddingBottom: "220px" }}>
      <div className="bg-beige d-flex align-items-start pt-3 pb-2 mb-3">
        <button
          className="btn btn-sm text-dark p-0 fs-5 opacity-75"
          style={{ fontWeight: "500" }}
          onClick={() => window.history.back()}
        >
          ◀
        </button>
        <div className="ms-3">
          <h1 className="display-6 fw-bold mb-1">KAPE CART</h1>
          <p className="text-muted mb-0">All your picks in one spot.</p>
        </div>
      </div>

      {/* CART ITEMS */}
      <div className="card shadow-sm border-0" style={{ maxHeight: "calc(100vh - 320px)", overflowY: "auto" }}>
        <div className="card-body p-0">
          {cartItems.map((item) => (
            <div key={item.id} className="d-flex align-items-start py-3 px-3 border-bottom">
              <img
                src={item.image}
                alt={item.name}
                className="me-3 rounded"
                style={{ width: 60, height: 60, objectFit: "cover" }}
              />
              <div className="flex-grow-1">
                <h5 className="mb-1 fw-semibold">{item.name}</h5>
                <small className="text-muted">{item.size}</small>
              </div>

              <div className="text-end">
                <div className="fw-bold mb-1" style={{ fontSize: "1.2rem" }}>₱{item.price}</div>
                <div className="d-flex flex-column align-items-end gap-1">
                  <div className="d-flex align-items-center gap-1">
                    <span className="text-muted small">Qty:</span>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-secondary px-2"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        –
                      </button>
                      <span className="btn btn-outline-secondary px-2">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary px-2"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="btn btn-link p-0 mt-1 fs-6 text-decoration-none"
                    onClick={() => removeItem(item.id)}
                    style={{ color: "#c31e2f" }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAYMENT DETAILS */}
      <div
        className="card shadow-sm border-0 mt-3"
        style={{
          position: "fixed",
          bottom: "80px",
          left: "1rem",
          right: "1rem",
          zIndex: 999,
          maxWidth: "calc(100% - 2rem)",
          margin: "0 auto",
        }}
      >
        <div className="card-footer bg-white p-3">
          <div className="border-top pt-2">
            <div className="mb-2">
              <small>Payment Details</small>
            </div>
            <div className="d-flex justify-content-between">
              <strong>Estimated Total:</strong>
              <strong>₱{total.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* PLACE ORDER BUTTON */}
      <div
        className="position-fixed bottom-0 start-0 end-0 p-3 bg-white text-center"
        style={{ zIndex: 1000, borderTop: "1px solid #dee2e6" }}
      >
        <button className="btn btn-brown w-100 py-3 fs-5 fw-bold">
         Place Order
        </button>
      </div>
    </div>
  );
}