import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    
    // Get all shops with their owner and product count
    const shops = await prisma.shop.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        products: {
          select: {
            id: true
          }
        }
      }
    });
    
    // Format shops for the response
    const formattedShops = shops.map(shop => {
      return {
        id: shop.id,
        name: shop.name,
        description: shop.description,
        logo: shop.logo || '/images/placeholder-shop.jpg',
        sellerId: shop.ownerId,
        sellerName: shop.owner?.name || 'Unknown',
        sellerEmail: shop.owner?.email || 'Unknown',
        productCount: shop.products.length,
        createdAt: shop.createdAt
      };
    });
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({
      shops: formattedShops
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching shops:', error);
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
    }
    
    const prisma = new PrismaClient();
    
    // Check if shop exists
    const shop = await prisma.shop.findUnique({
      where: { id }
    });
    
    if (!shop) {
      await prisma.$disconnect();
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }
    
    // Delete associated products first
    await prisma.product.deleteMany({
      where: { shopId: id }
    });
    
    // Delete shop
    await prisma.shop.delete({
      where: { id }
    });
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({ message: 'Shop deleted successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting shop:', error);
    return NextResponse.json({ error: 'Failed to delete shop' }, { status: 500 });
  }
} 