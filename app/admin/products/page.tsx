'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaSort } from 'react-icons/fa';

// Define the Product type based on our Prisma schema
type Product = {
  id: number;
  name: string;
  price: number | string;
  shopId: number;
  shop: {
    name: string;
  };
  reviews: Array<{
    rating: number;
  }>;
  createdAt: string;
  updatedAt: string;
  image?: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  // Fetch products from API
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
          const productsWithImages = data.products.map((product: Product) => ({
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
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[sortField as keyof Product];
    let bValue = b[sortField as keyof Product];
    
    // Handle nested fields like shop.name
    if (sortField === 'shop.name') {
      aValue = a.shop.name;
      bValue = b.shop.name;
    }
    
    // Handle calculating average rating
    if (sortField === 'rating') {
      aValue = a.reviews.length > 0 
        ? a.reviews.reduce((sum, review) => sum + review.rating, 0) / a.reviews.length
        : 0;
      bValue = b.reviews.length > 0 
        ? b.reviews.reduce((sum, review) => sum + review.rating, 0) / b.reviews.length
        : 0;
    }
    
    // Handle date fields
    if (sortField === 'createdAt' || sortField === 'updatedAt') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }
    
    // Compare values
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Toggle sort direction
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Open add product modal
  const handleAddProduct = () => {
    setShowAddModal(true);
  };
  
  // Open edit product modal
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };
  
  // Open delete confirmation
  const handleDeleteProduct = (product: Product) => {
    setCurrentProduct(product);
    setShowDeleteConfirmation(true);
  };
  
  // Calculate average rating
  const getAverageRating = (reviews: Array<{ rating: number }>) => {
    if (!reviews || reviews.length === 0) return 0;
    return (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 max-w-md text-center">
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus /> Add Product
        </button>
      </header>
      
      {/* Search and filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <select
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="food">Food</option>
                <option value="beverages">Beverages</option>
                <option value="snacks">Snacks</option>
              </select>
              <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            <div className="relative">
              <select
                value={`${sortField}-${sortDirection}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-');
                  setSortField(field);
                  setSortDirection(direction as 'asc' | 'desc');
                }}
                className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
              <FaSort className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Products table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1"
                  >
                    Product
                    {sortField === 'name' && (
                      <FaSort className="text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('shop.name')}
                    className="flex items-center gap-1"
                  >
                    Shop
                    {sortField === 'shop.name' && (
                      <FaSort className="text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('price')}
                    className="flex items-center gap-1"
                  >
                    Price
                    {sortField === 'price' && (
                      <FaSort className="text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('rating')}
                    className="flex items-center gap-1"
                  >
                    Rating
                    {sortField === 'rating' && (
                      <FaSort className="text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-1"
                  >
                    Created
                    {sortField === 'createdAt' && (
                      <FaSort className="text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No products found. Try adjusting your search criteria.
                  </td>
                </tr>
              ) : (
                sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded overflow-hidden">
                          <Image 
                            src={product.image || "https://via.placeholder.com/40"} 
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.shop.name}</div>
                      <div className="text-xs text-gray-500">Shop ID: {product.shopId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹ {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">
                          {getAverageRating(product.reviews)} ({product.reviews.length})
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">{products.length}</span> products
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  &laquo;
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-700"
                >
                  2
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  3
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  &raquo;
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add/Edit Product Modal would go here */}
      {/* Delete Confirmation Modal would go here */}
    </div>
  );
} 