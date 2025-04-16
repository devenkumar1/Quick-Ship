import { User } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';



const client= new PrismaClient();

const generatedSignature = (
 razorpayOrderId: string,
 razorpayPaymentId: string
) => {
 const keySecret = process.env.RAZORPAY_KEY_SECRET;
 if (!keySecret) {
  throw new Error(
   'Razorpay key secret is not defined in environment variables.'
  );
 }
 const sig = crypto
  .createHmac('sha256', keySecret)
  .update(razorpayOrderId + '|' + razorpayPaymentId)
  .digest('hex');
 return sig;
};

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { orderCreationId, razorpayPaymentId, razorpaySignature, orderedItems, userId, amount } = reqBody;
        
        if(!orderCreationId || !razorpayPaymentId || !razorpaySignature || !orderedItems || !userId || !amount){
            return NextResponse.json(
                { message: 'data is missing', isOk: false },
                { status: 400 }
            );
        }
        console.log("the user id recieved from frontend is",userId);

        // Verify the user exists
        const user = await client.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found', isOk: false },
                { status: 404 }
            );
        }

        const signature = generatedSignature(orderCreationId, razorpayPaymentId);
        if (signature !== razorpaySignature) {
            console.log('payment verification failed');
            return NextResponse.json(
                { message: 'payment verification failed', isOk: false },
                { status: 400 }
            );
        }

        // Create the order in the database
        const order = await prisma.order.create({
            data: {
                userId,
                total: amount,
                status: 'PENDING',
                items: {
                    create: orderedItems.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                },
                payment: {
                    create: {
                        amount,
                        status: 'COMPLETED',
                        provider: 'RAZORPAY',
                        transactionId: razorpayPaymentId
                    }
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                payment: true
            }
        });

        console.log('Order created successfully:', order);
        return NextResponse.json(
            { 
                message: 'payment verified successfully and order created', 
                isOk: true,
                order
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in verifyOrder:', error);
        return NextResponse.json(
            { message: 'Error processing payment verification', isOk: false },
            { status: 500 }
        );
    }
} 