'use client';

import { createShipment } from "@/lib/action/shipmentAction";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/buttons";


const ShipmentForm = () => {
  const [state, formAction] = useFormState(createShipment, null);

  return (
    <div>
      <form action={formAction}>

      <div className="mb-5">
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-900"
          >
            Shipment ID
          </label>
          <input
            type="text"
            name="id"
            id="id"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Shipment ID..."
          />
          <div id="id-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">{state?.Error?.id}</p>
          </div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="Ship_from"
            className="block text-sm font-medium text-gray-900"
          >
            Shipment From
          </label>
          <input
            type="text"
            name="Ship_from"
            id="Ship_from"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Shipment from..."
          />
          <div id="Ship_from-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">{state?.Error?.Ship_from}</p>
          </div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="Ship_destination"
            className="block text-sm font-medium text-gray-900"
          >
            Shipment Destination
          </label>
          <input
            type="text"
            name="Ship_destination"
            id="Ship_destination"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Shipment destination..."
          />
          <div id="Ship_destination-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">{state?.Error?.Ship_destination}</p>
          </div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="Product"
            className="block text-sm font-medium text-gray-900"
          >
            Product Name
          </label>
          <input
            type="text"
            name="Product"
            id="Product"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Product Name..."
          />
          <div id="Product-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">{state?.Error?.Product}</p>
          </div>
        </div>

        <div className="mb-5">
                <label 
                htmlFor="Capacity"
                className="block text-sm font-medium text-gray-900"
                >
                Capacity
                </label>
                <input 
                    type="text"
                    name="Capacity"
                    id="Capacity"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Product Capacity.."
                />
                <div id="Capacity-error" aria-live="polite" aria-atomic="true">
                    <p className="mt-2 text-sm text-red-500">{state?.Error?.Capacity}</p>
                </div>
            </div>

        <SubmitButton label="save" />
      </form>
    </div>
  );
};

export default ShipmentForm;