'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Package, Truck, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Order {
  id: number
  status: string
  total: number
  createdAt: string
  user: {
    name: string
    email: string
    phoneNumber: string
  }
  items: {
    product: {
      name: string
      price: number
      images: string[]
    }
    quantity: number
  }[]
}

function SellerOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/seller/orders')
        setOrders(response.data.orders)
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchOrders()
    }
  }, [session])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Package className="w-5 h-5 text-yellow-500" />
      case 'PROCESSING':
        return <RefreshCw className="w-5 h-5 text-blue-500" />
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-purple-500" />
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await axios.patch('/api/seller/orders', { orderId, status: newStatus })
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      toast.success('Order status updated')
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop Orders</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-2 text-sm text-gray-500">Orders from your shop will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          Customer: {order.user.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Email: {order.user.email}
                        </p>
                        {order.user.phoneNumber && (
                          <p className="text-sm text-gray-600">
                            Phone: {order.user.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className="text-sm font-medium text-gray-700">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          {item.product.images[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg font-medium text-gray-900">
                      Total: ${order.total.toFixed(2)}
                    </p>
                    <div className="flex space-x-2">
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'PROCESSING')}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Process
                        </button>
                      )}
                      {order.status === 'PROCESSING' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                          className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                          Ship
                        </button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerOrders 