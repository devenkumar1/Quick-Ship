'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaShoppingCart } from 'react-icons/fa';

// Define the Product type based on our Prisma schema
type ProductProps = {
  product: {
    id: number;
    name: string;
    price: number | string;
    shop: {
      name: string;
    };
    reviews: Array<{
      rating: number;
    }>;
    images: string[];
  }
}

const ProductCard = ({ product }: ProductProps) => {
  // Calculate average rating if reviews exist
  const averageRating = product.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)
    : "0.0";

  // Get the first image from the array or use a default image
  const productImage = product.images && product.images.length > 0
    ? product.images[0]
    : "https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return (
    <div className="min-w-[280px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col gap-3">
      {/* Image container with link to product detail */}
      <Link href={`/Products/${product.id}`} className="block relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src={productImage}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>
      
      {/* Content */}
      <div className="flex flex-col gap-2">
        <Link href={`/Products/${product.id}`} className="block">
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h2>
        </Link>
        
        {/* Price and Rating */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">₹ {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="text-sm text-gray-600">{averageRating} ({product.reviews?.length || 0})</span>
          </div>
        </div>

        {/* Shop name */}
        <span className="text-sm text-gray-500">{product.shop.name}</span>
        
        {/* Add to cart button */}
        <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300">
          <FaShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 