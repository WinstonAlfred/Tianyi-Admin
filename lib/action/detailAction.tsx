'use server';

import { z } from "zod";
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const DetailSchema = z.object({
    id: z.string(),
    loading: z.string(),
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
