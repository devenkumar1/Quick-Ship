'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';

// Define Product type
type Product = {
  id: number;
  name: string;
  price: number;
  shop: {
    name: string;
  };
  reviews: Array<{
    rating: number;
  }>;
  image?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        if (data && data.products) {
          // Add some sample images since there's no image field in the schema
          const productsWithImages = data.products.map((product: Product, index: number) => ({
            ...product,
            image: `https://picsum.photos/seed/${product.id}/300/200`
          }));
          
          setProducts(productsWithImages);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        const aRating = a.reviews.length > 0 
          ? a.reviews.reduce((sum, review) => sum + review.rating, 0) / a.reviews.length
          : 0;
        const bRating = b.reviews.length > 0 
          ? b.reviews.reduce((sum, review) => sum + review.rating, 0) / b.reviews.length
          : 0;
        return bRating - aRating;
      default:
        return 0;
    }
  });

  // Handle scenarios: loading, error, no products
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">All Products</h1>
        
        {/* Search and filters row */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products or shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Sort dropdown */}
          <div className="md:w-64">
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Sort By: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Filter button (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <FaFilter />
            Filters
          </button>
        </div>
        
        {/* Mobile filters - can be expanded */}
        {showFilters && (
          <div className="md:hidden bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="font-semibold mb-2">Price Range</h3>
            {/* Add your filter controls here */}
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => setShowFilters(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Product grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
