'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaTrash, FaArrowLeft, FaShoppingBag, FaSadTear, FaLock } from 'react-icons/fa';
import useCartStore from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Get cart state and actions from cart store
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal,
    getItemsCount
  } = useCartStore();

  const cartTotal = getCartTotal();
  const itemsCount = getItemsCount();

  // Check auth status
  useEffect(() => {
    setIsAuthenticated(status === 'authenticated');
  }, [status]);

  // Handle quantity change
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  // Handle remove item
  const handleRemoveItem = (id: number, name: string) => {
    removeFromCart(id);
    toast.success(`Removed ${name} from cart`);
  };

  // Handle clear cart
  const handleClearCart = () => {
    if (items.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (isAuthenticated) {
      // Proceed with checkout
      toast.success('Proceeding to checkout!');
      router.push('/checkout');
    } else {
      // Redirect to login with return URL
      toast.error('Please login to continue with checkout');
      router.push(`/auth/login?returnUrl=${encodeURIComponent('/cart')}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Shopping Cart</h1>
      
      {/* Cart content */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items - takes up 2/3 of the space on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                <h2 className="text-xl font-semibold">
                  Cart Items ({itemsCount})
                </h2>
                <button 
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Clear Cart
                </button>
              </div>
              
              {/* Cart items list */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row md:items-center py-4 border-b border-gray-100">
                    {/* Product image */}
                    <div className="md:w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 mb-4 md:mb-0 relative">
                      <Image
                        src={item.image || `https://picsum.photos/seed/${item.productId}/300/300`}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Product details */}
                    <div className="md:ml-6 flex-grow">
                      <div className="flex flex-col md:flex-row md:justify-between mb-2">
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        <span className="font-semibold text-lime-600">
                          ₹{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-4">Shop: {item.shopName || 'Unknown'}</p>
                      
                      {/* Quantity controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border-r text-gray-600 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-10 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border-l text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.productId, item.name)}
                          className="text-red-500 hover:text-red-700"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Continue shopping link */}
            <div className="mt-6">
              <Link
                href="/products"
                className="flex items-center text-lime-600 hover:text-lime-700"
              >
                <FaArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Order summary - takes up 1/3 of the space on desktop */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold pb-4 border-b border-gray-200 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-500">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{(cartTotal * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lime-600">
                      ₹{(cartTotal + cartTotal * 0.18).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including 18% GST</p>
                </div>
              </div>
              
              <button
                className="w-full mt-6 bg-lime-600 text-white py-3 rounded-md font-medium hover:bg-lime-700 transition-colors flex items-center justify-center gap-2"
                onClick={handleCheckout}
              >
                {!isAuthenticated && <FaLock className="text-sm" />}
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
              
              {!isAuthenticated && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  You need to be logged in to checkout
                </p>
              )}
              
              <div className="mt-4 text-xs text-gray-500 space-y-2">
                <p>We accept: Credit/Debit Cards, UPI, Net Banking, Wallets</p>
                <p>Free shipping on all orders above ₹499</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Empty cart state
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-12 my-12">
          <FaSadTear className="text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link 
            href="/Products" 
            className="px-6 py-3 bg-lime-600 text-white rounded-md hover:bg-lime-700 transition-colors flex items-center"
          >
            <FaShoppingBag className="mr-2" />
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
} 