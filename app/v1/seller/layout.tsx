'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBox, FaShoppingCart, FaRupeeSign, FaChartLine } from 'react-icons/fa';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Seller Dashboard</h2>
        </div>
        <nav className="mt-4">
          <Link 
            href="/v1/seller/dashboard"
            className={`flex items-center px-4 py-3 text-lg hover:bg-blue-700 ${isActive('/v1/seller/dashboard')}`}
          >
            <FaHome className="mr-3" />
            Dashboard
          </Link>
          <Link 
            href="/v1/seller/products"
            className={`flex items-center px-4 py-3 text-lg hover:bg-blue-700 ${isActive('/v1/seller/products')}`}
          >
            <FaBox className="mr-3" />
            Products
          </Link>
          <Link 
            href="/v1/seller/orders"
            className={`flex items-center px-4 py-3 text-lg hover:bg-blue-700 ${isActive('/v1/seller/orders')}`}
          >
            <FaShoppingCart className="mr-3" />
            Orders
          </Link>
          <Link 
            href="/v1/seller/earnings"
            className={`flex items-center px-4 py-3 text-lg hover:bg-blue-700 ${isActive('/v1/seller/earnings')}`}
          >
            <FaRupeeSign className="mr-3" />
            Earnings
          </Link>
          <Link 
            href="/v1/seller/analytics"
            className={`flex items-center px-4 py-3 text-lg hover:bg-blue-700 ${isActive('/v1/seller/analytics')}`}
          >
            <FaChartLine className="mr-3" />
            Analytics
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
} 