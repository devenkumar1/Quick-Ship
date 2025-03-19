import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    
    // Get the most recent orders (limit to 5)
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        product: {
          select: {
            name: true,
            price: true
          }
        },
        payment: {
          select: {
            amount: true,
            status: true
          }
        }
      }
    });
    
    // Format the orders for the response
    const formattedOrders = recentOrders.map(order => ({
      id: order.id,
      customerName: order.user.name,
      amount: order.payment?.amount || (order.quantity * Number(order.product.price)),
      status: order.status,
      productName: order.product.name,
      quantity: order.quantity
    }));
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({
      orders: formattedOrders
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return NextResponse.json({ error: 'Failed to fetch recent orders' }, { status: 500 });
  }
} 