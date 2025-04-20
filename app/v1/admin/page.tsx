'use client';
import React, { useEffect, useState } from 'react';
import { FaUsers, FaStore, FaShoppingCart, FaBoxes, FaDollarSign, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import { MdSell } from 'react-icons/md';
import axios from 'axios';

interface DashboardStats {
  users: number;
  sellers: number;
  shops: number;
  products: number;
  orders: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: string;
}

interface SellerRequest {
  id: string;
  email: string;
  requestedAt: string;
}

export default function AdminHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [sellerRequests, setSellerRequests] = useState<SellerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiMissing, setApiMissing] = useState(false);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Fetch statistics data
        const statsResponse = await axios.get<DashboardStats>('/api/admin/dashboard/stats');
        
        if (statsResponse.data) {
          setStats(statsResponse.data);
        }
        
        // Fetch recent orders
        const ordersResponse = await axios.get<{orders: RecentOrder[]}>('/api/admin/dashboard/recent-orders');
        
        if (ordersResponse.data && ordersResponse.data.orders) {
          setRecentOrders(ordersResponse.data.orders);
        }
        
        // Fetch pending seller requests - get from seller-applications instead of seller-requests
        const requestsResponse = await axios.get<{applications: Array<{
          id: string;
          status: string;
          createdAt: string;
          user: {
            id: string;
            name: string;
            email: string;
          };
        }>}>('/api/admin/seller-applications');
        
        if (requestsResponse.data && requestsResponse.data.applications) {
          // Map applications to sellerRequests format
          const pendingApplications = requestsResponse.data.applications
            .filter(app => app.status === 'PENDING')
            .map(app => ({
              id: app.id,
              email: app.user.email,
              requestedAt: new Date(app.createdAt).toLocaleDateString()
            }));
          setSellerRequests(pendingApplications);
        }
        
        setApiMissing(false);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        
        // Check if the error is due to missing API endpoints (404)
        if (err.response && err.response.status === 404) {
          setApiMissing(true);
          
          // Try fetching only seller applications without setting mock data
          try {
            const applicationsResponse = await axios.get<{applications: Array<{
              id: string;
              status: string;
              createdAt: string;
              user: {
                id: string;
                name: string;
                email: string;
              };
            }>}>('/api/admin/seller-applications');
            
            if (applicationsResponse.data && applicationsResponse.data.applications) {
              // Map applications to sellerRequests format
              const pendingApplications = applicationsResponse.data.applications
                .filter(app => app.status === 'PENDING')
                .map(app => ({
                  id: app.id,
                  email: app.user.email,
                  requestedAt: new Date(app.createdAt).toLocaleDateString()
                }));
              setSellerRequests(pendingApplications);
            }

            // For other dashboard data, we still need some defaults
            setStats({
              users: 0,
              sellers: 0,
              shops: 0,
              products: 0,
              orders: 0,
              revenue: 0
            } as DashboardStats);
            
            setRecentOrders([]);
          } catch (appError) {
            console.error('Error fetching seller applications:', appError);
            setSellerRequests([]);
          }
        } else {
          setError('Failed to fetch dashboard data. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format currency in Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-600';
      case 'SHIPPED':
        return 'text-blue-600';
      case 'PROCESSING':
        return 'text-yellow-600';
      case 'PENDING':
        return 'text-orange-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto">
      {error && (
        <div className={`mb-6 p-4 rounded-md ${apiMissing ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {apiMissing && <FaExclamationTriangle className="inline mr-2" />}
          {error}
        </div>
      )}

      {apiMissing && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md">
          <h3 className="font-bold text-lg mb-2">Backend API Implementation Required</h3>
          <p>The following API endpoints need to be implemented:</p>
          <ul className="list-disc pl-5 mt-2">
            <li><code>/api/admin/dashboard/stats</code> - To provide dashboard statistics</li>
            <li><code>/api/admin/dashboard/recent-orders</code> - To provide recent orders</li>
            <li><code>/api/admin/dashboard/seller-requests</code> - To provide pending seller requests</li>
            <li><code>/api/admin/sellers</code> - To manage seller accounts</li>
            <li><code>/api/admin/users</code> - To manage user accounts</li>
            <li><code>/api/admin/shops</code> - To manage shops</li>
            <li><code>/api/admin/products</code> - To manage products</li>
          </ul>
          <p className="mt-2">Currently showing mock data for demonstration purposes.</p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Welcome back, Admin. Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
            <FaUsers className="text-blue-500 dark:text-blue-300 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isLoading ? (
                <span className="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></span>
              ) : (
                stats?.users
              )}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-3 mr-4">
            <FaStore className="text-yellow-500 dark:text-yellow-300 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Verified Sellers</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isLoading ? (
                <span className="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></span>
              ) : (
                stats?.sellers
              )}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
            <MdSell className="text-green-500 dark:text-green-300 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Total Shops</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isLoading ? (
                <span className="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></span>
              ) : (
                stats?.shops
              )}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mr-4">
            <FaShoppingCart className="text-purple-500 dark:text-purple-300 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Total Products</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isLoading ? (
                <span className="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></span>
              ) : (
                stats?.products
              )}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-3 mr-4">
            <FaShoppingCart className="text-pink-500 dark:text-pink-300 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isLoading ? (
                <span className="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></span>
              ) : (
                stats?.orders
              )}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-3 mr-4">
            <FaDollarSign className="text-indigo-500 dark:text-indigo-300 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isLoading ? (
                <span className="inline-block w-12 h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></span>
              ) : (
                formatCurrency(stats?.revenue || 0)
              )}
            </h3>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Recent Orders</h3>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between py-3">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead>
                    <tr>
                      <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider pb-3">Order ID</th>
                      <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider pb-3">Customer</th>
                      <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider pb-3">Amount</th>
                      <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="py-3 whitespace-nowrap text-sm text-gray-800 dark:text-white">#{order.id.slice(0, 8)}</td>
                        <td className="py-3 whitespace-nowrap text-sm text-gray-800 dark:text-white">{order.customerName}</td>
                        <td className="py-3 whitespace-nowrap text-sm text-gray-800 dark:text-white">{formatCurrency(order.amount)}</td>
                        <td className="py-3 whitespace-nowrap">
                          <span className={`${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4">
              <a href="/v1/admin/orders" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all orders →</a>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">New Seller Requests</h3>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex items-center justify-between py-3">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4"></div>
                    </div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                  </div>
                ))}
              </div>
            ) : sellerRequests.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No pending seller requests.</p>
            ) : (
              <div className="space-y-4">
                {sellerRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between bg-gray-50 p-4 rounded">
                    <div>
                      <p className="font-medium">{request.email}</p>
                      <p className="text-sm text-gray-500">Requested {request.requestedAt}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-green-100 text-green-600 hover:bg-green-200 px-4 py-2 rounded text-sm font-medium">
                        Approve
                      </button>
                      <button className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded text-sm font-medium">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <a href="/v1/admin/seller-applications" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all applications →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}