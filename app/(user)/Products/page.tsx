'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import axios from 'axios';
import { ClientOnly, SkeletonProductCard } from '@/app/components/skeletons/Skeleton';

// Product type based on Prisma schema
type Product = {
  id: number;
  name: string;
  price: number;
  shopId: number;
  images: string[];
  shop: {
    name: string;
  };
  reviews?: Array<{
    rating: number;
  }>;
  category?: string;
  createdAt: string;
};

type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'newest';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number | null }>({ min: 0, max: null });
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ products: Product[] }>('/api/products');
        
        if (response.data && response.data.products) {
          setProducts(response.data.products);
          setFilteredProducts(response.data.products);
        } else {
          setError('No products found');
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

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shop.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Apply price range filter
    result = result.filter(product => 
      product.price >= priceRange.min && 
      (!priceRange.max || product.price <= priceRange.max)
    );

    // Apply rating filter
    if (minRating > 0) {
      result = result.filter(product => getAverageRating(product) >= minRating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => getAverageRating(b) - getAverageRating(a));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, sortBy, priceRange, minRating]);

  // Calculate average rating for a product
  const getAverageRating = (product: Product) => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / product.reviews.length;
  };

  // Skeleton UI for products page
  const renderSkeletonUI = () => (
    <div className="container mx-auto px-4 py-12">
      {/* Search and filters skeleton */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-grow bg-gray-200 h-12 rounded-lg animate-pulse"></div>
          <div className="flex gap-2">
            <div className="bg-gray-200 h-12 w-32 rounded-lg animate-pulse"></div>
            <div className="bg-gray-200 h-12 w-12 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(12).fill(0).map((_, index) => (
          <SkeletonProductCard key={index} />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return renderSkeletonUI();
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
          
          {/* Search and Sort Controls */}
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors"
              aria-label="Toggle filters panel"
              title="Toggle filters"
            >
              <FaFilter /> Filters
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Sort products"
              title="Sort products"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  aria-label="Filter by category"
                  title="Filter by category"
                >
                  <option value="all">All Categories</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="home">Home & Living</option>
                </select>
              </div>
              
              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max || ''}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                      className={`p-2 rounded-lg ${
                        rating <= minRating ? 'bg-yellow-400 text-white' : 'bg-gray-100'
                      }`}
                      aria-label={`Set minimum rating to ${rating} stars`}
                      title={`Set minimum rating to ${rating} stars`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link 
              href={`/Products/${product.id}`} 
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.name}
                </h2>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`${
                          star <= getAverageRating(product)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        } w-4 h-4`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviews?.length || 0})
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    ₹{typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </span>
                  <span className="text-sm text-gray-600">{product.shop.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* No Results Message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </ClientOnly>
  );
}