export const ShipmentSkeleton = () => {
    return (
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
                <div className="h-4 w-16 rounded bg-gray-200"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 w-32 rounded bg-gray-200"></div>
              </td>
              <td className="py-3 px-4">
                <div className="h-4 w-32 rounded bg-gray-200"></div>
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
    );
  };