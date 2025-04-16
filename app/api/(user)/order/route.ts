import { NextResponse,NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const client= new PrismaClient

export  async function POST(req:NextRequest){
    const reqBody= await req.json();
    const {productId,userId,quantity}=reqBody;
    if(!productId ||!userId || !quantity){
        return NextResponse.json({message:"invalid product or user"},{status:400});
    }

    try {
const currentProduct= await client.product.findFirst({
    where:{
        id:productId
    }
  })
    
if(!currentProduct){
    return NextResponse.json({mesage:"invalid product"},{status:400});
}

const newOrder= await client.orderItem.create({
    data:{
        price:currentProduct.price,
        productId:productId,
        quantity:quantity
    }
})
return NextResponse.json({message:"order created successfully",order:newOrder},{status:201});
        
    } catch (error) {
        console.log("error in order route",error);
        return NextResponse
         .json({message:"something went wrong in creating order",error:error},
        {status:500});
    }

}