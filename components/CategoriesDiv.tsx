'use client';
import React, { useState } from 'react'



function CategoriesDiv() {
const [categories, setCategories] = useState(["grocery", "food", "clothes", "medicine", "sports", "daily-usage"]);
  return (
    <div className="w-full h-[5vh] flex flex-row gap-2 items-center justify-center">
      {categories.map((category) => (
        <span  key={category} className='bg-gray-200 cursor-pointer hover:bg-blue-400'>{category}</span>
      ))}
    </div>
  );

}

export default CategoriesDiv