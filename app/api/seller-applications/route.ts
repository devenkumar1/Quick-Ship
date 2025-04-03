import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Submit a new seller application
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { phone, shopName, location, description } = data;

    // Get the user's ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has a pending application
    const existingApplication = await prisma.sellerApplication.findFirst({
      where: {
        userId: user.id,
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
        userId: user.id
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


export async function GET(){
  const allapplication= await prisma.sellerApplication.findMany();
if(!allapplication){
  return NextResponse.json({message:"no applications found"},{status:400});
}
return NextResponse.json({message:"successfully fetched applications",applications:allapplication},{status:200});
}