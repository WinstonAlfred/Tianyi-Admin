import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const getDetails = async (query?: string, offset?: number, limit?: number) => {
  try {
    const where: Prisma.DetailWhereInput = query
      ? {
          OR: [
            { id: { contains: query, mode: 'insensitive' } },
            { Loading: { hasSome: [query] } },
            { Unloading: { hasSome: [query] } },
            { Sailing_report: { hasSome: [query] } },
            { Queue: { hasSome: [query] } },
          ],
        }
      : {};

    const details = await prisma.detail.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { id: 'asc' },
    });

    return details;
  } catch (error) {
    console.error('Error fetching details:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch details: ${error.message}`);
    } else {
      throw new Error('Failed to fetch details: Unknown error');
    }
  }
};

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