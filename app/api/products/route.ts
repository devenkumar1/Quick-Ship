import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
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
    }, { status: 200 });
  } catch (error) {
    console.log("Error occurred in fetch all products", error);
    return NextResponse.json({ message: "Something went wrong", error: error }, { status: 500 });
  }
}