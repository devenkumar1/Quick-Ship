'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaBox, 
  FaUsers, 
  FaShoppingCart, 
  FaSignOutAlt, 
  FaStore,
  FaBars,
  FaTimes,
  FaChartBar
} from 'react-icons/fa';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const NavItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
    const isActive = pathname === href;
    
    return (
      <Link 
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        {icon}
        <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-md transition-all duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-6 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <FaStore />
            </div>
            <h1 className={`font-bold text-xl ${sidebarOpen ? 'block' : 'hidden'}`}>Admin Panel</h1>
          </div>
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavItem href="/admin" icon={<FaHome />} label="Dashboard" />
          <NavItem href="/admin/products" icon={<FaBox />} label="Products" />
          <NavItem href="/admin/users" icon={<FaUsers />} label="Users" />
          <NavItem href="/admin/orders" icon={<FaShoppingCart />} label="Orders" />
          <NavItem href="/admin/sellers" icon={<FaStore />} label="Sellers" />
          <NavItem href="/admin/analytics" icon={<FaChartBar />} label="Analytics" />
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FaSignOutAlt />
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Log Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
} 