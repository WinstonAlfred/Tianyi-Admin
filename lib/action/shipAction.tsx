'use server';

import { z } from "zod";
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ShipSchema = z.object({
    id: z.string(),
});

export const createShip = async (prevState: any, formData: FormData) => {
    const validatedFields = ShipSchema.safeParse(
      Object.fromEntries(formData.entries())
    );
    if (!validatedFields.success) {
      return {
        Error: validatedFields.error.flatten().fieldErrors,
      };
    }
    try {
      await prisma.ship.create({
        data: validatedFields.data,
      });
    } catch (error) {
      return { message: "Failed to create activities" };
    }
    revalidatePath("/activities");
    redirect("/activities");
  };


  export const updateShip = async (
    id: string,
    prevState: any,
    formData: FormData
  ) => {
    const validatedFields = ShipSchema.safeParse(
      Object.fromEntries(formData.entries())
    );
    if (!validatedFields.success) {
      return {
        Error: validatedFields.error.flatten().fieldErrors,
      };
    }
    try {
      await prisma.ship.update({
        data: validatedFields.data,
        where: { id },
      });
    } catch (error) {
      return { message: "Failed to update activities" };
    }
    revalidatePath("/ship");
    redirect("/ship");
  };
  
  export const deleteShip = async (id: string): Promise<void> => {
    try {
      await prisma.ship.delete({
        where: { id },
      });
      revalidatePath("/activities");
    } catch (error) {
      console.error("Failed to delete shipment:", error);
      throw new Error("Failed to delete shipment");
    }
  };
  