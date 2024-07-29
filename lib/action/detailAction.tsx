'use server';

import { z } from "zod";
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const DetailSchema = z.object({
    id: z.string(),
    Loading: z.string(),
    Unloading: z.string(),
    Daily_activities: z.string(),
})

export const createDetail = async (prevState: any, formData: FormData) => {
    const validatedFields = DetailSchema.safeParse(
      Object.fromEntries(formData.entries())
    );
    if (!validatedFields.success) {
      return {
        Error: validatedFields.error.flatten().fieldErrors,
      };
    }
    try {
      await prisma.detail.create({
        data: validatedFields.data,
      });
    } catch (error) {
      return { message: "Failed to create activities" };
    }
    revalidatePath("/details");
    redirect("/details");
  };


  export const updateDetail = async (
    id: string,
    prevState: any,
    formData: FormData
  ) => {
    const validatedFields = DetailSchema.safeParse(
      Object.fromEntries(formData.entries())
    );
    if (!validatedFields.success) {
      return {
        Error: validatedFields.error.flatten().fieldErrors,
      };
    }
    try {
      await prisma.detail.update({
        data: validatedFields.data,
        where: { id },
      });
    } catch (error) {
      return { message: "Failed to update details" };
    }
    revalidatePath("/details");
    redirect("/details");
  };
  
  export const deleteDetail = async (id: string): Promise<void> => {
    try {
      await prisma.detail.delete({
        where: { id },
      });
      revalidatePath("/details");
    } catch (error) {
      console.error("Failed to delete details:", error);
      throw new Error("Failed to delete details");
    }
  };
  