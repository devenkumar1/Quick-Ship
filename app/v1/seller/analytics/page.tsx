'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  FaChartLine, 
  FaChartBar, 
  FaRupeeSign, 
  FaBoxOpen, 
  FaArrowUp, 
  FaArrowDown,
  FaShoppingCart
} from 'react-icons/fa'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import LoadingSpinner from '@/app/components/LoadingSpinner'
import { formatCurrency } from '@/utils/format'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Define interfaces for the analytics data
interface Revenue {
  today: number
  thisWeek: number
  thisMonth: number
  lastMonth: number
  percentChange: number
}

interface OrderCounts {
  today: number
  thisWeek: number
  thisMonth: number
  lastMonth: number
}

interface TopProduct {
  id: string
  name: string
  price: number
  images: string[]
  totalSold: number
}

interface MonthlySales {
  month: string
  revenue: number
  orders: number
}

interface StatusBreakdown {
  status: string
  count: number
}

interface AnalyticsData {
  revenue: Revenue
  orderCounts: OrderCounts
  topProducts: TopProduct[]
  monthlySales: MonthlySales[]
  statusBreakdown: StatusBreakdown[]
}

export default function SellerAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/seller/analytics')
      setAnalyticsData(response.data)
    } catch (err) {
      console.error('Error fetching analytics data:', err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'rgb(34, 197, 94)'
      case 'PROCESSING':
        return 'rgb(234, 179, 8)'
      case 'SHIPPED':
        return 'rgb(59, 130, 246)'
      case 'PENDING':
        return 'rgb(107, 114, 128)'
      case 'CANCELLED':
        return 'rgb(239, 68, 68)'
      default:
        return 'rgb(107, 114, 128)'
    }
  }

  // Prepare chart data
  const prepareRevenueChartData = () => {
    if (!analyticsData) return null

    return {
      labels: analyticsData.monthlySales.map(sale => sale.month),
      datasets: [
        {
          label: 'Revenue',
          data: analyticsData.monthlySales.map(sale => sale.revenue),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.3,
        }
      ]
    }
  }

  const prepareOrdersChartData = () => {
    if (!analyticsData) return null

    return {
      labels: analyticsData.monthlySales.map(sale => sale.month),
      datasets: [
        {
          label: 'Orders',
          data: analyticsData.monthlySales.map(sale => sale.orders),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    }
  }

  const prepareStatusChartData = () => {
    if (!analyticsData) return null

    return {
      labels: analyticsData.statusBreakdown.map(item => item.status),
      datasets: [
        {
          data: analyticsData.statusBreakdown.map(item => item.count),
          backgroundColor: analyticsData.statusBreakdown.map(item => getStatusColor(item.status)),
          borderWidth: 1,
        }
      ]
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No data!</strong>
          <span className="block sm:inline"> No analytics data available.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Store Analytics</h1>

      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Revenue */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue (This Month)</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(analyticsData.revenue.thisMonth)}</p>
              
              <div className="flex items-center mt-2">
                <span className={`flex items-center ${analyticsData.revenue.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {analyticsData.revenue.percentChange >= 0 ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                  {Math.abs(analyticsData.revenue.percentChange).toFixed(1)}%
                </span>
                <span className="text-gray-500 text-xs ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaRupeeSign className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders (This Month)</p>
              <p className="text-2xl font-bold mt-1">{analyticsData.orderCounts.thisMonth}</p>
              
              <div className="flex items-center mt-2">
                <span className={`flex items-center ${analyticsData.orderCounts.thisMonth >= analyticsData.orderCounts.lastMonth ? 'text-green-500' : 'text-red-500'}`}>
                  {analyticsData.orderCounts.thisMonth >= analyticsData.orderCounts.lastMonth ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                  {analyticsData.orderCounts.lastMonth > 0 ? 
                    Math.abs(((analyticsData.orderCounts.thisMonth - analyticsData.orderCounts.lastMonth) / analyticsData.orderCounts.lastMonth) * 100).toFixed(1) : 
                    '0'}%
                </span>
                <span className="text-gray-500 text-xs ml-1">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaShoppingCart className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Today's Revenue</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(analyticsData.revenue.today)}</p>
              
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-xs">Orders: {analyticsData.orderCounts.today}</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaChartLine className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">This Week's Revenue</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(analyticsData.revenue.thisWeek)}</p>
              
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-xs">Orders: {analyticsData.orderCounts.thisWeek}</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FaChartBar className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend (Last 6 Months)</h2>
          <div className="h-64">
            {prepareRevenueChartData() && (
              <Line 
                data={prepareRevenueChartData()!} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => '₹' + value
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Orders Trend */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order Trend (Last 6 Months)</h2>
          <div className="h-64">
            {prepareOrdersChartData() && (
              <Bar 
                data={prepareOrdersChartData()!} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Top Products */}
        <div className="bg-white p-5 rounded-lg shadow col-span-2">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Units Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.topProducts.length > 0 ? (
                  analyticsData.topProducts.map(product => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={product.images?.[0] || '/placeholder-product.png'} 
                              alt={product.name} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(product.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.totalSold}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(product.price * product.totalSold)}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order Status Breakdown</h2>
          <div className="h-64 flex justify-center items-center">
            {analyticsData.statusBreakdown.length > 0 ? (
              <Doughnut 
                data={prepareStatusChartData()!} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    }
                  }
                }}
              />
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
          {analyticsData.statusBreakdown.length > 0 && (
            <div className="mt-4">
              <ul className="space-y-2">
                {analyticsData.statusBreakdown.map(item => (
                  <li key={item.status} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: getStatusColor(item.status) }}
                      ></span>
                      <span className="text-sm">{item.status}</span>
                    </div>
                    <span className="text-sm font-medium">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
