import { prisma } from "../prisma";

export async function getShip() {
    try {
        const ship = await prisma.ship.findMany();
        return ship;
    } catch (error) {
        console.error('Error fetching ships', error);
        throw error;
    }
}

export async function getShipById (id: string) {
    try {
        const ship = await prisma.ship.findUnique({
            where:{ id },
            });
            return ship;
    } catch (error) {
        console.error('Error fetching Ships with ID ${id}:', error);
        throw error;
    }
}