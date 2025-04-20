'use client';
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/ProductCard";
import useProductStore from "@/store/productStore";
import Footer from "@/components/Footer";
import { ClientOnly, SkeletonProductCard } from "@/app/components/skeletons/Skeleton";

export default function Home() {
  const { 
    products, 
    isLoading, 
    error, 
    fetchProducts,
    filterProductsByCategory 
  } = useProductStore();

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get latest 4 products
  const latestProducts = products.slice(0, 4);

  // Get category-specific products
  const foodProducts = filterProductsByCategory('Food').slice(0, 4);
  const stationeryProducts = filterProductsByCategory('Stationery').slice(0, 4);
  const clothingProducts = filterProductsByCategory('Clothing').slice(0, 4);

  // Skeleton loader for products sections
  const renderProductSkeletons = (count = 4) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(count).fill(0).map((_, index) => (
        <SkeletonProductCard key={index} />
      ))}
    </div>
  );

  return (
    <ClientOnly>
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

        {/* Latest Products Section */}
        <section className="py-16 bg-white">
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Use our new skeleton component
                renderProductSkeletons()
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
              ) : latestProducts.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No products available at the moment.</p>
                </div>
              ) : (
                latestProducts.map(product => (
                  <div key={product.id} className="h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Food Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Food & Beverages</h2>
                <p className="text-gray-600 mt-2">Delicious treats and refreshments</p>
              </div>
              <Link href="/Products?category=Food" className="text-lime-700 flex items-center hover:text-lime-800 font-medium">
                View All <FaChevronRight className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                renderProductSkeletons()
              ) : foodProducts.map(product => (
                <div key={product.id} className="h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stationery Products Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Stationery</h2>
                <p className="text-gray-600 mt-2">Essential supplies for your studies</p>
              </div>
              <Link href="/Products?category=Stationery" className="text-lime-700 flex items-center hover:text-lime-800 font-medium">
                View All <FaChevronRight className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                renderProductSkeletons()
              ) : stationeryProducts.map(product => (
                <div key={product.id} className="h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clothing Products Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Clothing</h2>
                <p className="text-gray-600 mt-2">Trendy fashion for every style</p>
              </div>
              <Link href="/Products?category=Clothing" className="text-lime-700 flex items-center hover:text-lime-800 font-medium">
                View All <FaChevronRight className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                renderProductSkeletons()
              ) : clothingProducts.map(product => (
                <div key={product.id} className="h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </ClientOnly>
  );
}
