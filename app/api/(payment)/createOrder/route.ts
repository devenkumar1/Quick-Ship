import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string
});

export async function POST(req: NextRequest) {
  const reqBody = await req.json();
  const { amount,userId,orderedItems } = reqBody;

  if (!amount) {
    return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
  }

  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `order-${Date.now()}`,
      
    };

    const order = await instance.orders.create(options);
    console.log(order);
    return NextResponse.json({ message: "Order created successfully",orderId: order.id }, { status: 200 });
  } catch (error) {
    console.error("Error occurred in creating order", error);
    return NextResponse.json({ message: "Something went wrong in creating order", error }, { status: 500 });
  }
}
