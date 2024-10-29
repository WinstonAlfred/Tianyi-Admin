import React from 'react';
import { getShipments } from '@/lib/get/getShipment';
import { getDetailsById } from '@/lib/get/getDetails';
import { DeleteButton, EditButton } from '../buttons';
import { deleteShipment } from '@/lib/action/shipmentAction';
import Link from 'next/link';
import { FileText } from 'lucide-react';

const ITEMS_PER_PAGE = 5;

interface Shipment {
  id: string;
  Status: string;
  Ship_from: string;
  Ship_destination: string;
  Product: string[];
  Capacity: number[];
  Description: string[];
  document_name: string | null;
  document_type: string | null;
  document_url: string | null;
  uploaded_at: Date | null;
}

interface ShipmentTableProps {
  query?: string;
  currentPage?: number;
  initialShipments?: Shipment[];
}

const ShipmentTable: React.FC<ShipmentTableProps> = async ({ query = "", currentPage = 1, initialShipments }) => {
  let shipments: Shipment[];

  if (initialShipments) {
    shipments = initialShipments;
  } else {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    console.log(`Fetching shipments with query: "${query}", offset: ${offset}, limit: ${ITEMS_PER_PAGE}`);
    shipments = await getShipments(query, offset, ITEMS_PER_PAGE);
  }

  console.log(`Displaying ${shipments.length} shipments`);

  return (  
    <div className="overflow-x-auto">
      {shipments.length === 0 ? (
        <p className="text-center py-4">No shipments found.</p>
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
              <th className="py-3 px-4">Documents</th>
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
                      <li key={idx} className="p-2 rounded-md bg-white mb-2">
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
                  {shipment.document_url ? (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <a 
                        href={shipment.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 hover:underline"
                      >
                        {shipment.document_name}
                      </a>
                      <span className="text-xs text-gray-500">
                        ({shipment.uploaded_at ? new Date(shipment.uploaded_at).toLocaleDateString() : 'Date not available'})
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">No documents</span>
                  )}
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
      <button className="bg-white hover:bg-white text-black font-bold py-2 px-4 rounded">
        {details ? 'Edit Details' : 'Create Details'}
      </button>
    </Link>
  );
};

export default ShipmentTable;