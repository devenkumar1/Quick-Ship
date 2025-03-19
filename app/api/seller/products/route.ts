import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Get all products
export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    
    // Get all products
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({ products }, { status: 200 });
    
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
    
    // Validate required fields
    if (!data.name || !data.price || !data.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        images: data.images || []
      }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({ product }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// Update a product
export async function PUT(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    const data = await req.json();
    
    if (!data.id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: {
        id: data.id
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        images: data.images
      }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({ product: updatedProduct }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
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
        id: productId
      }
    });
    
    await prisma.$disconnect();
    
    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
} 