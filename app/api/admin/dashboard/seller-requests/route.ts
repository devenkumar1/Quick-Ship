import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient();
    
    // Get pending seller requests
    const requests = await prisma.pendingRequest.findMany({
      where: {
        accountType: 'SELLER',
        ReqStatus: 'PENDING'
      },
      orderBy: {
        id: 'desc'
      }
    });
    
    // Format the requests for response
    const formattedRequests = requests.map(request => ({
      id: request.id,
      email: request.email,
      contact: request.contact,
      requestedAt: new Date().toISOString()
    }));
    
    // Close Prisma client connection
    await prisma.$disconnect();
    
    return NextResponse.json({
      requests: formattedRequests
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching seller requests:', error);
    return NextResponse.json({ error: 'Failed to fetch seller requests' }, { status: 500 });
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'just now';
  }
} 