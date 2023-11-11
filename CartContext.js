import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    if (existingItemIndex > -1) {
      const newCartItems = [...cartItems];
      newCartItems[existingItemIndex] = {
        ...newCartItems[existingItemIndex],
        quantity: newCartItems[existingItemIndex].quantity + 1
      };
      setCartItems(newCartItems);
    } else {
      setCartItems(prevItems => [...prevItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (indexToRemove) => {
    setCartItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
  };

  const updateItemQuantity = (index, quantity) => {
    setCartItems(prevItems => {
      const newItems = [...prevItems];
      if (newItems[index]) {
        newItems[index] = { ...newItems[index], quantity: quantity };
      }
      return newItems;
    });
  };

  // Calculate the total price of the cart items
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate the total count of items in the cart
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateItemQuantity,
      cartCount,
      total // Provide the total here
    }}>
      {children}
    </CartContext.Provider>
  );
};
