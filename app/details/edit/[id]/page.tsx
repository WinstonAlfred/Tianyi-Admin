import EditDetailForm from "@/components/edit_form/edit-details"
import { getDetailsById } from "@/lib/get/getDetails"
import { notFound } from "next/navigation"

const updateDetailsPage = async ({params}: {params: {id: string}}) => {
  const id = params.id
  const detail = await getDetailsById(id);

  if(!detail) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 bg-blue-300 text-white p-2 rounded">SHIP TABLE</h1>
        <EditDetailForm detail={detail} />
    </div>
  )

}

export default updateDetailsPage