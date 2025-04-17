import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const reqBody= await req.json();
    const {userId}=await reqBody;
   if(!userId)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    

    const prisma = new PrismaClient;

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

    // Get all orders that contain products from this shop
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              shopId: seller.shop.id
            }
          }
        }
      },
      include: {
        items: {
          where: {
            product: {
              shopId: seller.shop.id
            }
          },
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true
          }
        },
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    
    })

    // Format the orders for the response
    const formattedOrders = orders.map(order => ({
      id: order.id,
      customerName: order.user.name,
      customerEmail: order.user.email,
      products: order.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: order.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0),
      status: order.status,
      paymentStatus: order.payment?.status || 'PENDING',
      createdAt: order.createdAt
    }))

    await prisma.$disconnect()

    return NextResponse.json({ orders: formattedOrders }, { status: 200 })
  } catch (error) {
    console.error('Error fetching seller orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, status } = await req.json()
    if (!orderId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prisma = new PrismaClient()

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status
      }
    })

    await prisma.$disconnect()

    return NextResponse.json({ message: 'Order status updated successfully', order: updatedOrder }, { status: 200 })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
} 