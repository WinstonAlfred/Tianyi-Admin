import { prisma } from "../prisma";

export async function getDetails() {
    try {
        const details = await prisma.detail.findMany();
        return details;
    } catch (error) {
        console.error('Error fetching details', error);
        throw error;
    }
}

export async function getDetailsById (id: string) {
    try {
        const details = await prisma.detail.findUnique({
            where:{ id },
            });
            return details;
    } catch (error) {
        console.error('Error fetching Details with ID ${id}:', error);
        throw error;
    }
}