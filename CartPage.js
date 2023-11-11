import React, { useEffect, useState } from 'react';
import { useCart } from '../CartContext'; // Make sure this path is correct based on your project structure
import { TiDelete } from 'react-icons/ti'; // Import the TiDelete icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const CartPage = () => {
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();
  const [total, setTotal] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle removing items from the cart
  const handleRemoveFromCart = (indexToRemove) => {
    removeFromCart(indexToRemove);
  };

  // Function to handle quantity changes
  const handleQuantityChange = (index, value) => {
    const newQuantity = parseInt(value, 10);
    if (!Number.isNaN(newQuantity) && newQuantity > 0) {
      updateItemQuantity(index, newQuantity);
    } else {
      handleRemoveFromCart(index);
    }
  };

  // Effect to calculate the total whenever cartItems changes
  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, [cartItems]);

  // Function to navigate to the Checkout page
  const goToCheckout = () => {
    navigate('/checkout'); // Use navigate for navigation
  };

  return (
<div className="container mx-auto px-4 py-8">
  <h2 className="text-2xl font-semibold leading-tight mb-4">Your Cart</h2>
  {cartItems.length === 0 ? (
    <p>Your cart is empty.</p>
  ) : (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* List out cart items here */}
      {cartItems.map((item, index) => (
        <div key={item.id} className="grid grid-cols-3 items-center mb-4 border-b pb-4">
          <div className="col-span-1">
            <p className="text-lg font-semibold">{item.name}</p>
            <p className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <div className="col-span-1 text-center">
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              min="1" // Users should not be able to set the quantity to zero
              className="border rounded w-20 text-center"
            />
          </div>
          <div className="col-span-1 text-right">
            <button onClick={() => handleRemoveFromCart(index)} className="text-red-500 hover:text-red-700">
              <TiDelete size={24} /> {/* Use the TiDelete icon */}
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <span className="text-xl font-semibold">Total: ${total.toFixed(2)}</span>
        <button
          onClick={goToCheckout} // Use goToCheckout for the onClick event
          className="bg-neutral-700 hover:bg-neutral-400 text-white font-bold py-1 px-3"
        >
          Checkout
        </button>
      </div>
    </div>
  )}
</div>

  );
};

export default CartPage;
