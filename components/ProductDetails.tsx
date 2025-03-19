'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaShoppingCart, FaHeart, FaArrowLeft, FaStore } from 'react-icons/fa';

// Product type based on Prisma schema
type Product = {
  id: number;
  name: string;
  price: number;
  shopId: number;
  shop: {
    name: string;
  };
  reviews: Array<{
    id: number;
    rating: number;
    text: string;
    user: {
      name: string;
    };
    createdAt: string;
  }>;
};

interface ProductDetailsProps {
  id: string;
}

export default function ProductDetails({ id }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        
        if (data && data.products && Array.isArray(data.products)) {
          const foundProduct = data.products.find((p: Product) => p.id === parseInt(id));
          
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setError('Product not found');
          }
        } else {
          setError('Failed to load product data');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  // Calculate average rating
  const averageRating = product?.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)
    : "0.0";

  // Handle quantity change
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-lg text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link href="/Products" className="flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>
        
        <div className="flex justify-center items-center min-h-[40vh]">
          <div className="text-center max-w-md">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              <p>{error || 'Product not found'}</p>
            </div>
            <Link 
              href="/Products"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Link href="/Products" className="flex items-center text-blue-600 hover:text-blue-800 mb-8">
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>
      
      {/* Product detail */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Product image */}
          <div className="md:w-1/2 relative h-[300px] md:h-[500px]">
            <Image 
              src={`https://picsum.photos/seed/${product.id}/800/600`}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Product info */}
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <button 
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Add to wishlist"
              >
                <FaHeart size={24} />
              </button>
            </div>
            
            {/* Shop info */}
            <Link href={`/shop/${product.shopId}`} className="flex items-center text-blue-600 mb-4">
              <FaStore className="mr-2" />
              {product.shop.name}
            </Link>
            
            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar
                    key={star}
                    className={`${
                      parseFloat(averageRating) >= star 
                        ? 'text-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating} ({product.reviews.length} reviews)
              </span>
            </div>
            
            {/* Price */}
            <div className="text-3xl font-bold text-blue-600 mb-6">
              ₹{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
            </div>
            
            {/* Quantity selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Quantity</h3>
              <div className="flex items-center">
                <button 
                  onClick={decrementQuantity}
                  className="w-10 h-10 bg-gray-100 rounded-l-lg flex items-center justify-center hover:bg-gray-200"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <div className="w-14 h-10 bg-gray-50 flex items-center justify-center border-t border-b border-gray-200">
                  {quantity}
                </div>
                <button 
                  onClick={incrementQuantity}
                  className="w-10 h-10 bg-gray-100 rounded-r-lg flex items-center justify-center hover:bg-gray-200"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to cart button */}
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 mb-6"
              aria-label="Add to cart"
            >
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>
        </div>
        
        {/* Reviews section */}
        <div className="p-6 md:p-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <FaStar
                        key={star}
                        className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{review.user.name}</span>
                </div>
                <p className="text-gray-600">{review.text}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 