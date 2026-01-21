import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderID, setOrderID] = useState(null); // add this to CartProvider state

  const userID = 1; // TODO: replace with auth-based user ID
  const API_BASE = "https://localhost:7237/api/Cart";
  const ORDER_API_BASE = "https://localhost:7237/api/Orders";

  /* =========================
     FETCH CART
  ========================= */
  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE}/user/cart/${userID}`);
      if (!response.ok) throw new Error("Failed to fetch cart");

      const cart = await response.json();

      setCartItems(
        cart.cartItems.map(item => ({
          cartItemID: item.cart_item_id,
          name: item.item_name,
          size: item.variant_name,
          price: item.variant_price,
          quantity: item.quantity,
          image: item.img_url,
          total: item.variant_price * item.quantity,
          notes: item.notes ?? ""
        }))
      );

      setCartTotal(cart.subtotal);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userID]);

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = async (menuItemID) => {
  try {
    const response = await fetch(
      `${API_BASE}/item/add?menuItemID=${menuItemID}&userID=${userID}`,
      {
        method: "POST"
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add item to cart");
    }

    await fetchCart();      // refresh cart from backend
    setIsCartOpen(true);    // open cart UI
  } catch (err) {
    console.error("Add to cart error:", err);
  }
};

  /* =========================
     UPDATE QUANTITY
  ========================= */
  const updateQuantity = async (cartItemID, change) => {
    try {
      if (change < 0) {
        await fetch(
          `${API_BASE}/item/${cartItemID}?userID=${userID}&quantityToRemove=1`,
          { method: "DELETE" }
        );
      } else if (change > 0) {
        await fetch(
          `${API_BASE}/item/${cartItemID}/increase?userID=${userID}&count=1`,
          { method: "PATCH" }
        );
      }

      await fetchCart();
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  /* =========================
     REMOVE ITEM
  ========================= */
  const removeFromCart = async (cartItemID) => {
    try {
      await fetch(
        `${API_BASE}/item/${cartItemID}?userID=${userID}&quantityToRemove=999`,
        { method: "DELETE" }
      );

      await fetchCart();
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  /* =========================
     CLEAR CART
  ========================= */
  const clearCart = async () => {
    try {
      await fetch(`${API_BASE}/clear/${userID}`, { method: "DELETE" });
      await fetchCart();
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  /* =========================
     PLACE ORDER
  ========================= */
  const placeOrder = async () => {
  try {
    const response = await fetch(`${ORDER_API_BASE}/place/order/${userID}`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to place order");

    const order = await response.json();
    console.log("Order placed successfully:", order);

    // store the created order ID
    setOrderID(order.orders_id);

    await fetchCart(); // refresh cart after placing order

    return order.orders_id; // optional return for immediate usage
  } catch (err) {
    console.error("Place order error:", err);
    return null;
  }
};

  const toggleCart = () => setIsCartOpen(prev => !prev);

  const value = {
    cartItems,
    cartTotal,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
    toggleCart,
    setIsCartOpen,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
