import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    // Authenticate
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const prisma = new PrismaClient();

    // Get today's start and end time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get seller shop
    const seller = await prisma.seller.findUnique({ where: { userId: session.user.id }, include: { shop: true } });
    if (!seller?.shop) {
      await prisma.$disconnect();
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }
    const shopId = seller.shop.id;

    // Get today's orders for this shop
    const todaysOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: today, lt: tomorrow },
        items: { some: { product: { shopId } } }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        payment: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate today's total earnings
    const todaysEarnings = todaysOrders.reduce((sum, order) => {
      const orderTotal = order.items.reduce((itemSum, item) => {
        return itemSum + (Number(item.price) * item.quantity);
      }, 0);
      return sum + orderTotal;
    }, 0);

    // Format the response
    const formattedOrders = todaysOrders.map(order => ({
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
    }));

    await prisma.$disconnect();
    
    return NextResponse.json({
      stats: {
        todaysEarnings,
        totalOrders: todaysOrders.length
      },
      orders: formattedOrders
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching today\'s stats:', error);
    return NextResponse.json({ error: 'Failed to fetch today\'s stats' }, { status: 500 });
  }
} 