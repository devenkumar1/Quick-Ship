import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    
    const users = await prisma.user.findMany({
      where: {
        role: 'USER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        orders: {
          select: {
            id: true
          }
        }
      }
    });
    
    // Format users for the response
    const formattedUsers = users.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        orderCount: user.orders.length,
      };
    });
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({
      users: formattedUsers
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const prisma = new PrismaClient();
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true }
    });
    
    if (!user) {
      await prisma.$disconnect();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Prevent deletion of admin accounts through this endpoint
    if (user.role === 'ADMIN') {
      await prisma.$disconnect();
      return NextResponse.json({ error: 'Cannot delete admin accounts' }, { status: 403 });
    }
    
    // Delete associated orders first (to handle foreign key constraints)
    await prisma.order.deleteMany({
      where: { userId: id }
    });
    
    // Delete user
    await prisma.user.delete({
      where: { id }
    });
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
} 