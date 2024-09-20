import React from 'react';
import { getShipmentsByShipName } from '@/lib/get/getShipment';
import ShipmentTable from '@/components/table/shipment-table';
import { CreateButton } from '@/components/buttons';

export default async function ShipShipmentsPage({ params }: { params: { id: string } }) {
  const shipName = params.id;
  let shipments: string | any[] | undefined = [];
  let error = null;

  try {
    shipments = await getShipmentsByShipName(shipName);
    if (shipments.length === 0) {
      error = `No shipments found for ship: ${shipName}`;
    }
  } catch (err) {
    console.error('Error fetching shipments:', err);
    error = 'Error fetching shipment data';
  }

  return (
    <div className="container mx-auto px-4 py-8">
    <CreateButton targetEntity="shipment" /> 
      <h1 className="text-2xl font-bold mb-4">Shipments for {shipName}</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ShipmentTable initialShipments={shipments} />
      )}
    </div>
  );
}