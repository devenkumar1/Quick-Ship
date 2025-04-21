'use client';
import React, { useEffect, useMemo } from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from "next/link";
import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import ProductCard from "@/components/ProductCard";
import useProductStore from "@/store/productStore";
import Footer from "@/components/Footer";
import { ClientOnly, SkeletonProductCard } from "@/app/components/skeletons/Skeleton";

export default function Home() {
  const { products, isLoading, error, fetchProducts, filterProductsByCategory } = useProductStore();
  // Hero images for carousel
  const heroImages = [
    'https://images.pexels.com/photos/6214155/pexels-photo-6214155.jpeg',
    'https://images.pexels.com/photos/262918/pexels-photo-262918.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  ];

  // Dynamic categories
  const categories = useMemo(
    () => Array.from(new Set(products.map(p => p.category).filter((c): c is string => !!c))),
    [products]
  );
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get latest 4 products
  const latestProducts = products.slice(0, 4);

  // Skeleton loader for products sections
  const renderProductSkeletons = (count = 4) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className="w-full h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
          <SkeletonProductCard />
        </div>
      ))}
    </div>
  );

  return (
    <ClientOnly>
      <main className="min-h-screen bg-gray-50">
        <br />
        
        {/* Hero Carousel */}

        <div className="relative h-[60vh] flex items-center justify-center">
  {/* Background Layer */}
  <div
    className="absolute inset-0 bg-no-repeat bg-center bg-cover"
    style={{
      backgroundImage: 'url("https://images.pexels.com/photos/1100059/pexels-photo-1100059.jpeg")',
      filter: 'brightness(0.5)',
      zIndex: 0,
    }}
  ></div>

  {/* Content Layer */}
  <div className="relative z-10 text-center text-white max-w-3xl px-4">
    <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-[0_0_0.75rem_rgba(255,255,255,0.8)]">
      Your orders Delivered<br />Right To Your Door
    </h1>
    <p className="text-xl mb-8 drop-shadow-[0_0_0.5rem_rgba(255,255,255,0.7)]">
      Discover amazing products from trusted sellers around the LPU Campus.
    </p>
    <div className="flex flex-wrap gap-4 justify-center">
      <Link
        href="/Products"
        className="bg-lime-700 hover:bg-lime-600 text-white px-8 py-3 rounded-lg font-medium transition-all"
      >
        Order Now
      </Link>
      <Link
        href="/categories"
        className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-medium transition-all"
      >
        Browse Categories
      </Link>
    </div>
  </div>
</div>


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
            {isLoading ? (
              // Show skeleton grid
              renderProductSkeletons()
            ) : error ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="col-span-full text-center py-8">
                  <p className="text-red-500">{error}</p>
                  <button onClick={() => fetchProducts()} className="mt-2 bg-lime-600 text-white px-6 py-2 rounded-lg hover:bg-lime-700 transition-all hover:shadow-lg">
                    Try Again
                  </button>
                </div>
              </div>
            ) : latestProducts.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No products available at the moment.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestProducts.map(product => (
                  <div key={product.id} className="h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Categories Overview */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Categories</h2>
            <div className="flex overflow-x-auto space-x-4">
              {categories.map(cat => (
                <Link key={cat} href={`/Products?category=${cat}`} className="min-w-[150px] bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                  <span className="text-lg font-medium text-gray-800">{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Category Sections */}
        {categories.map(category => {
          const items = filterProductsByCategory(category).slice(0, 4);
          return (
            <section key={category} className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="flex flex-wrap items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{category}</h2>
                    <p className="text-gray-600 mt-2 capitalize">{category} items</p>
                  </div>
                  <Link href={`/Products?category=${category}`} className="text-lime-700 flex items-center hover:text-lime-800 font-medium">
                    View All <FaChevronRight className="ml-2" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {isLoading
                    ? renderProductSkeletons()
                    : items.map(product => (
                        <div key={product.id} className="h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                          <ProductCard product={product} />
                        </div>
                      ))}
                </div>
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </ClientOnly>
  );
}
