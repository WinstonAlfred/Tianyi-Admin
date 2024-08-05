'use server';

import { z } from "zod";
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const DetailSchema = z.object({
    id: z.string(),
    Loading: z.array(z.string()).optional(),
    Unloading: z.array(z.string()).optional(),
    Daily_activities: z.array(z.string()).optional(),
});

const ITEMS_PER_PAGE = 5; // Adjust this value as needed

export const createDetail = async (prevState: any, formData: FormData) => {
    // Extract arrays from FormData
    const loading = formData.getAll('Loading');
    const unloading = formData.getAll('Unloading');
    const dailyActivities = formData.getAll('Daily_activities');

    const data = {
        id: formData.get('id'),
        Loading: loading,
        Unloading: unloading,
        Daily_activities: dailyActivities,
    };

    const validatedFields = DetailSchema.safeParse(data);
    
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
        return { message: "Failed to create detail" };
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
        console.error("Failed to delete detail:", error);
        throw new Error("Failed to delete detail");
    }
};




export const updateDetail = async (
    id: string,
    prevState: any,
    formData: FormData
) => {
    // Extract arrays from FormData
    const loading = formData.getAll('Loading');
    const unloading = formData.getAll('Unloading');
    const dailyActivities = formData.getAll('Daily_activities');

    const data = {
        id: formData.get('id'),
        Loading: loading,
        Unloading: unloading,
        Daily_activities: dailyActivities,
    };

    const validatedFields = DetailSchema.safeParse(data);

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
        return { message: "Failed to update detail" };
    }

    revalidatePath("/details");
    redirect("/details");
};



export const getDetailPages = async (query: string) => {
  try {
    const details = await prisma.detail.count({
      where: {
        OR: [
          {
            id: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            Loading: {
              hasSome: [query],
            },
          },
          {
            Unloading: {
              hasSome: [query],
            },
          },
          {
            Daily_activities: {
              hasSome: [query],
            },
          },
        ],
      },
    });
    const totalPages = Math.ceil(Number(details) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Failed to fetch detail data:", error);
    throw new Error("Failed to fetch detail data");
  }
};