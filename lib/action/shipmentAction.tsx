'use server';

import { z } from "zod";
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ShipmentSchema = z.object({
    id: z.string(),
    Ship_from: z.string(),
    Ship_destination: z.string(),
    Product: z.string(),
    Capacity: z.number().int(),
});

export const createShipment = async (prevState: any, formData: FormData) => {
    const validatedFields = ShipmentSchema.safeParse({
      ...Object.fromEntries(formData.entries()),
      Capacity: parseInt(formData.get('Capacity') as string, 10),
      });
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
    const validatedFields = ShipmentSchema.safeParse(
      Object.fromEntries(formData.entries())
    );
    if (!validatedFields.success) {
      return {
        Error: validatedFields.error.flatten().fieldErrors,
      };
    }
    try {
      await prisma.shipment.update({
        data: validatedFields.data,
        where: { id },
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
  