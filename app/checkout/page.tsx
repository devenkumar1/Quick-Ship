'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaSpinner, FaShieldAlt, FaCheck, FaLock } from 'react-icons/fa';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import Script from 'next/script';
import useUserStore from '@/store/userStore';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {user}=useUserStore();

  
  // Get cart state from cart store
  const { 
    items, 
    getCartTotal,
    getItemsCount,
    clearCart
  } = useCartStore();

  const cartTotal = getCartTotal();
  const itemsCount = getItemsCount();
  const shippingCost = 0; // Free shipping
  const taxAmount = cartTotal * 0.18;
  const orderTotal = cartTotal + taxAmount + shippingCost;

  // Protect checkout page - redirect if user is not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('You must be logged in to access checkout');
      router.push('/auth/login?returnUrl=/checkout');
    }
    
    // Also redirect if cart is empty
    if (items.length === 0) {
      toast.error('Your cart is empty');
      // router.push('/cart');
    }
  }, [status, router, items.length]);

  // Handle place order
  const handlePlaceOrder = async() => {
    try {
      const response = await axios.post('/api/createOrder', {
        amount: orderTotal, 
        userId: session?.user.id,
        orderedItems: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      });
      const orderId = response.data.orderId;
      console.log(orderId);
      
      const paymentData = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        order_id: orderId,
        handler: async(response: any) => {
          try {
            const res = await axios.post('/api/verifyOrder', {
              orderCreationId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderedItems: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
              })),
              userId: user?.id,
              amount: orderTotal,
              prefill: {
                name: user.name,
                email: user?.email || '',
                contact: user?.phone || ''
              },
              theme: {
                color: '#F37254'
              }
            });
    
            const data = res.data;
            console.log(data);
            
            if(data.isOk===true) {
              console.log('Payment successful and order created');
              toast.success('Payment successful');
              router.push('/my-orders');
              clearCart();          
            } else {
              console.error('Payment failed');
              toast.error('Payment failed');
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            toast.error('Error processing payment');
          }
        }
      };
      
      const payment = new (window as any).Razorpay(paymentData);
      payment.open();
      
    } catch (error) {
      toast.error('Failed to create order');
      console.log("error in creating order", error);
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-lime-600 text-4xl" />
      </div>
    );
  }

  // Show only if authenticated
  if (status === 'authenticated') {
    return (
      <div className="container mx-auto px-4 py-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" onLoad={() => console.log('Razorpay script loaded')} />
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout form - takes up 2/3 on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-lime-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">1</span>
                Shipping Address
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input 
                    id="fullName"
                    type="text"
                    defaultValue={user?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    id="email"
                    type="email" 
                    defaultValue={session.user?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    id="phone"
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input 
                    id="address"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="Enter your street address"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input 
                    id="city"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input 
                    id="postalCode"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                    placeholder="Enter your postal code"
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-lime-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">2</span>
                Payment Method
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 border rounded-md cursor-pointer bg-lime-50 border-lime-500">
                  <input 
                    type="radio" 
                    id="cashOnDelivery" 
                    name="paymentMethod" 
                    value="cod" 
                    defaultChecked
                    className="text-lime-600 focus:ring-lime-500 h-4 w-4"
                  />
                  <label htmlFor="cashOnDelivery" className="ml-2 flex-grow cursor-pointer">
                    <span className="font-medium">Pay with Razorpay</span>
                    <p className="text-xs text-gray-500 mt-1">choose from various payment methods available</p>
                  </label>
                  <FaCheck className="text-lime-600" />
                </div>
                
                <div className="flex items-center p-3 border rounded-md cursor-not-allowed opacity-60">
                  <input 
                    type="radio" 
                    id="creditCard" 
                    name="paymentMethod" 
                    value="card" 
                    disabled
                    className="text-lime-600 focus:ring-lime-500 h-4 w-4"
                  />
                  <label htmlFor="creditCard" className="ml-2 flex-grow">
                    <span className="font-medium">Cash on Delivery</span>
                    <p className="text-xs text-gray-500 mt-1">Coming soon!</p>
                  </label>
                </div>
            
              </div>
            </div>
            
            {/* Return to cart link */}
            <div className="mt-4">
              <Link
                href="/cart"
                className="flex items-center text-lime-600 hover:text-lime-700"
              >
                <FaArrowLeft className="mr-2" />
                Return to Cart
              </Link>
            </div>
          </div>
          
          {/* Order summary - takes up 1/3 on desktop */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold pb-4 border-b border-gray-200 mb-4">
                Order Summary
              </h2>
              
              {/* Order items summary */}
              <div className="max-h-60 overflow-auto mb-4 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center py-2">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image || `https://picsum.photos/seed/${item.productId}/300/300`}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price breakdown */}
              <div className="space-y-3 py-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Shipping</span>
                  <span className="text-sm text-green-500">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tax (18% GST)</span>
                  <span className="text-sm">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-lime-600">₹{orderTotal.toFixed(2)}</span>
                </div>
              </div>
              
              {/* Place order button */}
              <button
                className="w-full mt-6 bg-lime-600 text-white py-3 rounded-md font-medium hover:bg-lime-700 transition-colors flex items-center justify-center"
                onClick={handlePlaceOrder}
              >
                <FaLock className="mr-2 text-sm" />
                Place Order
              </button>
              
              {/* Security note */}
              <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
                <FaShieldAlt className="mr-1" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  
  return null;
} 