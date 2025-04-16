import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    console.error('Error fetching seller orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, status } = await req.json()

    // Verify the seller owns the shop that has products in this order
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

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        items: {
          some: {
            product: {
              shopId: seller.shop.id
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status
      }
    })

    return NextResponse.json({ order: updatedOrder }, { status: 200 })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    )
  }
} 