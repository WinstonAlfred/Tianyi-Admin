import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '@/lib/prisma'

// Define the Cloudinary response type
interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  [key: string]: any; // for other potential properties
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const shipmentId = formData.get('shipmentId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary with proper typing
    const response = await new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({
          resource_type: 'auto',
          folder: 'shipment-documents',
        }, 
        (error, result) => {
          if (error) reject(error)
          if (result) resolve(result)
          else reject(new Error('No result from Cloudinary'))
        })
        .end(buffer)
    })

    // Update Prisma database with document info
    const updatedShipment = await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        document_url: response.secure_url,
        document_name: file.name,
        document_type: file.type,
        uploaded_at: new Date(),
      },
    })

    return NextResponse.json(updatedShipment)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    )
  }
}