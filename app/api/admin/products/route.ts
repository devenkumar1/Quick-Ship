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
    
    // Get total count for pagination
    const totalCount = await prisma.product.count();
    
    // Get products with shop information
    const products = await prisma.product.findMany({
      skip,
      take: limit,
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            owner: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Format products for the response
    const formattedProducts = products.map(product => {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        shopId: product.shopId,
        shopName: product.shop?.name || 'Unknown Shop',
        sellerId: product.shop?.owner?.id,
        sellerName: product.shop?.owner?.name || 'Unknown Seller',
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };
    });
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({
      products: formattedProducts,
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
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    const prisma = new PrismaClient();
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      await prisma.$disconnect();
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Delete associated order items first (if applicable)
    await prisma.orderItem.deleteMany({
      where: { productId: id }
    });
    
    // Delete product
    await prisma.product.delete({
      where: { id }
    });
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
} 