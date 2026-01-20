import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('kapebag');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kapebag', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(
      cartItem =>
        cartItem.productId === item.productId &&
        cartItem.size === item.size &&
        cartItem.notes === item.notes
    );

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += item.quantity;
      updatedCartItems[existingItemIndex].total =
        updatedCartItems[existingItemIndex].price * updatedCartItems[existingItemIndex].quantity;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, item]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, itemSize, itemNotes) => {
    setCartItems(
      cartItems.filter(
        item => !(item.productId === productId && item.size === itemSize && item.notes === itemNotes)
      )
    );
  };

  const updateQuantity = (productId, itemSize, itemNotes, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, itemSize, itemNotes);
      return;
    }

    setCartItems(
      cartItems.map(item =>
        item.productId === productId && item.size === itemSize && item.notes === itemNotes
          ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    setIsCartOpen
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
