import React from 'react';
import { getDetails } from '@/lib/get/getDetails';
import { CreateButton, DeleteButton, EditButton } from '../buttons';
import { deleteDetail } from '@/lib/action/detailAction';

const DetailsTable = async () => {
  const detail = await getDetails();

  return (  
    <div>
      <div className="mb-4">
        <CreateButton targetEntity='details'/>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 md:text-sm">
            <tr>
              <th className="py-2 px-2 md:py-3 md:px-4">#</th>
              <th className="py-2 px-2 md:py-3 md:px-4">Detail ID</th>
              <th className="py-2 px-2 md:py-3 md:px-4">Loading</th>
              <th className="py-2 px-2 md:py-3 md:px-4">Unloading</th>
              <th className="py-2 px-2 md:py-3 md:px-4">Daily Activities</th>
              <th className="py-2 px-2 md:py-3 md:px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
          {detail.map((detail, index) => (
              <tr key={detail.id} className="bg-white border-b hover:bg-gray-50">
                <td className="py-2 px-2 md:py-3 md:px-4 font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  {detail.id}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  {detail.Loading}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  {detail.Unloading}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  {detail.Daily_activities}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  <div className="flex justify-center gap-2">
                  <EditButton id={detail.id} entityType='details'/>
                  <DeleteButton id={detail.id} onDelete={deleteDetail}/>
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

export default DetailsTable;