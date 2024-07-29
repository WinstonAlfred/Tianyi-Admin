import React from 'react';
import { getShipments } from '@/lib/get/getShipment';
import { CreateButton, DeleteButton, EditButton } from '../buttons';
import { deleteShipment } from '@/lib/action/shipmentAction';

const ShipmentTable = async () => {
  const shipments = await getShipments();

  return (  
    <div>
      <div className="mb-4">
        <CreateButton targetEntity='shipment'/>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Shipment ID</th>
              <th className="py-3 px-4">Shipment from</th>
              <th className="py-3 px-4">Shipment destination</th>
              <th className="py-3 px-4">Products</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
          {shipments.map((shipment, index) => (
              <tr key={shipment.id} className="bg-white border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="py-3 px-4">
                  {shipment.id}
                </td>
                <td className="py-3 px-4">
                  {shipment.Ship_from}
                </td>
                <td className="py-3 px-4">
                  {shipment.Ship_destination}
                </td>
                <td className="py-3 px-4">
                  <ul className="list-none p-0 m-0">
                    {shipment.Product.map((product, idx) => (
                      <li key={idx} className={`p-2 rounded-md ${idx % 2 === 0 ? 'bg-blue-50' : 'bg-green-50'}`}>
                        <span className="font-medium text-gray-800">{product}</span>
                        <span className="ml-2 text-sm text-gray-600">
                          ({shipment.Capacity[idx]} tons)
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-3 px-4">
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