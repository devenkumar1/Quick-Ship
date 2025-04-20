'use client';
import React, { FormEvent, useState, useEffect } from 'react';
import { FaUserCheck, FaUserTimes, FaSearch, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface PendingRequest {
  id: number;
  email: string;
  accountType: string;
  ReqStatus: string;
  contact: number;
}

export default function SellersDashboard() {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('SELLER');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [sellers, setSellers] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingSellers, setIsLoadingSellers] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [apiMissing, setApiMissing] = useState(false);

  // Fetch sellers and pending requests on component mount
  useEffect(() => {
    const fetchSellers = async () => {
      setIsLoadingSellers(true);
      try {
        const response = await axios.get<{sellers: User[]}>('/api/admin/sellers');
        if (response.data && response.data.sellers) {
          setSellers(response.data.sellers);
        }
        setApiMissing(false);
      } catch (error) {
        console.error('Error fetching sellers:', error);
        
        // Check if the error is due to API not being implemented (404)
        // Using type check to determine if it's an Axios error with response property
        const axiosError = error as {response?: {status: number}};
        if (axiosError.response?.status === 404) {
          setApiMissing(true);
          setMessage({ 
            text: 'The required API endpoints are not implemented yet. Using mock data for demonstration.', 
            type: 'warning' 
          });
        } else {
          setMessage({ 
            text: 'Failed to load sellers. Please try again later.', 
            type: 'error' 
          });
        }
        
        // Fallback to mock data if API fails
        setSellers([
          { id: '1', email: 'seller1@example.com', name: 'John Seller', role: 'SELLER' },
          { id: '2', email: 'seller2@example.com', name: 'Jane Merchant', role: 'SELLER' },
          { id: '3', email: 'seller3@example.com', name: 'Bob Vendor', role: 'SELLER' }
        ]);
      } finally {
        setIsLoadingSellers(false);
      }
    };

    const fetchPendingRequests = async () => {
      setIsLoadingRequests(true);
      try {
        // Use the correct API endpoint for seller applications
        interface Application {
          id: string;
          status: string;
          phone?: string;
          user: {
            email: string;
          };
        }
        
        const response = await axios.get<{applications: Application[]}>('/api/admin/seller-applications');
        
        if (response.data && response.data.applications) {
          // Map the applications data to the expected PendingRequest format
          const mappedRequests = response.data.applications
            .filter(app => app.status === 'PENDING')
            .map(app => ({
              id: Number(app.id) || Math.floor(Math.random() * 1000), // Convert string ID to number or generate random ID
              email: app.user.email,
              accountType: 'SELLER',
              ReqStatus: app.status,
              contact: app.phone ? Number(app.phone.replace(/\D/g, '')) : 0 // Convert phone to number or default to 0
            }));
          
          setPendingRequests(mappedRequests);
        }
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        
        // Fallback to mock data if API fails
        setPendingRequests([
          { id: 1, email: 'pending1@example.com', accountType: 'SELLER', ReqStatus: 'PENDING', contact: 1234567890 },
          { id: 2, email: 'pending2@example.com', accountType: 'SELLER', ReqStatus: 'PENDING', contact: 9876543210 }
        ]);
      } finally {
        setIsLoadingRequests(false);
      }
    };

    fetchSellers();
    fetchPendingRequests();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: 'Email is required', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (apiMissing) {
        // Just simulate success if API is not implemented
        setTimeout(() => {
          setMessage({ 
            text: `User ${email} role changed to ${userType} successfully (simulated)`, 
            type: 'success' 
          });
          
          // Add to sellers list if we changed someone to a seller
          if (userType === 'SELLER') {
            const newSeller = {
              id: `temp-${Date.now()}`,
              email: email,
              name: email.split('@')[0],
              role: userType
            };
            setSellers([...sellers, newSeller]);
          }
          
          // Clear the form
          setEmail('');
          setLoading(false);
        }, 1000);
        return;
      }
      
      const response = await axios.post("/api/admin/account-type", {
        email,
        userType
      });
      
      setMessage({ 
        text: `User ${email} role changed to ${userType} successfully`, 
        type: 'success' 
      });
      
      // Refresh the sellers list if we changed someone to a seller
      if (userType === 'SELLER') {
        const response = await axios.get<{sellers: User[]}>('/api/admin/sellers');
        if (response.data && response.data.sellers) {
          setSellers(response.data.sellers);
        }
      }
      
      // Clear the form
      setEmail('');
    } catch (error) {
      console.error("Error occurred while changing user type", error);
      setMessage({ 
        text: 'Failed to update user role. Please try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (id: number) => {
    try {
      setMessage({ text: '', type: '' });
      
      if (apiMissing) {
        // Just update UI if API is not implemented
        setPendingRequests(pendingRequests.filter(request => request.id !== id));
        
        // Add to sellers list
        const pendingRequest = pendingRequests.find(req => req.id === id);
        if (pendingRequest) {
          const newSeller = {
            id: `temp-${Date.now()}`,
            email: pendingRequest.email,
            name: pendingRequest.email.split('@')[0],
            role: 'SELLER'
          };
          setSellers([...sellers, newSeller]);
        }
        
        setMessage({ 
          text: 'Seller request approved successfully (simulated)', 
          type: 'success' 
        });
        return;
      }
      
      // Make API call to approve the request using the correct endpoint
      await axios.put('/api/admin/seller-applications', {
        applicationId: id, // Send ID as a number, not a string
        status: 'APPROVED'
      });
      
      // Remove the request from the list
      setPendingRequests(pendingRequests.filter(request => request.id !== id));
      
      // Refresh the sellers list
      const response = await axios.get<{sellers: User[]}>('/api/admin/sellers');
      if (response.data && response.data.sellers) {
        setSellers(response.data.sellers);
      }
      
      setMessage({ 
        text: 'Seller request approved successfully', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error approving seller request:', error);
      setMessage({ 
        text: 'Failed to approve seller request. Please try again.', 
        type: 'error' 
      });
    }
  };

  const handleRejectRequest = async (id: number) => {
    try {
      setMessage({ text: '', type: '' });
      
      if (apiMissing) {
        // Just update UI if API is not implemented
        setPendingRequests(pendingRequests.filter(request => request.id !== id));
        
        setMessage({ 
          text: 'Seller request rejected (simulated)', 
          type: 'success' 
        });
        return;
      }
      
      // Make API call to reject the request using the correct endpoint
      await axios.put('/api/admin/seller-applications', {
        applicationId: id, // Send ID as a number, not a string
        status: 'REJECTED'
      });
      
      // Remove the request from the list
      setPendingRequests(pendingRequests.filter(request => request.id !== id));
      
      setMessage({ 
        text: 'Seller request rejected', 
        type: 'success' 
      });
    } catch (error) {
      console.error('Error rejecting seller request:', error);
      setMessage({ 
        text: 'Failed to reject seller request. Please try again.', 
        type: 'error' 
      });
    }
  };

  const filteredSellers = sellers.filter(seller => 
    seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Seller Management</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage seller accounts and review pending seller requests.</p>
      </div>

      {/* Message display */}
      {message.text && (
        <div className={`p-4 mb-6 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : message.type === 'warning'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {message.type === 'warning' && <FaExclamationTriangle className="inline mr-2" />}
          {message.text}
        </div>
      )}

      {apiMissing && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md">
          <h3 className="font-bold text-lg mb-2">Backend API Implementation Required</h3>
          <p>The following API endpoints need to be implemented:</p>
          <ul className="list-disc pl-5 mt-2">
            <li><code>/api/admin/sellers</code> - To fetch list of sellers</li>
            <li><code>/api/admin/seller-applications</code> - To fetch and manage seller applications</li>
            <li><code>/api/admin/account-type</code> - To change user roles</li>
          </ul>
          <p className="mt-2">Currently simulating functionality with mock data for demonstration purposes.</p>
        </div>
      )}

      {/* Pending Seller Requests */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Pending Seller Requests</h3>
        </div>
        <div className="p-6">
          {isLoadingRequests ? (
            <div className="py-8 flex justify-center items-center">
              <FaSpinner className="animate-spin text-2xl text-blue-500" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading requests...</span>
            </div>
          ) : pendingRequests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">No pending requests.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Email</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Contact</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Account Type</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {pendingRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">{request.email}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">{request.contact}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">{request.accountType}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleApproveRequest(request.id)}
                            className="flex items-center px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            <FaUserCheck className="mr-1" /> Approve
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(request.id)}
                            className="flex items-center px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <FaUserTimes className="mr-1" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Existing Sellers List */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Existing Sellers</h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sellers..."
              className="pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="p-6">
          {isLoadingSellers ? (
            <div className="py-8 flex justify-center items-center">
              <FaSpinner className="animate-spin text-2xl text-blue-500" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading sellers...</span>
            </div>
          ) : filteredSellers.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">No sellers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">ID</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Name</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Email</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider py-3 px-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredSellers.map((seller) => (
                    <tr key={seller.id}>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">{seller.id}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">{seller.name}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">{seller.email}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-800 dark:text-white">{seller.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Change Account Type Form */}
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Change Account Type</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Email</label>
              <input
                id="email"
                type="email"
                placeholder="user@example.com"
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Type</label>
              <select
                id="userType"
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="USER">User</option>
                <option value="SELLER">Seller</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Update Account Type'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}