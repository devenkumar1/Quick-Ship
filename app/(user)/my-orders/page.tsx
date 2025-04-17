'use client'

import React, { useEffect, useState } from 'react'
import { ShoppingBag, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import useUserStore from '@/store/userStore'
interface Order {
  id: number
  status: string
  total: number
  createdAt: string
  items: {
    product: {
      name: string
      price: number
      images: string[]
    }
    quantity: number
  }[]
}

function MyOrders() {
  const{user}= useUserStore();
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post('/api/orders',{userId:user.id});
        if (response.status!=200) throw new Error('Failed to fetch orders')
        const data = await response.data;
        setOrders(data.orders)
      } catch (error) {
        console.error('Error fetching orders:', error)
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
        return <Package className="w-5 h-5 text-blue-500" />
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



  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <ShoppingBag className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
            <p className="mt-2 text-sm text-gray-500">Your order history will appear here</p>
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
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <p className="text-lg font-medium text-gray-900">
                      Total: ₹{order.total}
                    </p>
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

export default MyOrders