import { NextRequest,NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const client = new PrismaClient

// Enable Next.js Route Segment Config for caching
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(req:NextRequest){
    const reqBody= await req.json();
    const {productId}=reqBody;
    if(!productId){
        return NextResponse.json({message:"productId is  mandatory"},{status:400});
    }

    try {
        const product = await client.product.findFirst({
            where:{
                id:productId
            }
        })
        if(!product) return NextResponse.json({message:"no such product exists"},{status:400});
        
        return NextResponse.json(
            {
                message:"product fetched successfully",
                product:product
            },
            {
                status:200,
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
                }
            }
        );
    } catch (error) {
        console.log("error occured in getting product route");
        return NextResponse.json({message:"something went wrong"},{status:500});
    }
}