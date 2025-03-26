import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get all seller applications
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await prisma.sellerApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching seller applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch seller applications' },
      { status: 500 }
    );
  }
}

// Submit a new seller application
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { phone, shopName, location, description } = data;

    // Check if user already has a pending application
    const existingApplication = await prisma.sellerApplication.findFirst({
      where: {
        user: {
          email: session.user.email
        },
        status: 'PENDING'
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You already have a pending application' },
        { status: 400 }
      );
    }

    // Create the application
    const application = await prisma.sellerApplication.create({
      data: {
        phone,
        shopName,
        location,
        description,
        status: 'PENDING',
        user: {
          connect: {
            email: session.user.email
          }
        }
      }
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error('Error creating seller application:', error);
    return NextResponse.json(
      { error: 'Failed to create seller application' },
      { status: 500 }
    );
  }
}

// Update application status (approve/reject)
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { applicationId, status } = data;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const application = await prisma.sellerApplication.findUnique({
      where: { id: applicationId },
      include: { user: true }
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (status === 'REJECTED') {
      // Delete the application if rejected
      await prisma.sellerApplication.delete({
        where: { id: applicationId }
      });
      
      return NextResponse.json({ message: 'Application rejected and deleted' });
    }

    // Handle approval process
    const updatedApplication = await prisma.$transaction(async (prisma) => {
      const updated = await prisma.sellerApplication.update({
        where: { id: applicationId },
        data: { status }
      });

      const seller = await prisma.seller.create({
        data: {
          phone: application.phone,
          userId: application.userId
        }
      });

      await prisma.shop.create({
        data: {
          name: application.shopName,
          description: application.description,
          location: application.location,
          sellerId: seller.id
        }
      });

      // Update user role to SELLER
      await prisma.user.update({
        where: { id: application.userId },
        data: { role: 'SELLER' }
      });

      return updated;
    });

    return NextResponse.json({ application: updatedApplication });
  } catch (error) {
    console.error('Error updating seller application:', error);
    return NextResponse.json(
      { error: 'Failed to update seller application' },
      { status: 500 }
    );
  }
} 