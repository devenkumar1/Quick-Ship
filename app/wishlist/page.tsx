'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash, FaArrowLeft, FaShoppingBag, FaShoppingCart, FaSadTear } from 'react-icons/fa';
import useUserStore from '@/store/userStore';
import useCartStore from '@/store/cartStore';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  // Get favorites and actions from user store
  const { favorites, removeFromFavorites } = useUserStore();
  
  // Get addToCart from cart store
  const { addToCart } = useCartStore();

  // Handle remove from wishlist
  const handleRemoveFavorite = (id: number, name: string) => {
    removeFromFavorites(id);
    toast.success(`Removed ${name} from wishlist`);
  };

  // Handle add to cart
  const handleAddToCart = (item: any) => {
    addToCart({
      ...item,
      productId: item.id,
      quantity: 1,
      price: 999 // Placeholder price as we don't have full product details in favorites
    });
    toast.success(`Added ${item.name} to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Wishlist</h1>
      
      {/* Wishlist content */}
      {favorites.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
              <h2 className="text-xl font-semibold">
                Saved Items ({favorites.length})
              </h2>
            </div>
            
            {/* Wishlist items grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Product image */}
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={item.image || `https://picsum.photos/seed/${item.id}/300/300`}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    {/* Product details */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">Shop: {item.shopName || 'Unknown'}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(item.id, item.name)}
                        className="text-red-500 hover:text-red-700 ml-2"
                        aria-label={`Remove ${item.name} from wishlist`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2 mt-4">
                      <Link
                        href={`/products/${item.id}`}
                        className="flex-1 flex justify-center items-center py-2 px-4 bg-white border border-lime-600 text-lime-600 rounded-md hover:bg-lime-50 transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex justify-center items-center py-2 px-4 bg-lime-600 text-white rounded-md hover:bg-lime-700 transition-colors"
                      >
                        <FaShoppingCart className="mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Continue shopping link */}
          <div className="p-6 border-t border-gray-200">
            <Link
              href="/products"
              className="flex items-center text-lime-600 hover:text-lime-700"
            >
              <FaArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        // Empty wishlist state
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-12 my-12">
          <FaSadTear className="text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your wishlist yet.</p>
          <Link 
            href="/products" 
            className="px-6 py-3 bg-lime-600 text-white rounded-md hover:bg-lime-700 transition-colors flex items-center"
          >
            <FaShoppingBag className="mr-2" />
            Discover Products
          </Link>
        </div>
      )}
    </div>
  );
} 