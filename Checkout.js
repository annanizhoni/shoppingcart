import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

// Load your Stripe publishable key
const stripePromise = loadStripe('pk_test_51IUyyvA9gwdOZYvzBKJk6zWxwsNMeHzSnxSjSyHWeQqY5shd8fiu7AiKCQ3X5jMYFeeH7nM3hT2nGBhgol07mAUI002HrGz98l'); // Replace 'your_publishable_key' with your actual key

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartItems, total } = useCart();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPaymentProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe has not initialized yet. Please try again in a moment.");
      setPaymentProcessing(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:1337/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: Math.round(total * 100) }), // Convert amount to cents
      });

      const { client_secret } = await response.json();
      const cardElement = elements.getElement(CardElement);

      const paymentResult = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
            // Include other billing details if necessary
          },
        },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          // Redirect to the success page
          navigate('/payment-success');
        }
      }
    } catch (err) {
      setError(err.message);
    }

    setPaymentProcessing(false);
  };

  if (cartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold leading-tight mb-4">Checkout</h2>
      <form onSubmit={handleSubmit}>
        {/* Customer Information */}
        {/* ... input fields for customer information */}
        
        {/* Address Information */}
        {/* ... input fields for address information */}
        
        {/* Payment Information */}
        <div>
          <label htmlFor="card-element">Credit or Debit Card</label>
          <CardElement id="card-element" />
          {/* Show any error that happens when processing the payment */}
          {error && <div className="error" role="alert">{error}</div>}
          {/* ... rest of your input fields */}
        </div>
        
        {/* Total and Submit */}
        <div>
          <p>Total: ${total.toFixed(2)}</p>
          <button type="submit" disabled={paymentProcessing} className="bg-neutral-700 hover:bg-neutral-400 text-white font-bold py-1 px-3">
            {paymentProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
