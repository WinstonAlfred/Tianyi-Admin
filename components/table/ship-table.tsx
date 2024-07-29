import React from 'react';
import { getShip } from '@/lib/get/getShip';
import { CreateButton, DeleteButton, EditButton } from '../buttons';
import { deleteShip } from '@/lib/action/shipAction';

const ShipTable = async () => {
  const ship = await getShip();

  return (  
    <div>
      <div className="mb-4">
        <CreateButton targetEntity='ship'/>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 md:text-sm">
            <tr>
              <th className="py-2 px-2 md:py-3 md:px-4">#</th>
              <th className="py-2 px-2 md:py-3 md:px-4">Ship Name</th>
              <th className="py-2 px-2 md:py-3 md:px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
          {ship.map((ship, index) => (
              <tr key={ship.id} className="bg-white border-b hover:bg-gray-50">
                <td className="py-2 px-2 md:py-3 md:px-4 font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  {ship.id}
                </td>
                <td className="py-2 px-2 md:py-3 md:px-4">
                  <div className="flex justify-center gap-2">
                    <EditButton id={ship.id} entityType='ship'/>
                    <DeleteButton id={ship.id} onDelete={deleteShip}/>
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

export default ShipTable;