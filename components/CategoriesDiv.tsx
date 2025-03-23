'use client';
import React, { useState } from 'react';
import { FaShoppingBasket, FaUtensils, FaTshirt, FaPills, FaRunning, FaHome } from 'react-icons/fa';
import Link from 'next/link';

const categoryIcons = {
  "grocery": <FaShoppingBasket />,
  "food": <FaUtensils />,
  "clothes": <FaTshirt />,
  "medicine": <FaPills />,
  "sports": <FaRunning />,
  "daily-usage": <FaHome />
};

function CategoriesDiv() {
  const [categories, setCategories] = useState([
    "grocery", "food", "clothes", "medicine", "sports", "daily-usage"
  ]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
      {categories.map((category) => (
        <Link href={`/categories/${category}`} key={category}>
          <div className="group flex flex-col items-center bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-lime-500">
            <div className="text-2xl mb-3 text-lime-700 group-hover:text-lime-600 transition-colors">
              {categoryIcons[category as keyof typeof categoryIcons]}
            </div>
            <span className="text-gray-700 font-medium capitalize group-hover:text-lime-700 transition-colors">
              {category.replace("-", " ")}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default CategoriesDiv;