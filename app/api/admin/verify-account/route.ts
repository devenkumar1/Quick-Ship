import { NextResponse,NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CONFIG_FILES } from "next/dist/shared/lib/constants";
const client=new PrismaClient;

export async function GET(req:NextRequest){
// try {
//     const user= await client.user.update({
//         where:{id:"cm7xeuqw20000ezr8ljl3bhzq"},
//         data:{role:"SELLER"}
//     });
//     return NextResponse.json({message:"user verified successfully to Seller",user},{status:200});
// } catch (error) {
//     console.log("error occured in verifying user",error);
//     return NextResponse.json({message:"something went wrong"},{status:500});
// }

// try {
//     const newSeller= await client.seller.create({
//         data:{
//             userId:"cm7xeuqw20000ezr8ljl3bhzq"   
//         }
//     });
    
//     return NextResponse.json({message:"user verified successfully to Seller",newSeller},{status:200});
    
// } catch (error) {
// console.log("error occured in verifying user",error);
// return NextResponse.json({message:"something went wrong"},{status:500});    
// }

try {
    const newShop= await client.shop.create({
        data:{
            name:"test shop",
            sellerId:1,
        }
    })
    return NextResponse.json({message:"shop created successfully",newShop},{status:200});
} catch (error) {
    console.log("error occured in creating a shop",error);
    return NextResponse.json({message:"something went wrong"},{status:500});
}

}