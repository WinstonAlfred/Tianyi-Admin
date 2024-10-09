import React from 'react';

export const DetailSkeleton = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Detail ID</th>
              <th className="py-3 px-4">Queue</th>
              <th className="py-3 px-4">Loading</th>
              <th className="py-3 px-4">Unloading</th>
              <th className="py-3 px-4">Sailing Report</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="animate-pulse">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="h-4 w-4 rounded bg-gray-200"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="h-4 w-24 rounded bg-gray-200"></div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center gap-2">
                    <div className="h-7 w-7 rounded-sm bg-gray-200"></div>
                    <div className="h-7 w-7 rounded-sm bg-gray-200"></div>
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