'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';

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
    image?: string;
  }
}

const ProductCard = ({ product }: ProductProps) => {
  // Calculate average rating if reviews exist
  const averageRating = product.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)
    : "0.0";

  // Use the image property or a default image
  const productImage = product.image || "https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group relative h-full flex flex-col">
      {/* Wishlist button - absolute positioned */}
      <button className="absolute top-3 right-3 z-10 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:text-red-500 text-gray-600 shadow-sm">
        <FaHeart className="text-lg" />
      </button>

      {/* Image container with link to product detail */}
      <Link href={`/Products/${product.id}`} className="block relative w-full h-52 overflow-hidden bg-gray-100">
        <Image
          src={productImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>
      
      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <Link href={`/Products/${product.id}`} className="block">
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-lime-600 transition-colors duration-300">
            {product.name}
          </h2>
        </Link>
        
        {/* Shop name */}
        <span className="text-sm text-gray-500 inline-flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mr-1.5"></span>
          {product.shop.name}
        </span>
        
        {/* Price and Rating */}
        <div className="flex justify-between items-center mt-1">
          <span className="text-xl font-bold text-lime-600">₹ {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</span>
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
            <FaStar className="text-yellow-400" />
            <span className="text-sm text-gray-600">{averageRating} ({product.reviews?.length || 0})</span>
          </div>
        </div>
        
        {/* Add to cart button */}
        <button className="mt-auto pt-3 w-full bg-lime-600 hover:bg-lime-700 text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md group-hover:shadow-lime-200 group-hover:shadow-sm">
          <FaShoppingCart className="group-hover:animate-bounce" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 