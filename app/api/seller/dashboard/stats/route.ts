import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    
    // Get count of products
    const productsCount = await prisma.product.count();
    
    // Get count of orders and total revenue
    const orders = await prisma.order.findMany({
      include: {
        payment: true,
        product: true
      }
    });

    const ordersCount = orders.length;
    
    // Calculate total revenue and pending payments
    let totalRevenue = 0;
    let pendingPayments = 0;

    orders.forEach(order => {
      const amount = order.payment?.amount || (order.quantity * Number(order.product.price));
      if (order.payment?.status === 'COMPLETED') {
        totalRevenue += amount;
      } else {
        pendingPayments += amount;
      }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({
      products: productsCount,
      orders: ordersCount,
      revenue: totalRevenue,
      pendingPayments: pendingPayments
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
} 