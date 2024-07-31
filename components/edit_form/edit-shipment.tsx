'use client';

import { updateShipment } from "@/lib/action/shipmentAction";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/buttons";
import { useState, useEffect } from 'react';
import { PlusCircle, XCircle } from 'lucide-react';

interface EditShipmentFormProps {
  shipment: {
    id: string;
    Status: string;
    Ship_from: string;
    Ship_destination: string;
    Product?: string[];
    Capacity?: number[];
    Description?: string[];
  };
}

const EditShipmentForm: React.FC<EditShipmentFormProps> = ({ shipment }) => {
  const [state, formAction] = useFormState(updateShipment.bind(null, shipment.id), null);
  const [products, setProducts] = useState<{ Product: string; Capacity: string; Description: string }[]>([]);

  useEffect(() => {
    if (shipment.Product && shipment.Capacity && shipment.Description) {
      const initialProducts = shipment.Product.map((product, index) => ({
        Product: product,
        Capacity: shipment.Capacity?.[index]?.toString() || '',
        Description: shipment.Description?.[index] || ''
      }));
      setProducts(initialProducts);
    }
  }, [shipment]);

  const addProduct = () => {
    setProducts([...products, { Product: '', Capacity: '', Description: '' }]);
  };

  const removeProduct = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    const newProducts = [...products];
    newProducts[index][field as keyof typeof newProducts[0]] = value;
    setProducts(newProducts);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    products.forEach((product, index) => {
      formData.append(`Product`, product.Product);
      formData.append(`Capacity`, product.Capacity);
      formData.append(`Description`, product.Description);
    });
    formAction(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
            defaultValue={shipment.id}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Shipment ID..."
            readOnly
          />
          <div id="id-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">{state?.Error?.id}</p>
          </div>
        </div>

        <div className="mb-5">
          <label
            htmlFor="Status"
            className="block text-sm font-medium text-gray-900"
          >
            Shipment Status
          </label>
          <select
            name="Status"
            id="Status"
            defaultValue={shipment.Status}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select a status...</option>
            <option value="GO TO PROYEK">Go To Proyek</option>
            <option value="RETURN FROM PROYEK">Return From Proyek</option>
          </select>
          <div id="Status-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">{state?.Error?.Status}</p>
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
            defaultValue={shipment.Ship_from}
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
            defaultValue={shipment.Ship_destination}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Shipment destination..."
          />
          <div id="Ship_destination-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">{state?.Error?.Ship_destination}</p>
          </div>
        </div>

        {products.map((product, index) => (
          <div key={index} className="mb-5 flex items-end space-x-2">
            <div className="flex-grow">
              <label
                htmlFor={`Product_${index}`}
                className="block text-sm font-medium text-gray-900"
              >
                Product Name
              </label>
              <input
                type="text"
                id={`Product_${index}`}
                value={product.Product}
                onChange={(e) => handleProductChange(index, 'Product', e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Product Name..."
              />
            </div>
            <div className="flex-grow">
              <label
                htmlFor={`Capacity_${index}`}
                className="block text-sm font-medium text-gray-900"
              >
                Capacity
              </label>
              <input
                type="number"
                id={`Capacity_${index}`}
                value={product.Capacity}
                onChange={(e) => handleProductChange(index, 'Capacity', e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Product Capacity..."
              />
            </div>
            <div className="flex-grow">
              <label
                htmlFor={`Description_${index}`}
                className="block text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <input
                type="text"
                id={`Description_${index}`}
                value={product.Description}
                onChange={(e) => handleProductChange(index, 'Description', e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Product Description..."
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeProduct(index)}
                className="p-2.5 text-red-500 hover:text-red-700"
              >
                <XCircle size={20} />
              </button>
            )}
            {index === products.length - 1 && (
              <button
                type="button"
                onClick={addProduct}
                className="p-2.5 text-blue-500 hover:text-blue-700"
              >
                <PlusCircle size={20} />
              </button>
            )}
          </div>
        ))}

        <SubmitButton label="Update Shipment" />
      </form>
    </div>
  );
};

export default EditShipmentForm;