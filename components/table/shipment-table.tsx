import React from 'react';
import { getShipments } from '@/lib/get/getShipment';
import { getDetailsById } from '@/lib/get/getDetails';
import { DeleteButton, EditButton } from '../buttons';
import { deleteShipment } from '@/lib/action/shipmentAction';
import Link from 'next/link';

const ITEMS_PER_PAGE = 5;

interface ShipmentTableProps {
  query: string;
  currentPage: number;
}

const ShipmentTable: React.FC<ShipmentTableProps> = async ({ query, currentPage }) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  console.log(`Fetching shipments with query: "${query}", offset: ${offset}, limit: ${ITEMS_PER_PAGE}`);
  
  const shipments = await getShipments(query, offset, ITEMS_PER_PAGE);
  console.log(`Fetched ${shipments.length} shipments`);

  return (  
    <div className="overflow-x-auto">
      {shipments.length === 0 ? (
        <p className="text-center py-4">No shipments found matching the search criteria.</p>
      ) : (
        <table className="w-full text-sm text-left text-gray-500 border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Shipment ID</th>
              <th className="py-3 px-4">Status</th>
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
                  {offset + index + 1}
                </td>
                <td className="py-3 px-4">
                  {shipment.id}
                </td>
                <td className="py-3 px-4">
                  {shipment.Status}
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
                      <li key={idx} className={`p-2 rounded-md ${idx % 2 === 0 ? 'bg-white' : 'bg-white'} mb-2`}>
                        <div className="font-medium text-gray-800">{product}</div>
                        <div className="text-sm text-gray-600">
                          Capacity: {shipment.Capacity[idx]} tons
                        </div>
                        <div className="text-sm text-gray-600">
                          Description: {shipment.Description?.[idx] || 'No description provided'}
                        </div>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center gap-2">
                    <EditButton id={shipment.id} entityType='shipment'/>
                    <DeleteButton id={shipment.id} onDelete={deleteShipment}/>
                    <EditDetailsButton shipmentId={shipment.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

interface EditDetailsButtonProps {
  shipmentId: string;
}

const EditDetailsButton: React.FC<EditDetailsButtonProps> = async ({ shipmentId }) => {
  const details = await getDetailsById(shipmentId);
  const href = details 
    ? `/details/edit/${details.id}` 
    : `/details/create?shipmentId=${shipmentId}`;

  return (
    <Link href={href}>
      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
        {details ? 'Edit Details' : 'Create Details'}
      </button>
    </Link>
  );
};

export default ShipmentTable;