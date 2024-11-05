'use server';

import { z } from "zod";
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ShipmentSchema = z.object({
  id: z.string(),
  Status: z.string(),
  Ship_from: z.string(),
  Ship_destination: z.string(),
  Product: z.array(z.string()).optional(),
  Capacity: z.array(z.number().int()).optional(),
  Description: z.array(z.string()).optional(),
  document_name: z.string().optional(),
  document_type: z.string().optional(),
  document_url: z.string().optional(),
  uploaded_at: z.date().optional(),
});

type ShipmentInput = z.infer<typeof ShipmentSchema>;

const ITEMS_PER_PAGE = 5;

export const createShipment = async (prevState: any, formData: FormData) => {
  const rawData = Object.fromEntries(formData.entries());
  
  // Debug log
  console.log('Raw form data:', rawData);
  
  const shipmentData: ShipmentInput = {
    id: rawData.id as string,
    Status: rawData.Status as string,
    Ship_from: rawData.Ship_from as string,
    Ship_destination: rawData.Ship_destination as string,
  };

  // Handle arrays
  const products = formData.getAll('Product');
  const capacities = formData.getAll('Capacity');
  const descriptions = formData.getAll('Description');

  if (products.length > 0) {
    shipmentData.Product = products as string[];
  }

  if (capacities.length > 0) {
    shipmentData.Capacity = capacities.map(value => parseInt(value as string, 10));
  }

  if (descriptions.length > 0) {
    shipmentData.Description = descriptions as string[];
  }

  // Handle document data if present - Add debug logging
  console.log('Document URL from form:', rawData.document_url);
  if (rawData.document_url) {
    shipmentData.document_url = rawData.document_url as string;
    shipmentData.document_name = rawData.document_name as string;
    shipmentData.document_type = rawData.document_type as string;
    shipmentData.uploaded_at = new Date();
  }

  // Debug log
  console.log('Shipment data before validation:', shipmentData);

  const validatedFields = ShipmentSchema.safeParse(shipmentData);

  if (!validatedFields.success) {
    console.log('Validation errors:', validatedFields.error.flatten().fieldErrors);
    return {
      Error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const created = await prisma.shipment.create({
      data: validatedFields.data,
    });
    console.log('Created shipment:', created);
  } catch (error) {
    console.error('Creation error:', error);
    return { message: "Failed to create shipment" };
  }

  revalidatePath("/shipment");
  redirect("/shipment");
};

export const updateShipment = async (id: string, prevState: any, formData: FormData) => {
  const rawData = Object.fromEntries(formData.entries());
  
  const shipmentData: ShipmentInput = {
    id: id,
    Status: rawData.Status as string,
    Ship_from: rawData.Ship_from as string,
    Ship_destination: rawData.Ship_destination as string,
  };

  // Handle arrays
  const products = formData.getAll('Product');
  const capacities = formData.getAll('Capacity');
  const descriptions = formData.getAll('Description');

  if (products.length > 0) {
    shipmentData.Product = products as string[];
  }

  if (capacities.length > 0) {
    shipmentData.Capacity = capacities.map(value => parseInt(value as string, 10));
  }

  if (descriptions.length > 0) {
    shipmentData.Description = descriptions as string[];
  }

  // Handle document data if present
  // Check if there's a new document uploaded (Cloudinary URL present)
  if (rawData.document_url) {
    // Include document-related fields in the shipment data
    const documentUpdate = {
      document_url: rawData.document_url as string,
      document_name: rawData.document_name as string,
      document_type: rawData.document_type as string,
      uploaded_at: new Date(),
    };
    
    // Merge document data with shipment data
    Object.assign(shipmentData, documentUpdate);
  }

  const validatedFields = ShipmentSchema.safeParse(shipmentData);

  if (!validatedFields.success) {
    return {
      Error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Update shipment with all data including document information
    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: {
        ...validatedFields.data,
        // Ensure document fields are explicitly included in the update
        ...(rawData.document_url && {
          document_url: rawData.document_url as string,
          document_name: rawData.document_name as string,
          document_type: rawData.document_type as string,
          uploaded_at: new Date(),
        }),
      },
    });

    if (!updatedShipment) {
      throw new Error('Failed to update shipment');
    }

  } catch (error) {
    console.error('Error updating shipment:', error);
    return { message: "Failed to update shipment" };
  }

  revalidatePath("/shipment");
  redirect("/shipment");
};

export const deleteShipment = async (id: string): Promise<void> => {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      select: { document_url: true }
    });

    // If there's a document, delete it from Cloudinary
    if (shipment?.document_url) {
      // Extract public_id from the Cloudinary URL
      const urlParts = shipment.document_url.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = `shipment-documents/${publicIdWithExtension.split('.')[0]}`;

      try {
        await fetch(`/api/shipment/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ public_id: publicId }),
        });
      } catch (error) {
        console.error('Error deleting document from Cloudinary:', error);
      }
    }

    await prisma.shipment.delete({
      where: { id },
    });
    
    revalidatePath("/shipment");
  } catch (error) {
    console.error("Failed to delete shipment:", error);
    throw new Error("Failed to delete shipment");
  }
};

export const getShipmentPages = async (query: string) => {
  try {
    const shipments = await prisma.shipment.count({
      where: {
        OR: [
          { id: { contains: query, mode: "insensitive" } },
          { Status: { contains: query, mode: "insensitive" } },
          { Ship_from: { contains: query, mode: "insensitive" } },
          { Ship_destination: { contains: query, mode: "insensitive" } },
          { Product: { hasSome: [query] } },
          { document_name: { contains: query, mode: "insensitive" } },
        ],
      },
    });
    
    const totalPages = Math.ceil(Number(shipments) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Failed to fetch shipment data:", error);
    throw new Error("Failed to fetch shipment data");
  }
};