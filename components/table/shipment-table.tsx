import React from 'react';
import { getShipments } from '@/lib/get/getShipment';
import { CreateButton, DeleteButton, EditButton } from '../buttons';
import { deleteShipment } from '@/lib/action/shipmentAction';

const ShipmentTable = async () => {
  const shipment = await getShipments();

  return (  
    <div>
      <div className="mb-4">
      <CreateButton targetEntity='shipment'/>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 md:text-sm">
            <tr>
              <th className="py-2 px-2 md:py-3 md:px-4">#</th>
              <th className="py-2 px-2 md:py-3 md:px-4">Shipment ID</th>
              <th className="py-2 px-2 md:py-3 md:px-4">Shipment from</th>
              <th className="py-2 px-2 md:py-3 md:px-4">Shipment destination</th>
              <th className="py-2 px-2 md:py-3 md:px-4">Product</th>
              <th className="py-2 px-2 md:py-3 md:px-4">Capacity</th>
              <th className="py-2 px-2 md:py-3 md:px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
          {shipment.map((shipment, index) => (
              <tr key={shipment.id} className="bg-white border-b hover:bg-gray-50">
                <td className="py-2 px-2 md:py-3 md:px-4 font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  {shipment.id}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  {shipment.Ship_from}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  {shipment.Ship_destination}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  {shipment.Product}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  {shipment.Capacity}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  <div className="flex justify-center gap-2">
                  <EditButton id={shipment.id} entityType='shipment'/>
                  <DeleteButton id={shipment.id} onDelete={deleteShipment}/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentTable;