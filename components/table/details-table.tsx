// DetailsTable.tsx
import React from 'react';
import { getDetails } from '@/lib/get/getDetails';
import { CreateButton } from '../buttons';
import ClientRow from './ClientRow';

interface Detail {
  id: string;
  Loading: string[];
  Unloading: string[];
  Daily_activities: string[];
}

const DetailsTable: React.FC = async () => {
  const details: Detail[] = await getDetails();

  return (  
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <CreateButton targetEntity='details'/>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Detail ID</th>
              <th className="py-3 px-4">Loading details</th>
              <th className="py-3 px-4">Unloading details</th>
              <th className="py-3 px-4">Daily Activities details</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {details.map((detail, index) => (
              <ClientRow key={detail.id} detail={detail} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailsTable;