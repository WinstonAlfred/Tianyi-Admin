import EditShipmentForm from "@/components/edit_form/edit-shipment";
import { getShipmentsById } from "@/lib/get/getShipment";
import { notFound } from "next/navigation";

// Define the type for params
interface PageParams {
  params: {
    id: string;
  };
}

// Define the type for shipment data based on your EditShipmentForm props
interface Shipment {
  id: string;
  Status: string;
  Ship_from: string;
  Ship_destination: string;
  Product?: string[];
  Capacity?: number[];
  Description?: string[];
  document_name?: string;
  document_type?: string;
  document_url?: string;
  uploaded_at?: string;
}

const UpdateShipmentPage = async ({ params }: PageParams) => {
  const id = params.id;
  const shipment = await getShipmentsById(id);

  if (!shipment) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 bg-blue-300 text-white p-2 rounded">
        SHIPMENT TABLE
      </h1>
      <EditShipmentForm shipment={shipment as unknown as Shipment} />
    </div>
  );
};

export default UpdateShipmentPage;