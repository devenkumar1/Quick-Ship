import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    
    // Get all sellers
    const sellers = await prisma.user.findMany({
      where: {
        role: 'SELLER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
        createdAt: true,
        seller: {
          select: {
            id: true,
            shop: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    // Format sellers for the response
    const formattedSellers = sellers.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phoneNumber || 'Not provided',
        image: user.image || '/images/placeholder-user.jpg',
        shopId: user.seller?.shop?.id || null,
        shopName: user.seller?.shop?.name || 'No shop yet',
        createdAt: user.createdAt
      };
    });
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({
      sellers: formattedSellers
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return NextResponse.json({ error: 'Failed to fetch sellers' }, { status: 500 });
  }
}

// Handle specific seller operations (delete, approve, etc.)
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 });
    }
    
    const prisma = new PrismaClient();
    
    // Check if seller exists
    const seller = await prisma.user.findUnique({
      where: { id },
      include: { 
        seller: {
          include: {
            shop: true
          }
        }
      }
    });
    
    if (!seller) {
      await prisma.$disconnect();
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }
    
    // Delete associated shop if it exists
    if (seller.seller?.shop) {
      await prisma.shop.delete({
        where: { id: seller.seller.shop.id }
      });
    }
    
    // Delete seller account
    await prisma.user.delete({
      where: { id }
    });
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({ message: 'Seller account deleted successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting seller:', error);
    return NextResponse.json({ error: 'Failed to delete seller' }, { status: 500 });
  }
} 