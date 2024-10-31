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
        select: {
          id: true,
          Status: true,
          Ship_from: true,
          Ship_destination: true,
          Product: true,
          Capacity: true,
          Description: true,
          document_name: true,
          document_type: true,
          document_url: true,
          uploaded_at: true,
        },
        skip: offset,
        take: limit,
        orderBy: { id: 'asc' },
      });

      console.log('Fetched shipments:', shipments); // Debug log

      return shipments;
    } catch (error) {
      console.error('Error fetching shipments:', error);
      throw new Error('Failed to fetch shipments');
    }
};

export async function getShipmentsById(id: string) {
    try {
        const shipment = await prisma.shipment.findUnique({
            where: { id },
        });
        return shipment;
    } catch (error) {
        console.error(`Error fetching shipment with ID ${id}:`, error);
        throw error;
    }
}

export async function getShipmentsByShipName(shipName: string) {
    try {
        const shipments = await prisma.shipment.findMany({
            where: {
                id: {
                    startsWith: shipName,
                    mode: 'insensitive'
                }
            },
            orderBy: { id: 'asc' },
        });
        return shipments;
    } catch (error) {
        console.error(`Error fetching shipments for ship ${shipName}:`, error);
        throw new Error(`Failed to fetch shipments for ship ${shipName}`);
    }
}