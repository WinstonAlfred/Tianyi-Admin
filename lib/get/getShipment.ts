import { prisma } from "../prisma";

export async function getShipments() {
    try {
        const shipment = await prisma.shipment.findMany();
        return shipment;
    } catch (error) {
        console.error('Error fetching shipments', error);
        throw error;
    }
}

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