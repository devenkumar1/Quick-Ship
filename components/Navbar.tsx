"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaHome,
  FaBoxOpen,
  FaListUl,
  FaInfoCircle,
  FaHeart,
  FaStore
} from "react-icons/fa";
import useCartStore from "@/store/cartStore";
import useUserStore from "@/store/userStore";
import { useSession } from "next-auth/react";

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 bg-white rounded-full p-1">
    <path d="M8 12L20 6L32 12L20 18L8 12Z" fill="#65a30d" />
    <path d="M8 12V28L20 34V18L8 12Z" fill="#4d7c0f" />
    <path d="M20 18V34L32 28V12L20 18Z" fill="#84cc16" />
    <path d="M34 16L36 15M34 20L37 19M34 24L36 23" stroke="#bef264" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Get cart items count from cart store
  const { getItemsCount } = useCartStore();
  const cartItemsCount = getItemsCount();
  
  // Get favorites count from user store
  const { favorites } = useUserStore();
  const favoritesCount = favorites.length;

  // Get session data
  const { data: session } = useSession();
  const isSeller = session?.user?.role === 'SELLER';

  return (
    <nav className="sticky top-0 z-50">
      <div className="bg-gradient-to-r from-lime-700 to-lime-600 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Logo />
              <span className="text-xl font-bold text-white mr-1 md:mr-3">QuickShip</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-white hover:text-lime-200 transition-colors flex items-center gap-1"
              >
                <FaHome className="text-lime-200" />
                <span>Home</span>
              </Link>
              <Link
                href="/Products"
                className="text-white hover:text-lime-200 transition-colors flex items-center gap-1"
              >
                <FaBoxOpen className="text-lime-200" />
                <span>Products</span>
              </Link>
              <Link
                href="/categories"
                className="text-white hover:text-lime-200 transition-colors flex items-center gap-1"
              >
                <FaListUl className="text-lime-200" />
                <span>Categories</span>
              </Link>
              <Link
                href="/my-orders"
                className="text-white hover:text-lime-200 transition-colors flex items-center gap-1"
              >
                <FaStore className="text-lime-200" />
                <span>My Orders</span>
              </Link>
              {isSeller && (
                <Link
                  href="/v1/seller/dashboard"
                  className="text-white hover:text-lime-200 transition-colors flex items-center gap-1"
                >
                  <FaStore className="text-lime-200" />
                  <span>Seller Dashboard</span>
                </Link>
              )}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-full border-2 border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500 bg-white/90 placeholder-gray-500"
                />
                <button
                  title="Search"
                  className="absolute right-0 top-0 h-full px-4 bg-lime-500 text-white rounded-r-full hover:bg-lime-600 transition-colors"
                >
                  <FaSearch />
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/wishlist"
                title="Wishlist"
                className="p-2 text-white hover:text-lime-200 transition-colors relative"
              >
                <FaHeart className="text-xl" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              
              <Link
                href="/cart"
                title="Shopping Cart"
                className="p-2 text-white hover:text-lime-200 transition-colors relative"
              >
                <FaShoppingCart className="text-xl" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              <Link
                href="/profile"
                title="User Account"
                className="p-2 text-white hover:text-lime-200 transition-colors"
              >
                <FaUser className="text-xl" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              title={isMenuOpen ? "Close Menu" : "Open Menu"}
              className="md:hidden p-2 text-white hover:text-lime-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden py-3 px-4 bg-lime-50">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-full border-2 border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
          />
          <button
            title="Search"
            className="absolute right-0 top-0 h-full px-4 bg-lime-500 text-white rounded-r-full hover:bg-lime-600 transition-colors"
          >
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${
          isMenuOpen ? "block" : "hidden"
        } bg-white shadow-lg`}
      >
        <div className="flex flex-col divide-y divide-lime-100">
          <Link
            href="/"
            className="px-4 py-3 hover:bg-lime-50 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaHome className="text-lime-600" />
            <span>Home</span>
          </Link>
          <Link
            href="/products"
            className="px-4 py-3 hover:bg-lime-50 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaBoxOpen className="text-lime-600" />
            <span>Products</span>
          </Link>
          <Link
            href="/categories"
            className="px-4 py-3 hover:bg-lime-50 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaListUl className="text-lime-600" />
            <span>Categories</span>
          </Link>
          <Link
            href="/about"
            className="px-4 py-3 hover:bg-lime-50 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaInfoCircle className="text-lime-600" />
            <span>About</span>
          </Link>
          {isSeller && (
            <Link
              href="v1/seller/dashboard"
              className="px-4 py-3 hover:bg-lime-50 flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaStore className="text-lime-600" />
              <span>Seller Dashboard</span>
            </Link>
          )}
          <Link
            href="/wishlist"
            className="px-4 py-3 hover:bg-lime-50 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaHeart className="text-lime-600" />
            <span>Wishlist</span>
            {favoritesCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {favoritesCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="px-4 py-3 hover:bg-lime-50 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaShoppingCart className="text-lime-600" />
            <span>Cart</span>
            {cartItemsCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            className="px-4 py-3 hover:bg-lime-50 flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaUser className="text-lime-600" />
            <span>Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
