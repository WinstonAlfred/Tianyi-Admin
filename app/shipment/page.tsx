import ShipmentTable from "@/components/table/shipment-table";
import Search from "@/components/search";
import Pagination from "@/components/pagination";
import { CreateButton } from "@/components/buttons";
import { getShipmentPages } from "@/lib/action/shipmentAction";
import { Suspense } from "react";
import { ShipmentSkeleton } from "@/components/skeleton/shipmentSkeleton";


export const dynamic = 'force-dynamic';

const Shipments = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await getShipmentPages(query);

  return (
    <div className="max-w-screen-xl mx-auto mt-5">
      <div className="flex flex-col items-start gap-1 mb-5 w-full">
        <CreateButton targetEntity="shipment" /> 
        <Search />
      </div>

      <Suspense key={query + currentPage} fallback={<ShipmentSkeleton />}>
      <ShipmentTable query={query} currentPage={currentPage} />
      </Suspense>

      <div className="flex justify-center mt-4">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default Shipments;