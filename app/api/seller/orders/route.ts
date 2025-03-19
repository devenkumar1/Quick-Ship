import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    
    // Get all orders
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        product: true,
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format orders for response
    const formattedOrders = orders.map(order => ({
      id: order.id,
      customerName: order.user.name,
      customerEmail: order.user.email,
      productName: order.product.name,
      quantity: order.quantity,
      amount: order.payment?.amount || (order.quantity * Number(order.product.price)),
      status: order.status,
      paymentStatus: order.payment?.status || 'PENDING',
      createdAt: order.createdAt
    }));
    
    await prisma.$disconnect();
    
    return NextResponse.json({ orders: formattedOrders }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// Update order status
export async function PUT(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const data = await req.json();
    
    if (!data.orderId || !data.status) {
      return NextResponse.json({ error: 'Order ID and status are required' }, { status: 400 });
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: {
        id: data.orderId
      },
      data: {
        status: data.status
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        product: true,
        payment: true
      }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      order: {
        id: updatedOrder.id,
        customerName: updatedOrder.user.name,
        customerEmail: updatedOrder.user.email,
        productName: updatedOrder.product.name,
        quantity: updatedOrder.quantity,
        amount: updatedOrder.payment?.amount || (updatedOrder.quantity * Number(updatedOrder.product.price)),
        status: updatedOrder.status,
        paymentStatus: updatedOrder.payment?.status || 'PENDING',
        createdAt: updatedOrder.createdAt
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
} 