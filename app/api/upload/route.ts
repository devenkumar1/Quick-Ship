import { NextResponse, NextRequest } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    //unique filename 
    const uniqueFilename = `${uuidv4()}-${file.name.replace(/\s+/g, '_')}`;
    
    // Convert File to buffer for direct upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use promise-based approach for Cloudinary upload
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        folder: "Quickship",
        resource_type: "auto",
        public_id: uniqueFilename,
      }, (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(NextResponse.json({ error: "File upload failed" }, { status: 500 }));
          return;
        }
        resolve(NextResponse.json({
          message: "File uploaded successfully",
          url: result?.secure_url,
          public_id: result?.public_id
        }));
      }).end(buffer);
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
