import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, Decimal } from '@prisma/client';

// Enable Next.js Route Segment Config for caching
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

// Get all products
export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    
    // Get all products with shop information
    const products = await prisma.product.findMany({
      include: {
        shop: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json(
      { products }, 
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
        }
      }
    );
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Add a new product
export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const data = await req.json();
    
    console.log('Received product data:', data);
    
    // Validate required fields
    if (!data.name || !data.price) {
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: {
          name: !data.name ? 'Name is required' : null,
          price: !data.price ? 'Price is required' : null
        }
      }, { status: 400 });
    }

    // Validate price format
    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      return NextResponse.json({ 
        error: 'Invalid price format',
        details: { price: 'Price must be a valid positive number' }
      }, { status: 400 });
    }

    // Get the first shop (temporary solution)
    const shop = await prisma.shop.findFirst();
    
    if (!shop) {
      return NextResponse.json({ 
        error: 'No shop found. Please create a shop first.',
        details: 'Shop is required to create products'
      }, { status: 400 });
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: new Decimal(price),
        images: Array.isArray(data.images) ? data.images : [],
        shopId: shop.id
      },
      include: {
        shop: true
      }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({ product }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating product:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this name already exists' }, { status: 400 });
    }
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Invalid shop ID' }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create product',
      details: error.message
    }, { status: 500 });
  }
}

// Update a product
export async function PUT(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const data = await req.json();
    
    console.log('Received update data:', data);
    
    if (!data.id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Validate price format
    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      return NextResponse.json({ 
        error: 'Invalid price format',
        details: { price: 'Price must be a valid positive number' }
      }, { status: 400 });
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(data.id)
      },
      data: {
        name: data.name,
        description: data.description || null,
        price: new Decimal(price),
        images: Array.isArray(data.images) ? data.images : []
      }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({ product: updatedProduct }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error updating product:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this name already exists' }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to update product',
      details: error.message
    }, { status: 500 });
  }
}

// Delete a product
export async function DELETE(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Delete the product
    await prisma.product.delete({
      where: {
        id: parseInt(productId)
      }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
} 