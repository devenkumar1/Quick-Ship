'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaTrash, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

interface Shop {
  id: string;
  name: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  productCount: number;
  createdAt: string;
  description?: string;
  category?: string;
  address?: string;
  image?: string;
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [error, setError] = useState('');
  const [apiMissing, setApiMissing] = useState(false);

  // Fetch shops from API
  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/admin/shops');
        if (response.data && response.data.shops) {
          setShops(response.data.shops);
        }
        setError('');
        setApiMissing(false);
      } catch (error) {
        console.error('Error fetching shops:', error);
        
        // Check if the error is due to API not being implemented (404)
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setApiMissing(true);
          setError('The required API endpoints are not implemented yet. Using mock data for demonstration.');
        } else {
          setError('Failed to load shops. Please try again later.');
        }
        
        // Fallback to mock data if API fails
        const mockShops: Shop[] = Array.from({ length: 20 }, (_, i) => ({
          id: `shop-${i + 1}`,
          name: `Shop ${i + 1}`,
          sellerId: `seller-${i + 1}`,
          sellerName: `Seller ${i + 1}`,
          sellerEmail: `seller${i + 1}@example.com`,
          productCount: Math.floor(Math.random() * 100),
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
          description: i % 2 === 0 ? `This is a description for Shop ${i + 1}` : undefined,
          category: ['Electronics', 'Clothing', 'Home Goods', 'Books', 'Food'][i % 5],
          address: i % 3 === 0 ? `123 Shop Street, City ${i + 1}` : undefined,
          image: i % 4 === 0 ? `https://picsum.photos/seed/shop${i}/200/200` : undefined
        }));
        setShops(mockShops);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.sellerEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (shopId: string) => {
    if (window.confirm('Are you sure you want to delete this shop? This action cannot be undone.')) {
      try {
        if (apiMissing) {
          // Just update UI if API is not implemented
          setShops(shops.filter(shop => shop.id !== shopId));
          return;
        }
        
        await axios.delete(`/api/admin/shops/${shopId}`);
        setShops(shops.filter(shop => shop.id !== shopId));
      } catch (error) {
        console.error('Error deleting shop:', error);
        alert('Failed to delete shop. Please try again.');
      }
    }
  };

  const handleView = (shop: Shop) => {
    setSelectedShop(shop);
    setShowModal(true);
  };

  const handleEdit = (shopId: string) => {
    // This would typically redirect to a shop edit page
    alert(`Edit shop with ID: ${shopId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Shop Management</h1>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search shops..."
            className="pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

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
            <li><code>/api/admin/shops</code> - To fetch and manage shops</li>
            <li><code>/api/admin/shops/:id</code> - To delete and update shops</li>
          </ul>
          <p className="mt-2">Currently showing mock data for demonstration purposes.</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-blue-500 mr-2 text-xl" />
            <p className="text-gray-600 dark:text-gray-300">Loading shops...</p>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No shops found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shop Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {filteredShops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{shop.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {shop.image && (
                          <img src={shop.image} alt={shop.name} className="h-10 w-10 rounded-full mr-3" />
                        )}
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{shop.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{shop.sellerName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{shop.sellerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{shop.productCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(shop.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleView(shop)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          aria-label={`View shop ${shop.name}`}
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEdit(shop.id)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          aria-label={`Edit shop ${shop.name}`}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(shop.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          aria-label={`Delete shop ${shop.name}`}
                        >
                          <FaTrash />
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

      {/* Shop Details Modal */}
      {showModal && selectedShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{selectedShop.name}</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  aria-label="Close modal"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Shop Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                      <p className="text-gray-800 dark:text-white">{selectedShop.id}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Created On</p>
                      <p className="text-gray-800 dark:text-white">{new Date(selectedShop.createdAt).toLocaleDateString()}</p>
                    </div>
                    {selectedShop.category && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                        <p className="text-gray-800 dark:text-white">{selectedShop.category}</p>
                      </div>
                    )}
                    {selectedShop.description && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                        <p className="text-gray-800 dark:text-white">{selectedShop.description}</p>
                      </div>
                    )}
                    {selectedShop.address && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                        <p className="text-gray-800 dark:text-white">{selectedShop.address}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Seller Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Seller ID</p>
                      <p className="text-gray-800 dark:text-white">{selectedShop.sellerId}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                      <p className="text-gray-800 dark:text-white">{selectedShop.sellerName}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-800 dark:text-white">{selectedShop.sellerEmail}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Products</p>
                      <p className="text-gray-800 dark:text-white">{selectedShop.productCount}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => handleEdit(selectedShop.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Edit Shop
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleDelete(selectedShop.id);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete Shop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 