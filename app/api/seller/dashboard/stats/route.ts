import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    // Authenticate and get current user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const prisma = new PrismaClient();

    // Get seller and associated shop
    const seller = await prisma.seller.findUnique({
      where: { userId },
      include: { shop: true }
    });
    if (!seller?.shop) {
      await prisma.$disconnect();
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }
    const shopId = seller.shop.id;

    // Get count of products for this shop
    const productsCount = await prisma.product.count({ where: { shopId } });

    // Get orders for this shop
    const orders = await prisma.order.findMany({
      where: { items: { some: { product: { shopId } } } },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } },
        payment: true
      }
    });

    // Calculate total revenue and other stats
    const totalRevenue = orders.reduce((sum, order) => {
      // Calculate order total from items
      const orderTotal = order.items.reduce((itemSum, item) => {
        return itemSum + (Number(item.price) * item.quantity);
      }, 0);
      return sum + orderTotal;
    }, 0);

    const totalOrders = orders.length;
    const totalProducts = productsCount;

    // Get recent orders for this shop
    const recentOrders = await prisma.order.findMany({
      where: { items: { some: { product: { shopId } } } },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } },
        payment: true
      }
    });

    await prisma.$disconnect();

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts
      },
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        customerName: order.user.name,
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
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}