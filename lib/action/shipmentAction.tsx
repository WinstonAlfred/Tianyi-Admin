'use server';

import { z } from "zod";
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ShipmentSchema = z.object({
  id: z.string(),
  Ship_from: z.string(),
  Ship_destination: z.string(),
  Product: z.array(z.string()).optional(),
  Capacity: z.array(z.number().int()).optional(),
});

type ShipmentInput = z.infer<typeof ShipmentSchema>;

export const createShipment = async (prevState: any, formData: FormData) => {
  const rawData = Object.fromEntries(formData.entries());
  
  const shipmentData: ShipmentInput = {
    id: rawData.id as string,
    Ship_from: rawData.Ship_from as string,
    Ship_destination: rawData.Ship_destination as string,
  };

  const products = formData.getAll('Product');
  const capacities = formData.getAll('Capacity');

  if (products.length > 0) {
    shipmentData.Product = products as string[];
  }

  if (capacities.length > 0) {
    shipmentData.Capacity = capacities.map(value => parseInt(value as string, 10));
  }

  const validatedFields = ShipmentSchema.safeParse(shipmentData);

  if (!validatedFields.success) {
    return {
      Error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.shipment.create({
      data: validatedFields.data,
    });
  } catch (error) {
    return { message: "Failed to create shipment" };
  }

  revalidatePath("/shipment");
  redirect("/shipment");
};

export const updateShip = async (
  id: string,
  prevState: any,
  formData: FormData
) => {
  const rawData = Object.fromEntries(formData.entries());
  
  const shipmentData: ShipmentInput = {
    id: rawData.id as string,
    Ship_from: rawData.Ship_from as string,
    Ship_destination: rawData.Ship_destination as string,
  };

  const products = formData.getAll('Product');
  const capacities = formData.getAll('Capacity');

  if (products.length > 0) {
    shipmentData.Product = products as string[];
  }

  if (capacities.length > 0) {
    shipmentData.Capacity = capacities.map(value => parseInt(value as string, 10));
  }

  const validatedFields = ShipmentSchema.safeParse(shipmentData);

  if (!validatedFields.success) {
    return {
      Error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.shipment.update({
      where: { id },
      data: validatedFields.data,
    });
  } catch (error) {
    return { message: "Failed to update shipment" };
  }

  revalidatePath("/shipment");
  redirect("/shipment");
};

export const deleteShipment = async (id: string): Promise<void> => {
  try {
    await prisma.shipment.delete({
      where: { id },
    });
    revalidatePath("/shipment");
  } catch (error) {
    console.error("Failed to delete shipment:", error);
    throw new Error("Failed to delete shipment");
  }
};