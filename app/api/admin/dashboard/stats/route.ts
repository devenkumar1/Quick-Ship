import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    
    // Get count of users with USER role
    const usersCount = await prisma.user.count({
      where: {
        role: 'USER'
      }
    });
    
    // Get count of users with SELLER role
    const sellersCount = await prisma.user.count({
      where: {
        role: 'SELLER'
      }
    });
    
    // Get count of shops
    const shopsCount = await prisma.shop.count();
    
    // Get count of products
    const productsCount = await prisma.product.count();
    
    // Get count of orders
    const ordersCount = await prisma.order.count();
    
    // Calculate total revenue from orders
    const payments = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    });
    
    const totalRevenue = payments._sum.amount || 0;
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({
      users: usersCount,
      sellers: sellersCount,
      shops: shopsCount,
      products: productsCount,
      orders: ordersCount,
      revenue: totalRevenue
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
} 