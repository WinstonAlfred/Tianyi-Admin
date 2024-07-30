import EditShipForm from "@/components/edit_form/edit-ship";
import { getShipById } from "@/lib/get/getShip";
import { notFound } from "next/navigation";

const updateShipPage = async ({params}: {params: {id: string}}) => {
  const id = params.id
  const ship = await getShipById(id);

  if(!ship) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 bg-blue-300 text-white p-2 rounded">SHIP TABLE</h1>
      <EditShipForm ship={ship} />
    </div>
  )
}

export default updateShipPage