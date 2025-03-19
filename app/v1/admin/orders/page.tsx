'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaTruck, FaCheck, FaBan, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

interface Order {
  id: number;
  userId: string;
  userName: string;
  userEmail: string;
  productId: number;
  productName: string;
  shopName: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'ALL'>('ALL');

  // Load mock data - would be replaced with API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const statuses = Object.values(OrderStatus);
      const paymentStatuses = Object.values(PaymentStatus);
      
      const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        userId: `user-${Math.floor(Math.random() * 100) + 1}`,
        userName: `Customer ${Math.floor(Math.random() * 20) + 1}`,
        userEmail: `customer${Math.floor(Math.random() * 20) + 1}@example.com`,
        productId: Math.floor(Math.random() * 30) + 1,
        productName: `Product ${Math.floor(Math.random() * 30) + 1}`,
        shopName: `Shop ${Math.floor(Math.random() * 10) + 1}`,
        quantity: Math.floor(Math.random() * 5) + 1,
        amount: Math.floor(Math.random() * 20000) / 100 + 9.99,
        status: statuses[Math.floor(Math.random() * statuses.length)] as OrderStatus,
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)] as PaymentStatus,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString().split('T')[0],
      }));

      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter(
    (order) => {
      const matchesSearch = 
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm);
      
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'ALL' || order.paymentStatus === paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    }
  );

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const updateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
    // In a real app, this would call an API
    setOrders(
      orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case OrderStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case OrderStatus.SHIPPED:
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPaymentStatusBadgeClass = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case PaymentStatus.COMPLETED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case PaymentStatus.FAILED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case PaymentStatus.REFUNDED:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Order Management</h1>
        <p className="text-gray-600 dark:text-gray-300">View and manage all customer orders across the platform.</p>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(OrderStatus).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="paymentFilter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Status
            </label>
            <select
              id="paymentFilter"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | 'ALL')}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="ALL">All Payments</option>
              {Object.values(PaymentStatus).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="relative w-full lg:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders, products, customers..."
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 text-center">
              <div className="spinner"></div>
              <p className="text-gray-500 dark:text-gray-300 mt-4">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-500 dark:text-gray-300">No orders found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{order.userName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{order.productName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Qty: {order.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 font-semibold">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                      {order.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          aria-label={`View order ${order.id} details`}
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Order #{selectedOrder.id} Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Information</h4>
                  <div className="mt-2 space-y-3">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Order ID:</span> #{selectedOrder.id}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Date:</span> {selectedOrder.createdAt}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Total Amount:</span> {formatPrice(selectedOrder.amount)}
                    </p>
                    <div>
                      <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Order Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-sm text-gray-800 dark:text-gray-200">Payment Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPaymentStatusBadgeClass(selectedOrder.paymentStatus)}`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Customer Information</h4>
                  <div className="mt-2 space-y-3">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Name:</span> {selectedOrder.userName}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Email:</span> {selectedOrder.userEmail}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">User ID:</span> {selectedOrder.userId}
                    </p>
                  </div>

                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">Product Information</h4>
                  <div className="mt-2 space-y-3">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Product:</span> {selectedOrder.productName}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Shop:</span> {selectedOrder.shopName}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-medium">Quantity:</span> {selectedOrder.quantity}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Update Order Status */}
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Update Order Status</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.values(OrderStatus).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                      className={`px-3 py-1.5 text-xs rounded-md flex items-center 
                        ${selectedOrder.status === status 
                          ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'}`}
                    >
                      {status === OrderStatus.SHIPPED ? <FaTruck className="mr-1" /> :
                        status === OrderStatus.DELIVERED ? <FaCheck className="mr-1" /> :
                        status === OrderStatus.CANCELLED ? <FaBan className="mr-1" /> :
                        status === OrderStatus.PROCESSING ? <FaExclamationTriangle className="mr-1" /> : null}
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Close
                </button>
                <Link
                  href={`/v1/admin/orders/${selectedOrder.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for spinner */}
      <style jsx>{`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border-left-color: #3b82f6;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (prefers-color-scheme: dark) {
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-left-color: #3b82f6;
          }
        }
      `}</style>
    </div>
  );
} 