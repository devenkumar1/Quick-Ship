'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaEdit, FaHeart, FaMapMarkerAlt, FaPhone, FaEnvelope, FaCreditCard, FaSpinner } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useUserStore from '@/store/userStore';

function ProfilePage() {
  // Wrap useSession in try-catch in case SessionProvider is not available
  let sessionStatus = 'loading';
  let sessionData = null;
  
  try {
    const { data: session, status } = useSession();
    sessionStatus = status;
    sessionData = session;
  } catch (error) {
    console.error("Error accessing session:", error);
    sessionStatus = 'unauthenticated';
  }
  
  const router = useRouter();
  
  // Get data and actions from Zustand store
  const { 
    user, 
    recentOrders, 
    favorites, 
    isLoading, 
    error, 
    fetchProfileData,
    removeFromFavorites
  } = useUserStore();

  // Fetch user profile data
  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetchProfileData();
    } else if (sessionStatus === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [sessionStatus, fetchProfileData, router]);

  // Handle removing favorites
  const handleRemoveFavorite = (productId: number) => {
    removeFromFavorites(productId);
    toast.success('Removed from favorites');
  };

  // Show loading state
  if (isLoading || sessionStatus === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-lime-600 text-4xl" />
      </div>
    );
  }

  // If not authenticated, this will redirect in the useEffect
  if (sessionStatus === 'unauthenticated') {
    return null;
  }

  // Show error message if there was an error
  if (error && !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
          <button 
            className="mt-4 bg-lime-600 text-white px-4 py-2 rounded-lg"
            onClick={() => fetchProfileData()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If we have no data yet but no error, show a loading state
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-lime-600 text-4xl" />
      </div>
    );
  }

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-lime-500 to-green-600 h-32 md:h-48"></div>
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
              <button 
                className="absolute bottom-1 right-1 bg-lime-600 text-white p-1.5 rounded-full hover:bg-lime-700 transition"
                aria-label="Edit profile picture"
                title="Edit profile picture"
              >
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
              {user.phone && (
                <div className="flex items-center text-gray-500">
                  <FaPhone className="mr-2" />
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-1">
          {/* Delivery Addresses - Placeholder for future feature */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Addresses</h2>
              
              <div className="border-b pb-4 mb-4">
                <div className="flex items-start mb-2">
                  <FaMapMarkerAlt className="text-lime-600 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium">Home</h3>
                    <p className="text-sm text-gray-600">Add your home address</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="text-lime-600 text-sm hover:text-lime-800">Add</button>
                </div>
              </div>
              
              <button className="w-full py-2 px-4 border border-lime-600 text-lime-600 rounded-lg hover:bg-lime-50 transition">
                + Add New Address
              </button>
            </div>
          </div>
          
          {/* Payment Methods - Placeholder for future feature */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Methods</h2>
              
              <div className="border-b pb-4 mb-4">
                <div className="flex items-center mb-2">
                  <FaCreditCard className="text-lime-600 mr-3" />
                  <div>
                    <h3 className="font-medium">Add a payment method</h3>
                    <p className="text-sm text-gray-600">No payment methods saved yet</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="text-lime-600 text-sm hover:text-lime-800">Add</button>
                </div>
              </div>
              
              <button className="w-full py-2 px-4 border border-lime-600 text-lime-600 rounded-lg hover:bg-lime-50 transition">
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
                <Link href="/orders" className="text-lime-600 hover:text-lime-800 text-sm">
                  View All
                </Link>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="border rounded-lg p-6 text-center text-gray-500">
                  <p>You haven't placed any orders yet.</p>
                  <Link href="/" className="mt-4 inline-block text-lime-600 hover:text-lime-800">
                    Browse Products
                  </Link>
                </div>
              ) : (
                recentOrders.map(order => (
                  <div key={order.id} className="border rounded-lg overflow-hidden mb-4">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-gray-500">Order #{order.id}</span>
                          <h3 className="font-medium">{order.items[0]?.shopName || 'Store'}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                          order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 overflow-hidden flex items-center justify-center">
                          <Image 
                            src={order.items[0]?.image || '/default-product.svg'} 
                            alt={order.items[0]?.productName || 'Product'} 
                            width={40} 
                            height={40}
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {order.items[0]?.quantity}x {order.items[0]?.productName}
                            {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.date)} • ₹{order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-lime-600 hover:text-lime-800 text-sm">Reorder</button>
                        <Link href={`/orders/${order.id}`} className="text-lime-600 hover:text-lime-800 text-sm">
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Favorites */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Favorite Items</h2>
                <Link href="/favorites" className="text-lime-600 hover:text-lime-800 text-sm">
                  View All
                </Link>
              </div>
              
              {favorites.length === 0 ? (
                <div className="border rounded-lg p-6 text-center text-gray-500">
                  <p>You don't have any favorite items yet.</p>
                  <Link href="/" className="mt-4 inline-block text-lime-600 hover:text-lime-800">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favorites.map(item => (
                    <div key={item.id} className="border rounded-lg p-4 flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 overflow-hidden flex items-center justify-center">
                        <Image 
                          src={item.image} 
                          alt={item.name} 
                          width={48} 
                          height={48} 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.shopName}</p>
                      </div>
                      <button 
                        className="p-2 text-red-500 hover:text-red-700"
                        aria-label={`Remove ${item.name} from favorites`}
                        title={`Remove ${item.name} from favorites`}
                        onClick={() => handleRemoveFavorite(item.id)}
                      >
                        <FaHeart />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
