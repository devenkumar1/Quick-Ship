'use client';
import React from "react";
import Image from "next/image";
import { FaStar, FaShoppingCart } from 'react-icons/fa';

const ProductCard1 = () => {
  return (
    <div className="min-w-[280px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col gap-3">
      {/* Image container */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
        <Image
          src="https://images.pexels.com/photos/1020370/pexels-photo-1020370.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Product"
          fill
          className="object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">Sample Product Title</h2>
        
        {/* Price and Rating */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-lime-600">₹ 999</span>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="text-sm text-gray-600">4.5 (245)</span>
          </div>
        </div>

        {/* Shop name */}
        <span className="text-sm text-gray-500">Shop Name</span>
        
        {/* Add to cart button */}
        <button className="mt-2 w-full bg-lime-600 hover:bg-lime-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300">
          <FaShoppingCart />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard1;

