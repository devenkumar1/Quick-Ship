import { NextRequest,NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient;
export async function POST(req:NextRequest) {
    const reqBody=await req.json();
    const {name, price,shopId}=reqBody ;
    if(!name ||!price ||!shopId){
        return NextResponse.json({message:"all fileds are mandatory"},{status:400});
    }
    try {
    const newProduct= await client.product.create({
        data:{
          name:name,
          price:price,
          shopId:shopId
         }
    })
    
    return NextResponse.json({message:"new product added "},{status:200});
    
} catch (error) {
 console.log("Error occured in adding a product",error);
 return NextResponse.json({message:"something went wrong "},{status:500});   
}

}

export async function GET(req:NextRequest){

try {
    const allProducts= await client.product.findMany();
    if(!allProducts){
        return NextResponse.json({messgae:"failed to get the products"},{status:400});
    }
} catch (error) {
    console.log("Error occured while fetching all products",error);
    return NextResponse.json({message:"something went wrong"},{status:500});
}
}


export async function DELETE(req:NextRequest){
    const reqBody= await req.json();
    const {productId}= reqBody ;
    if(!productId){
        return NextResponse.json({message:"all fields are mandatory"},{status:400});
    }
    try {
        const deletedProduct= await client.product.delete({
            where:{id:productId}
        })
        return NextResponse.json({message:"deleted the product"},{status:200});
    } catch (error) {
        return NextResponse.json({mesage:"something went wrong"},{status:500});
    }
}


export async function UPDATE(req:NextRequest){
const reqBody= await req.json();
const {ProductId,updatedInfo}= reqBody;
if(!ProductId){
    return NextResponse.json({message:"all fields are mandatory"},{status:400})
}
try {
    
const selectedProduct= await client.product.update({
    where:{id:ProductId},
    data:{
     
    }
})
if(!selectedProduct){
    return NextResponse.json({message:"no product found"},{status:400});
}

return NextResponse.json({message:"product updated successfully"},{status:200});

} catch (error) {
console.log("error occured in updating products");
return NextResponse.json({message:"something went wrong"},{status:500});    
}
}