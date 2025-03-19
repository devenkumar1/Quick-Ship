import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const url = new URL(req.url);
    
    // Parse pagination parameters
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Parse filter parameters
    const status = url.searchParams.get('status');
    const paymentStatus = url.searchParams.get('paymentStatus');
    
    // Build filter conditions
    const whereConditions: any = {};
    
    if (status) {
      whereConditions.status = status;
    }
    
    if (paymentStatus) {
      whereConditions.paymentStatus = paymentStatus;
    }
    
    // Get total count for pagination
    const totalCount = await prisma.order.count({
      where: whereConditions
    });
    
    // Get orders with related information
    const orders = await prisma.order.findMany({
      where: whereConditions,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                shop: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Format orders for the response
    const formattedOrders = orders.map(order => {
      // Get shop information from the first item
      const shopName = order.items[0]?.product?.shop?.name || 'Unknown Shop';
      
      // Calculate total amount
      const totalAmount = order.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      return {
        id: order.id,
        userId: order.userId,
        userName: order.user?.name || 'Unknown User',
        userEmail: order.user?.email || 'Unknown Email',
        items: order.items.map(item => ({
          id: item.id,
          productId: item.productId,
          productName: item.product?.name || 'Unknown Product',
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        shopName,
        totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// Update order status
export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, status, paymentStatus } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    if (!status && !paymentStatus) {
      return NextResponse.json({ error: 'Either status or paymentStatus is required' }, { status: 400 });
    }
    
    const prisma = new PrismaClient();
    
    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id }
    });
    
    if (!order) {
      await prisma.$disconnect();
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
    }
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    
    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData
    });
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({ 
      message: 'Order updated successfully',
      order: updatedOrder
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
} 