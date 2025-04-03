import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);

    // If no session found, return unauthorized
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prisma = new PrismaClient();
    
    // Get the user data
    const userData = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
        role: true,
        orders: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    images: true,
                    shop: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        reviews: {
          take: 5,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                shop: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });
    
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Format favorite products from reviews with high ratings (4-5)
    const favoriteProducts = userData.reviews
      .filter(review => review.rating >= 4)
      .map(review => ({
        id: review.product.id,
        name: review.product.name,
        image: review.product.images[0] || '/default-product.svg',
        shopName: review.product.shop.name
      }))
      .slice(0, 4); // Limit to 4 favorites

    // Format orders
    const recentOrders = userData.orders.map(order => ({
      id: order.id,
      date: order.createdAt,
      status: order.status,
      // totalAmount: order.totalAmount,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        image: item.product.images[0] || '/default-product.svg',
        shopName: item.product.shop.name
      }))
    }));

    // Close the Prisma client
    await prisma.$disconnect();
    
    return NextResponse.json({
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phoneNumber || '',
        avatarUrl: userData.image || '/default-avatar.svg',
        role: userData.role
      },
      recentOrders,
      favorites: favoriteProducts
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
} 