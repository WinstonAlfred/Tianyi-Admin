import DetailsTable from "@/components/table/details-table";
import Search from "@/components/search";
import Pagination from "@/components/pagination";
import { CreateButton } from "@/components/buttons";
import { getDetailPages } from "@/lib/action/detailAction";
import { Suspense } from "react";
import { DetailSkeleton } from "@/components/skeleton/detailSkeleton";

export const dynamic = 'force-dynamic';

const Details = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await getDetailPages(query);

  return (
    <div className="max-w-screen-xl mx-auto mt-5">
      <div className="flex flex-col items-start gap-1 mb-5 w-full">
        <CreateButton targetEntity="details" /> 
        <Search />
      </div>

        <Suspense key={query + currentPage} fallback={<DetailSkeleton />}>
        <DetailsTable query={query} currentPage={currentPage} />
        </Suspense>

      <div className="flex justify-center mt-4">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
};

export default Details;