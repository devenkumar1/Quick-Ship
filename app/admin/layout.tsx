'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  FaChartBar,
  FaCog
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
            ? 'bg-lime-700 text-white' 
            : 'text-gray-600 hover:bg-lime-50 hover:text-lime-700'
        }`}
      >
        <div className={isActive ? 'text-white' : 'text-lime-600'}>
          {icon}
        </div>
        <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-lime-700 to-lime-600 text-white p-2 rounded-lg">
              <FaStore />
            </div>
            <h1 className={`font-bold text-xl text-gray-800 ${sidebarOpen ? 'block' : 'hidden'}`}>Admin Panel</h1>
          </div>
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-lime-700"
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
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-lime-50 hover:text-lime-700 transition-colors mb-2"
          >
            <FaCog className="text-lime-600" />
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Settings</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <FaSignOutAlt className="text-red-500" />
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Log Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {pathname.split('/').pop() === 'admin' 
                ? 'Dashboard' 
                : pathname.split('/').pop() 
                  ? pathname.split('/').pop()!.charAt(0).toUpperCase() + pathname.split('/').pop()!.slice(1)
                  : 'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center text-lime-700 hover:bg-lime-200 transition-colors">
                  <span className="text-xs absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">3</span>
                  <FaShoppingCart />
                </button>
              </div>
              <div className="h-10 w-10 rounded-full bg-lime-700 text-white flex items-center justify-center font-bold">
                A
              </div>
            </div>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 