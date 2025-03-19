'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaEdit, FaHistory, FaHeart, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCreditCard } from 'react-icons/fa';

function ProfilePage() {
  // This would be replaced with actual user data from your auth system
  const [user, setUser] = useState({
    name: 'Mika Singh',
    email: 'xyz@example.com',
    phone: '+919999999999',
    address: '123 Food Street, Goa, India',
    avatarUrl: '/default-avatar.svg', // Updated to use the SVG we created
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 md:h-48"></div>
        <div className="px-6 py-4 md:flex md:items-center md:justify-between relative">
          <div className="md:flex md:items-center">
            {/* Avatar */}
            <div className="relative -mt-16 md:-mt-24 mb-4 md:mb-0 md:mr-6">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image 
                  src={user.avatarUrl}
                  alt={user.name} 
                  width={128} 
                  height={128}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition">
                <FaEdit className="text-sm" />
              </button>
            </div>
            
            {/* User info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <div className="flex items-center text-gray-500 mb-1">
                <FaEnvelope className="mr-2" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <FaPhone className="mr-2" />
                <span>{user.phone}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1">
          {/* Delivery Addresses */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Addresses</h2>
              
              <div className="border-b pb-4 mb-4">
                <div className="flex items-start mb-2">
                  <FaMapMarkerAlt className="text-blue-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Home</h3>
                    <p className="text-sm text-gray-600">{user.address}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="text-blue-600 text-sm hover:text-blue-800">Edit</button>
                </div>
              </div>
              
              <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                + Add New Address
              </button>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Methods</h2>
              
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center mb-2">
                  <FaCreditCard className="text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Visa ending in 4242</h3>
                    <p className="text-sm text-gray-600">Expires 12/25</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="text-blue-600 text-sm hover:text-blue-800">Edit</button>
                </div>
              </div>
              
              <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                + Add Payment Method
              </button>
            </div>
          </div>
        </div>
        
        {/* Right Column (2/3 width) */}
        <div className="md:col-span-2">
          {/* Order History */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                <Link href="/orders" className="text-blue-600 hover:text-blue-800 text-sm">
                  View All
                </Link>
              </div>
              
              {/* Sample Order */}
              <div className="border rounded-lg overflow-hidden mb-4">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Order #1234</span>
                      <h3 className="font-medium">Delicious Restaurant</h3>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Delivered</span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 overflow-hidden flex items-center justify-center">
                      <Image src="/burger.svg" alt="Burger" width={40} height={40} />
                    </div>
                    <div>
                      <p className="font-medium">1x Burger Deluxe</p>
                      <p className="text-sm text-gray-500">March 15, 2025 • ₹199</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Reorder</button>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Details</button>
                  </div>
                </div>
              </div>
              
              {/* Sample Order */}
              <div className="border rounded-lg overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Order #1233</span>
                      <h3 className="font-medium">Pizza Paradise</h3>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Delivered</span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 overflow-hidden flex items-center justify-center">
                      <Image src="/pizza.svg" alt="Pizza" width={40} height={40} />
                    </div>
                    <div>
                      <p className="font-medium">1x Margherita Pizza</p>
                      <p className="text-sm text-gray-500">March 10, 2025 • ₹199</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Reorder</button>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Favorites */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Favorite Items</h2>
                <Link href="/favorites" className="text-blue-600 hover:text-blue-800 text-sm">
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Favorite Item */}
                <div className="border rounded-lg p-4 flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 overflow-hidden flex items-center justify-center">
                    <Image src="/burger.svg" alt="Burger" width={48} height={48} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Spicy Chicken Burger</h3>
                    <p className="text-sm text-gray-500">Burger King</p>
                    <p className="text-sm font-medium mt-1">₹199</p>
                  </div>
                  <button className="p-2 text-red-500 hover:text-red-700">
                    <FaHeart />
                  </button>
                </div>
                
                {/* Favorite Item */}
                <div className="border rounded-lg p-4 flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 overflow-hidden flex items-center justify-center">
                    <Image src="/pizza.svg" alt="Pizza" width={48} height={48} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Pepperoni Pizza</h3>
                    <p className="text-sm text-gray-500">Pizza Hut</p>
                    <p className="text-sm font-medium mt-1">₹199</p>
                  </div>
                  <button className="p-2 text-red-500 hover:text-red-700">
                    <FaHeart />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
