import EditShipmentForm from "@/components/edit_form/edit-shipment";
import { getShipmentsById } from "@/lib/get/getShipment";
import { notFound } from "next/navigation";

const UpdateShipmentPage = async ({params}: {params: {id: string}}) => {
  const id = params.id
  const shipment = await getShipmentsById(id);

  if(!shipment) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 bg-blue-300 text-white p-2 rounded">SHIPMENT TABLE</h1>
            <EditShipmentForm shipment={shipment} />
        </div>
  )
}

export default UpdateShipmentPage