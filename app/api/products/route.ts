import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

// Enable Next.js Route Segment Config for caching
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(req: NextRequest) {
  try {
    const allProducts = await client.product.findMany({
      include: {
        shop: true,
        reviews: true
      }
    });
    
    if (!allProducts || allProducts.length === 0) {
      return NextResponse.json({ message: "No products found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Products fetched successfully", 
      products: allProducts 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
      }
    });
  } catch (error) {
    console.log("Error occurred in fetch all products", error);
    return NextResponse.json({ message: "Something went wrong", error: error }, { status: 500 });
  }
}