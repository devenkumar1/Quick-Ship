import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma= new PrismaClient;  

export async function GET(){
  const allapplication= await prisma.sellerApplication.findMany();
if(!allapplication){
  return NextResponse.json({message:"no applications found"},{status:400});
}
return NextResponse.json({message:"successfully fetched applications",applications:allapplication},{status:200});
}