import { prisma } from "../prisma";

export const getShipments = async (query: string, offset: number, limit: number) => {
    try {
      const shipments = await prisma.shipment.findMany({
        where: {
          OR: [
            { id: { contains: query, mode: 'insensitive' } },
            { Status: { contains: query, mode: 'insensitive' } },
            { Ship_from: { contains: query, mode: 'insensitive' } },
            { Ship_destination: { contains: query, mode: 'insensitive' } },
            { Product: { hasSome: [query] } },
          ],
        },
        skip: offset,
        take: limit,
        orderBy: { id: 'asc' },
      });
      return shipments;
    } catch (error) {
      console.error('Error fetching shipments:', error);
      throw new Error('Failed to fetch shipments');
    }
  };

export async function getShipmentsById (id: string) {
    try {
        const shipment = await prisma.shipment.findUnique({
            where:{ id },
            });
            return shipment;
    } catch (error) {
        console.error('Error fetching shipments with ID ${id}:', error);
        throw error;
    }
}