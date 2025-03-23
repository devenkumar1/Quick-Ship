'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CategoriesDiv from "@/components/CategoriesDiv";
import ProductCard from "@/components/ProductCard";

// Define Product type based on our Prisma schema
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          
          // Sort by createdAt date (newest first)
          const sortedProducts = productsWithImages.sort((a: Product, b: Product) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          
          setProducts(sortedProducts);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

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
                Explore Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gradient-to-br from-lime-50 to-lime-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-lime-800 mb-3">Browse Categories</h2>
            <p className="text-lime-700 text-lg max-w-2xl mx-auto">Explore our wide range of products by category</p>
            <div className="w-20 h-1 bg-gradient-to-r from-lime-600 to-lime-400 mx-auto mt-4"></div>
          </div>
          <CategoriesDiv />
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-white to-lime-50 rounded-xl shadow-md my-12">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 relative inline-block">
              Latest Products
              <span className="absolute -bottom-2 left-0 w-2/3 h-1 bg-lime-500 rounded-full"></span>
            </h2>
            <p className="text-gray-600 mt-3 text-lg">Fresh from our partners</p>
          </div>
          <Link 
            href="/Products" 
            className="text-lime-700 hover:text-lime-800 font-medium text-lg flex items-center gap-1 group relative overflow-hidden py-2 px-4 rounded-lg transition-all duration-300 border border-lime-500 hover:bg-lime-100"
          >
            <span>View All</span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime-500 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-8">
          {loading ? (
            // Loading skeleton
            [...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse transform transition-transform duration-300 hover:-translate-y-1">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded mt-3"></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
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
            // Display the first 10 latest products
            products.slice(0, 10).map(product => (
              <div key={product.id} className="h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                <ProductCard product={product} />
              </div>
            ))
          )}
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
