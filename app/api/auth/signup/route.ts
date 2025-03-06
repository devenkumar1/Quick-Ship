import { NextRequest,NextResponse } from "next/server";
import {PrismaClient}   from '@prisma/client'
import bcrypt from "bcryptjs";
const client= new PrismaClient;
export  async function POST(req:NextRequest){
    const reqBody= await req.json();
    const{name,email,password}= reqBody;
    if(!name||!password||!email){
        return NextResponse.json({message:"all fields are mandatory"},{status:400});
    }
    const user= await client.user.findUnique({where:{email:email}});
    if(user){
        return NextResponse.json({message:"user already exist"},{status:403});
    }
    try {
        const salt= await bcrypt.genSalt(16);
         const hashedPassword= await bcrypt.hash(password,salt);

        const newUser= await client.user.create({
            data:{
               name,
               email,
               password:hashedPassword
            },
            select:{id:true,name:true,email:true,role:true}
        });
        console.log("new user created successfully",newUser);
        return NextResponse.json({message:"user created successfully"},{status:201});
    } catch (error) {
        console.log("error occured in user signup",error);
        return NextResponse.json({message:"something went wrong"},{status:500});
    }

}

