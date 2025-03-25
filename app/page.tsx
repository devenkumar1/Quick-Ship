'use client';
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/ProductCard";
import useProductStore from "@/store/productStore";

export default function Home() {
  // Use product store instead of local state
  const { 
    products, 
    featuredProducts, 
    isLoading, 
    error, 
    fetchProducts 
  } = useProductStore();

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className="min-h-screen bg-gray-50">
      <br />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src="/FoodTable2.jpg" 
            alt="Food Table" 
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="ml-210 max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Fresh Food Delivered<br />Right To Your Door
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-xl">
              Discover amazing products from trusted sellers around the LPU Campus, Exceptional service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/Products" className="bg-lime-700 hover:bg-lime-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 text-lg">
                Order Now
              </Link>
              <Link href="/categories" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-medium transition-all duration-300 text-lg">
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Browse our wide selection of products across various categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Categories would be dynamically generated from API */}
            {['Food', 'Electronics', 'Clothing', 'Books', 'Home', 'Beauty'].map((category, index) => (
              <Link href={`/categories/${category.toLowerCase()}`} key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center group">
                <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-lime-200 transition-colors">
                  <span className="text-lime-700 text-xl">
                    {category.charAt(0)}
                  </span>
                </div>
                <h3 className="font-medium text-gray-800 group-hover:text-lime-700 transition-colors">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
              <p className="text-gray-600 mt-2">Explore our most popular items</p>
            </div>
            <Link href="/Products" className="text-lime-700 flex items-center hover:text-lime-800 font-medium">
              View All <FaChevronRight className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse bg-gray-100 rounded-xl h-80"></div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={() => fetchProducts()} 
                  className="mt-2 bg-lime-600 text-white px-6 py-2 rounded-lg hover:bg-lime-700 transition-all hover:shadow-lg"
                >
                  Try Again
                </button>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No products available at the moment.</p>
              </div>
            ) : (
              // Display featured products
              featuredProducts.map(product => (
                <div key={product.id} className="h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Latest Products</h2>
              <p className="text-gray-600 mt-2">Fresh arrivals just for you</p>
            </div>
            <Link href="/Products" className="text-lime-700 flex items-center hover:text-lime-800 font-medium">
              View All <FaChevronRight className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse bg-gray-100 rounded-xl h-64"></div>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={() => fetchProducts()} 
                  className="mt-2 bg-lime-600 text-white px-6 py-2 rounded-lg hover:bg-lime-700 transition-all hover:shadow-lg"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No products available at the moment.</p>
              </div>
            ) : (
              // Display the first 8 latest products
              products.slice(0, 8).map(product => (
                <div key={product.id} className="h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-100 text-black">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-gray-900 mb-8 text-lg">
              Subscribe to our newsletter for the latest products and exclusive deals
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-2 border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-300 text-gray-800"
              />
              <button className="bg-white text-lime-700 px-6 py-3 rounded-lg transition-colors duration-300 font-medium hover:bg-lime-400">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">About QuickShip</h3>
              <p className="text-gray-400">
                Your trusted destination for quality products and fast delivery. We connect you with the best sellers worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/Products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lime-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  support@quickship.com
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lime-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  (555) 123-4567
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lime-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  123 Commerce St, City, State
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-400">
            © 2025 QuickShip. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
