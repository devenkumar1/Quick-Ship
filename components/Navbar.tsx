'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="QuickShip Logo"
              width={40}
              height={40}
              className="w-10 h-10"
              priority
            />
            <span className="text-xl font-bold text-blue-600">QuickShip</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
              Categories
            </Link>
            <Link href="/deals" className="text-gray-600 hover:text-blue-600 transition-colors">
              Deals
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                title="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              title="Shopping Cart"
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
            >
              <FaShoppingCart className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
            <button 
              title="User Account"
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <FaUser className="text-xl" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            title={isMenuOpen ? "Close Menu" : "Open Menu"}
            className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              title="Search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            isMenuOpen ? 'block' : 'hidden'
          } py-4 border-t border-gray-200`}
        >
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/deals"
              className="text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Deals
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <button 
                title="Shopping Cart"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
              >
                <FaShoppingCart className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </button>
              <button 
                title="User Account"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <FaUser className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;