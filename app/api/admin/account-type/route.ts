import { NextResponse,NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client';

export async function  POST(req:NextRequest){
    const client= new PrismaClient;
    const reqBody= await req.json();
    const {email, userType}=reqBody;
    if(!email ||!userType){
    return NextResponse.json({message:"all fields are mandatory"});
    }
const user = await client.user.findFirst({
    where:{email:email}
})

if(!user){
    return NextResponse.json({message:"user doesn't exist"},{status:400});
}

const updateUser= await client.user.update(
    {
        where:{email:email},
        data:{
            role:userType
        }
    }
)

return NextResponse.json({message:"user profile update successfull"},{status:200});
}