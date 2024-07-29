import React from 'react';
import { getDetails } from '@/lib/get/getDetails';
import { CreateButton, DeleteButton, EditButton } from '../buttons';
import { deleteDetail } from '@/lib/action/detailAction';

const DetailsTable = async () => {
  const details = await getDetails();

  const getItemColor = (type: any) => {
    switch(type) {
      case 'Loading':
        return 'bg-blue-100 text-blue-800';
      case 'Unloading':
        return 'bg-green-100 text-green-800';
      case 'Daily Activities':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderArrayItems = (items: string | number | bigint | boolean | any[] | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | null | undefined, type: string) => {
    if (!Array.isArray(items)) {
      return (
        <span className={`inline-block px-2 py-1 text-xs font-semibold${getItemColor(type)}`}>
          {items}
        </span>
      );
    }
    return (
      <div className="flex flex-wrap gap-1">
        {items.map((item, index) => (
          <span 
            key={index} 
            className={`inline-block px-2 py-1 text-xs font-semibold ${getItemColor(type)}`}
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

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
              <th className="py-3 px-4">Loading</th>
              <th className="py-3 px-4">Unloading</th>
              <th className="py-3 px-4">Daily Activities</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
          {details.map((detail, index) => (
              <tr key={detail.id} className="bg-white border-b hover:bg-gray-50 transition duration-150 ease-in-out">
                <td className="py-4 px-4 font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="py-4 px-4 font-medium text-gray-900">
                  {detail.id}
                </td>
                <td className="py-4 px-4">
                  {renderArrayItems(detail.Loading, 'Loading')}
                </td>
                <td className="py-4 px-4">
                  {renderArrayItems(detail.Unloading, 'Unloading')}
                </td>
                <td className="py-4 px-4">
                  {renderArrayItems(detail.Daily_activities, 'Daily Activities')}
                </td>
                <td className="py-4 px-4">
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