import { useState, useEffect } from 'react';
import { FaCheck, FaTruck, FaSpinner, FaRupeeSign } from 'react-icons/fa';
import axios from 'axios';
import LoadingSpinner from '@/app/components/LoadingSpinner';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  quantity: number;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [ordersRes, statsRes] = await Promise.all([
        axios.get('/api/seller/orders'),
        axios.get('/api/seller/dashboard/stats')
      ]);
      
      setOrders(ordersRes.data.orders);
      setStats({
        totalRevenue: statsRes.data.revenue,
        pendingPayments: statsRes.data.pendingPayments
      });
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaRupeeSign className="text-green-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FaRupeeSign className="text-yellow-500 text-3xl mr-4" />
            <div>
              <p className="text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold">₹{stats.pendingPayments.toLocaleString()}</p>
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
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{order.productName}</p>
                      <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
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
                      <p className="font-medium">₹{order.amount.toLocaleString()}</p>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 