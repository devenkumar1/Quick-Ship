import React from 'react'
import Link from 'next/link'
import { FaUsers, FaStore, FaShoppingCart, FaBoxes, FaChartLine, FaUserCog } from 'react-icons/fa'

function AdminLayout() {
  return (
    <div className="bg-gray-900 text-white h-screen w-64 fixed left-0 top-0 shadow-lg">
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-2xl font-bold">QuickShip Admin</h2>
        <p className="text-gray-400 text-sm">Management Dashboard</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-3">
          <li>
            <Link href="/v1/admin" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 transition-all">
              <FaChartLine className="text-blue-400" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/v1/admin/users" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 transition-all">
              <FaUsers className="text-green-400" />
              <span>User Management</span>
            </Link>
          </li>
          <li>
            <Link href="/v1/admin/sellers" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 transition-all">
              <FaUserCog className="text-yellow-400" />
              <span>Seller Management</span>
            </Link>
          </li>
          <li>
            <Link href="/v1/admin/shops" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 transition-all">
              <FaStore className="text-purple-400" />
              <span>Shop Management</span>
            </Link>
          </li>
          <li>
            <Link href="/v1/admin/products" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 transition-all">
              <FaBoxes className="text-pink-400" />
              <span>Products</span>
            </Link>
          </li>
          <li>
            <Link href="/v1/admin/orders" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 transition-all">
              <FaShoppingCart className="text-orange-400" />
              <span>Orders</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="font-bold">A</span>
          </div>
          <div>
            <p className="font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@quickship.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout