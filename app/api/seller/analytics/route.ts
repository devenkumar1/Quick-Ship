import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

// Helper function to generate date ranges
function getDateRanges() {
  const now = new Date()
  
  // Today
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)
  
  // This week
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay()) // Start of the week (Sunday)
  weekStart.setHours(0, 0, 0, 0)
  
  // This month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  
  // Last month
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
  
  // This year
  const yearStart = new Date(now.getFullYear(), 0, 1)
  
  return {
    today: { start: todayStart, end: now },
    thisWeek: { start: weekStart, end: now },
    thisMonth: { start: monthStart, end: now },
    lastMonth: { start: lastMonthStart, end: lastMonthEnd },
    thisYear: { start: yearStart, end: now }
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const prisma = new PrismaClient()
    
    // Get the seller's shop
    const seller = await prisma.seller.findUnique({
      where: {
        userId: session.user.id
      },
      include: {
        shop: true
      }
    })
    
    if (!seller?.shop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }
    
    const shopId = seller.shop.id
    const dateRanges = getDateRanges()
    
    // Get sales data
    const salesData = await Promise.all([
      // Today's sales
      prisma.order.findMany({
        where: {
          items: {
            some: {
              product: {
                shopId
              }
            }
          },
          createdAt: {
            gte: dateRanges.today.start,
            lte: dateRanges.today.end
          },
          status: { not: 'CANCELLED' }
        },
        include: {
          items: {
            where: {
              product: {
                shopId
              }
            }
          }
        }
      }),
      
      // This week's sales
      prisma.order.findMany({
        where: {
          items: {
            some: {
              product: {
                shopId
              }
            }
          },
          createdAt: {
            gte: dateRanges.thisWeek.start,
            lte: dateRanges.thisWeek.end
          },
          status: { not: 'CANCELLED' }
        },
        include: {
          items: {
            where: {
              product: {
                shopId
              }
            }
          }
        }
      }),
      
      // This month's sales
      prisma.order.findMany({
        where: {
          items: {
            some: {
              product: {
                shopId
              }
            }
          },
          createdAt: {
            gte: dateRanges.thisMonth.start,
            lte: dateRanges.thisMonth.end
          },
          status: { not: 'CANCELLED' }
        },
        include: {
          items: {
            where: {
              product: {
                shopId
              }
            }
          }
        }
      }),
      
      // Last month's sales
      prisma.order.findMany({
        where: {
          items: {
            some: {
              product: {
                shopId
              }
            }
          },
          createdAt: {
            gte: dateRanges.lastMonth.start,
            lte: dateRanges.lastMonth.end
          },
          status: { not: 'CANCELLED' }
        },
        include: {
          items: {
            where: {
              product: {
                shopId
              }
            }
          }
        }
      })
    ])
    
    const [todayOrders, thisWeekOrders, thisMonthOrders, lastMonthOrders] = salesData
    
    // Calculate revenue for each period
    const calculateRevenue = (orders) => {
      return orders.reduce((total, order) => {
        const orderTotal = order.items.reduce((sum, item) => {
          return sum + (Number(item.price) * item.quantity)
        }, 0)
        return total + orderTotal
      }, 0)
    }
    
    const todayRevenue = calculateRevenue(todayOrders)
    const thisWeekRevenue = calculateRevenue(thisWeekOrders)
    const thisMonthRevenue = calculateRevenue(thisMonthOrders)
    const lastMonthRevenue = calculateRevenue(lastMonthOrders)
    
    // Get top-selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        product: {
          shopId
        },
        order: {
          createdAt: {
            gte: dateRanges.thisMonth.start
          },
          status: { not: 'CANCELLED' }
        }
      },
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })
    
    // Get product details for top products
    const topProductDetails = await Promise.all(
      topProducts.map(async product => {
        const productInfo = await prisma.product.findUnique({
          where: {
            id: product.productId
          },
          select: {
            id: true,
            name: true,
            price: true,
            images: true
          }
        })
        
        return {
          ...productInfo,
          totalSold: product._sum.quantity
        }
      })
    )
    
    // Get monthly sales for the past 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)
    
    const monthlyOrders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              shopId
            }
          }
        },
        createdAt: {
          gte: sixMonthsAgo
        },
        status: { not: 'CANCELLED' }
      },
      include: {
        items: {
          where: {
            product: {
              shopId
            }
          }
        }
      }
    })
    
    // Group sales by month
    const monthlySales = Array(6).fill(0).map((_, index) => {
      const monthDate = new Date()
      monthDate.setMonth(monthDate.getMonth() - index)
      
      const month = monthDate.toLocaleString('default', { month: 'short' })
      const year = monthDate.getFullYear()
      
      const monthStart = new Date(year, monthDate.getMonth(), 1)
      const monthEnd = new Date(year, monthDate.getMonth() + 1, 0)
      
      const filteredOrders = monthlyOrders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate >= monthStart && orderDate <= monthEnd
      })
      
      const revenue = calculateRevenue(filteredOrders)
      
      return {
        month: `${month} ${year}`,
        revenue,
        orders: filteredOrders.length
      }
    }).reverse()
    
    // Get order status breakdown
    const statusBreakdown = await prisma.order.groupBy({
      by: ['status'],
      where: {
        items: {
          some: {
            product: {
              shopId
            }
          }
        },
        createdAt: {
          gte: dateRanges.thisMonth.start
        }
      },
      _count: true
    })
    
    // Format status breakdown
    const formattedStatusBreakdown = statusBreakdown.map(status => ({
      status: status.status,
      count: status._count
    }))
    
    // Close Prisma connection
    await prisma.$disconnect()
    
    return NextResponse.json({
      revenue: {
        today: todayRevenue,
        thisWeek: thisWeekRevenue,
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        percentChange: lastMonthRevenue > 0 
          ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
          : 0
      },
      orderCounts: {
        today: todayOrders.length,
        thisWeek: thisWeekOrders.length,
        thisMonth: thisMonthOrders.length,
        lastMonth: lastMonthOrders.length
      },
      topProducts: topProductDetails,
      monthlySales,
      statusBreakdown: formattedStatusBreakdown
    }, { status: 200 })
    
  } catch (error) {
    console.error('Error fetching seller analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
