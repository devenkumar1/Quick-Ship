'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaHome, FaBox, FaShoppingCart, FaRupeeSign, FaChartLine, FaSignOutAlt, FaCog } from 'react-icons/fa';
import SellerGuard from "@/components/SellerGuard";

export default function V1SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-lime-700 text-white' : '';
  };

  return (
    <SellerGuard>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-lime-700 to-lime-800 text-white shadow-lg">
          <div className="p-6 border-b border-lime-600">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Logo" width={36} height={36} className="bg-white rounded-full p-1" />
              <h2 className="text-xl font-bold">Seller Dashboard</h2>
            </div>
          </div>
          <nav className="mt-6">
            <Link 
              href="/v1/seller/dashboard"
              className={`flex items-center px-6 py-3.5 text-lime-100 hover:bg-lime-700 hover:text-white transition-colors ${isActive('/v1/seller/dashboard')}`}
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
            <Link 
              href="/v1/seller/products"
              className={`flex items-center px-6 py-3.5 text-lime-100 hover:bg-lime-700 hover:text-white transition-colors ${isActive('/v1/seller/products')}`}
            >
              <FaBox className="mr-3" />
              Products
            </Link>
            <Link 
              href="/v1/seller/orders"
              className={`flex items-center px-6 py-3.5 text-lime-100 hover:bg-lime-700 hover:text-white transition-colors ${isActive('/v1/seller/orders')}`}
            >
              <FaShoppingCart className="mr-3" />
              Orders
            </Link>
            <Link 
              href="/v1/seller/earnings"
              className={`flex items-center px-6 py-3.5 text-lime-100 hover:bg-lime-700 hover:text-white transition-colors ${isActive('/v1/seller/earnings')}`}
            >
              <FaRupeeSign className="mr-3" />
              Earnings
            </Link>
            <Link 
              href="/v1/seller/analytics"
              className={`flex items-center px-6 py-3.5 text-lime-100 hover:bg-lime-700 hover:text-white transition-colors ${isActive('/v1/seller/analytics')}`}
            >
              <FaChartLine className="mr-3" />
              Analytics
            </Link>
            
            <div className="mt-auto pt-8 px-4 border-t border-lime-600 mt-8">
              <Link 
                href="/v1/seller/settings"
                className="flex items-center px-2 py-3 text-lime-100 hover:text-white transition-colors"
              >
                <FaCog className="mr-3" />
                Settings
              </Link>
              <Link 
                href="/logout"
                className="flex items-center px-2 py-3 text-lime-100 hover:text-white transition-colors"
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </Link>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm py-4 px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">
                {pathname.split('/').pop() ? 
                  pathname.split('/').pop()!.charAt(0).toUpperCase() + pathname.split('/').pop()!.slice(1) : 
                  'Dashboard'
                }
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Welcome, Seller</span>
                <div className="h-8 w-8 rounded-full bg-lime-600 text-white flex items-center justify-center">
                  S
                </div>
              </div>
            </div>
          </header>
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </SellerGuard>
  );
} 