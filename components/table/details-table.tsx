import React from 'react';
import { getDetails } from '@/lib/get/getDetails';
import ClientRow from './ClientRow';

interface Detail {
  id: string;
  Loading: string[];
  Unloading: string[];
  Daily_activities: string[];
  Pickup: string[];
}

interface DetailsTableProps {
  query: string;
  currentPage: number;
}

const ITEMS_PER_PAGE = 5; // Adjust this value as needed

const DetailsTable: React.FC<DetailsTableProps> = async ({ query, currentPage }) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const details: Detail[] = await getDetails(query, offset, ITEMS_PER_PAGE);

  return (  
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Detail ID</th>
              <th className="py-3 px-4">Loading</th>
              <th className="py-3 px-4">Unloading</th>
              <th className="py-3 px-4">Daily Activities</th>
              <th className="py-3 px-4">Picking Up</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail, index) => (
              <ClientRow 
                key={detail.id} 
                detail={detail} 
                index={offset + index + 1} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailsTable;