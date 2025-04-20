'use client'
import { useState, useEffect } from 'react';
import { FaCheck, FaTruck, FaSpinner, FaRupeeSign, FaCalendarDay } from 'react-icons/fa';
import axios from 'axios';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { formatCurrency } from '@/utils/format';

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  products: Product[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface DashboardStats {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
  };
}

interface TodayStats {
  stats: {
    todaysEarnings: number;
    totalOrders: number;
  };
  orders: Order[];
}

export default function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [dateFilter, setDateFilter] = useState<'all' | 'today'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      applyFilters();
    }
  }, [orders, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [ordersRes, statsRes, todayStatsRes] = await Promise.all([
        axios.get('/api/seller/orders'),
        axios.get('/api/seller/dashboard/stats'),
        axios.get('/api/seller/dashboard/today-stats')
      ]);
      
      const receivedOrders = ordersRes.data.orders;
      setOrders(receivedOrders);
      setFilteredOrders(receivedOrders);
      setStats(statsRes.data);
      setTodayStats(todayStatsRes.data);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.put('/api/seller/orders', {
        orderId,
        status
      });
      fetchOrders(); // Refresh orders after update
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const applyFilters = () => {
    if (dateFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const filtered = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= today;
      });
      
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };
  
  const handleFilterChange = (filter: 'all' | 'today') => {
    setDateFilter(filter);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders Management</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleFilterChange('all')} 
            className={`px-4 py-2 rounded-md ${dateFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            All Orders
          </button>
          <button 
            onClick={() => handleFilterChange('today')} 
            className={`px-4 py-2 rounded-md ${dateFilter === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Today's Orders
          </button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaRupeeSign className="text-green-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">{stats ? formatCurrency(stats.stats.totalRevenue) : '₹0.00'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaRupeeSign className="text-yellow-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats ? stats.stats.totalOrders : 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaCalendarDay className="text-blue-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Today's Earnings</p>
              <p className="text-2xl font-bold">{todayStats ? formatCurrency(todayStats.stats.todaysEarnings) : '₹0.00'}</p>
              <p className="text-sm text-gray-500">{todayStats ? `${todayStats.stats.totalOrders} orders today` : '0 orders today'}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">
                      {order.products.map((product, idx) => (
                        <div key={idx}>
                          {product.quantity}x {product.name}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{order.customerEmail}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
                    <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 
                      ${order.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                      className="bg-yellow-500 text-white p-2 rounded"
                      disabled={order.status !== 'PENDING'}
                      aria-label="Mark order as processing"
                    >
                      <FaSpinner />
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                      className="bg-blue-500 text-white p-2 rounded"
                      disabled={order.status !== 'PROCESSING'}
                      aria-label="Mark order as shipped"
                    >
                      <FaTruck />
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                      className="bg-green-500 text-white p-2 rounded"
                      disabled={order.status !== 'SHIPPED'}
                      aria-label="Mark order as completed"
                    >
                      <FaCheck />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                  {dateFilter === 'today' ? 'No orders found for today.' : 'No orders found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 