import { NextResponse,NextRequest } from 'next/server';

export async function POST(req:NextRequest){
const reqbody= await req.json();
const {email}=reqbody;
if(!email){
    return NextResponse.json({message:"all fields are required"});
}


}