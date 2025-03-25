'use client';

import { useEffect, useState } from 'react';
import useProductStore from '@/store/productStore';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

export default function CategoriesPage() {
  const { 
    products,
    categories,
    selectedCategory,
    isLoading,
    fetchProducts,
    filterProductsByCategory,
    setSelectedCategory
  } = useProductStore();

  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(filterProductsByCategory(selectedCategory));
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products, filterProductsByCategory]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-lime-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Categories Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h1>
        <p className="text-gray-600">Browse our wide selection of products across different categories</p>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <Button
          variant={!selectedCategory ? "default" : "outline"}
          className={!selectedCategory ? "bg-lime-600 hover:bg-lime-700" : ""}
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={selectedCategory === category ? "bg-lime-600 hover:bg-lime-700" : ""}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* No Products Message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600">No products found in this category</h3>
        </div>
      )}
    </div>
  );
} 