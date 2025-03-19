'use client';

import React, { useState, useEffect } from 'react';
import { FaBox, FaUsers, FaShoppingCart, FaStore, FaExclamationTriangle } from 'react-icons/fa';

// Dashboard stat card component
const StatCard = ({ 
  icon, 
  title, 
  value, 
  trend, 
  backgroundColor 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string | number; 
  trend: string; 
  backgroundColor: string;
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between">
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <span className={`text-xs ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {trend} from last month
        </span>
      </div>
      <div className={`${backgroundColor} p-3 rounded-lg`}>
        {icon}
      </div>
    </div>
  );
};

// Recent activity item component
const ActivityItem = ({ 
  title, 
  description, 
  time, 
  status = 'normal'
}: { 
  title: string; 
  description: string; 
  time: string; 
  status?: 'normal' | 'warning' | 'success';
}) => {
  const statusColor = 
    status === 'warning' ? 'text-amber-500' : 
    status === 'success' ? 'text-green-500' : 
    'text-blue-500';
  
  return (
    <div className="border-b border-gray-100 py-3 last:border-b-0">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-800">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <span className={`text-xs ${statusColor}`}>{time}</span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  
  // Simulating data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    );
  }
  
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store</p>
      </header>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FaBox className="text-white" />} 
          title="Total Products" 
          value="142" 
          trend="+12.5%" 
          backgroundColor="bg-blue-600"
        />
        <StatCard 
          icon={<FaUsers className="text-white" />} 
          title="Total Users" 
          value="2,845" 
          trend="+18.2%" 
          backgroundColor="bg-green-600"
        />
        <StatCard 
          icon={<FaShoppingCart className="text-white" />} 
          title="Total Orders" 
          value="1,257" 
          trend="+5.3%" 
          backgroundColor="bg-purple-600"
        />
        <StatCard 
          icon={<FaStore className="text-white" />} 
          title="Total Sellers" 
          value="23" 
          trend="+2.7%" 
          backgroundColor="bg-amber-600"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            <a href="/admin/orders" className="text-blue-600 text-sm hover:underline">View All</a>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { id: '#ORD-12345', customer: 'Jane Cooper', date: 'Apr 23, 2023', amount: '$129.99', status: 'Delivered' },
                  { id: '#ORD-12344', customer: 'John Smith', date: 'Apr 22, 2023', amount: '$89.50', status: 'Processing' },
                  { id: '#ORD-12343', customer: 'Robert Johnson', date: 'Apr 22, 2023', amount: '$32.75', status: 'Shipped' },
                  { id: '#ORD-12342', customer: 'Emily Davis', date: 'Apr 21, 2023', amount: '$112.00', status: 'Delivered' },
                  { id: '#ORD-12341', customer: 'Michael Wilson', date: 'Apr 21, 2023', amount: '$65.25', status: 'Processing' },
                ].map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.customer}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.amount}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
          </div>
          
          <div>
            <ActivityItem 
              title="New seller request" 
              description="Vendor 'FreshFoods' has requested approval" 
              time="Just now" 
              status="warning"
            />
            <ActivityItem 
              title="Product out of stock" 
              description="'Organic Bananas' is now out of stock" 
              time="2 hours ago" 
              status="warning"
            />
            <ActivityItem 
              title="New order received" 
              description="Customer placed order #ORD-12345" 
              time="4 hours ago"
            />
            <ActivityItem 
              title="Payment received" 
              description="Payment for order #ORD-12342 was successful" 
              time="5 hours ago" 
              status="success"
            />
            <ActivityItem 
              title="New user registered" 
              description="Emily Davis created a new account" 
              time="1 day ago"
            />
          </div>
          
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-amber-500 mt-0.5 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Attention Required</h4>
                <p className="text-xs text-amber-700 mt-1">
                  3 seller requests and 5 product reviews need your attention
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 