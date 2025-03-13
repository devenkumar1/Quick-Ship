import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient
export async function GET(req:NextRequest){
try {
    const allProducts= await client.product.findMany();
if(!allProducts){
    return NextResponse.json({message:"error while fetching the products"},{status:400});
}

return NextResponse.json({message:"product fetched successffull"},{status:200});
} catch (error) {
    console.log("error occured in fetch all products",error);
    return NextResponse.json({message:"something went wrong",error:error},{status:500});
}

}