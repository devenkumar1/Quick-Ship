import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

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
    const reqBody= await req.json()
 const { orderCreationId, razorpayPaymentId, razorpaySignature } = await reqBody;
 if(!orderCreationId || !razorpayPaymentId || !razorpaySignature){
    return NextResponse.json(
        { message: 'data is missing', isOk: false },
        { status: 400 }
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
 console.log('payment verified successfully');
 return NextResponse.json(
  { message: 'payment verified successfully', isOk: true },
  { status: 200 }
 );
}