import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'

const client= new PrismaClient;


export async function POST(req: NextRequest) {
  try {

    const reqBody= await req.json();

  const {userId} =reqBody;
   if(!userId) return NextResponse.json({message:"no user id provided "},{status:401})
  
    const orders = await client.order.findMany({
      where: {
        userId: userId
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ orders }, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
} 