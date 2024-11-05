'use client';

import { updateShipment } from "@/lib/action/shipmentAction";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/buttons";
import { useState, useEffect } from 'react';
import { PlusCircle, XCircle, Upload, Loader2 } from 'lucide-react';

interface EditShipmentFormProps {
  shipment: {
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
  };
}

const EditShipmentForm: React.FC<EditShipmentFormProps> = ({ shipment }) => {
  const [state, formAction] = useFormState(updateShipment.bind(null, shipment.id), null);
  const [products, setProducts] = useState<{ Product: string; Capacity: string; Description: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    document_name: string;
    document_type: string;
    document_url: string;
    uploaded_at: string;
  } | null>(null);

  useEffect(() => {
    // Initialize products
    if (shipment.Product && shipment.Capacity && shipment.Description) {
      const initialProducts = shipment.Product.map((product, index) => ({
        Product: product,
        Capacity: shipment.Capacity?.[index]?.toString() || '',
        Description: shipment.Description?.[index] || ''
      }));
      setProducts(initialProducts);
    }

    // Initialize uploaded file if exists
    if (shipment.document_name && shipment.document_type && shipment.document_url && shipment.uploaded_at) {
      setUploadedFile({
        document_name: shipment.document_name,
        document_type: shipment.document_type,
        document_url: shipment.document_url,
        uploaded_at: shipment.uploaded_at,
      });
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('/api/shipment/document', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Upload failed');
      }
  
      const data = await response.json();
      console.log('Upload successful:', data); // Log the response for debugging
      setUploadedFile({
        document_name: data.name,
        document_type: data.type,
        document_url: data.url,
        uploaded_at: data.uploaded_at,
      });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    products.forEach((product, index) => {
      formData.append(`Product`, product.Product);
      formData.append(`Capacity`, product.Capacity);
      formData.append(`Description`, product.Description);
    });

    // Add uploaded file data to form submission
    if (uploadedFile) {
      formData.append('document_name', uploadedFile.document_name);
      formData.append('document_type', uploadedFile.document_type);
      formData.append('document_url', uploadedFile.document_url);
      formData.append('uploaded_at', uploadedFile.uploaded_at);
    }

    formAction(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-5">
          <label htmlFor="id" className="block text-sm font-medium text-gray-900">
            Shipment ID
          </label>
          <input
            type="text"
            name="id"
            id="id"
            defaultValue={shipment.id}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Shipment ID..."
            readOnly
          />
          {state?.Error?.id && (
            <div className="mt-2 text-sm text-red-500">
              {Array.isArray(state.Error.id) 
                ? state.Error.id.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))
                : <p>{state.Error.id}</p>
              }
            </div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="Status" className="block text-sm font-medium text-gray-900">
            Shipment Status
          </label>
          <select
            name="Status"
            id="Status"
            defaultValue={shipment.Status}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Select Status...</option>
            <option value="QUEUEING">Queueing</option>
            <option value="PICKUP">Out for Pickup</option>
            <option value="LOADING">Loading</option>
            <option value="ONGOING">Out for Delivery</option>
            <option value="UNLOADING">Unloading</option>
            <option value="FINISHED">Finished</option>
          </select>
          {state?.Error?.Status && (
            <div className="mt-2 text-sm text-red-500">
              {Array.isArray(state.Error.Status) 
                ? state.Error.Status.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))
                : <p>{state.Error.Status}</p>
              }
            </div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="Ship_from" className="block text-sm font-medium text-gray-900">
            Shipment From
          </label>
          <input
            type="text"
            name="Ship_from"
            id="Ship_from"
            defaultValue={shipment.Ship_from}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Shipment from..."
          />
          {state?.Error?.Ship_from && (
            <div className="mt-2 text-sm text-red-500">
              {Array.isArray(state.Error.Ship_from) 
                ? state.Error.Ship_from.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))
                : <p>{state.Error.Ship_from}</p>
              }
            </div>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="Ship_destination" className="block text-sm font-medium text-gray-900">
            Shipment Destination
          </label>
          <input
            type="text"
            name="Ship_destination"
            id="Ship_destination"
            defaultValue={shipment.Ship_destination}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Shipment destination..."
          />
          {state?.Error?.Ship_destination && (
            <div className="mt-2 text-sm text-red-500">
              {Array.isArray(state.Error.Ship_destination) 
                ? state.Error.Ship_destination.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))
                : <p>{state.Error.Ship_destination}</p>
              }
            </div>
          )}
        </div>


        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Products</h2>
            <button
              type="button"
              onClick={addProduct}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Product
            </button>
          </div>

          <div className="space-y-4">
            {products.map((product, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="relative">
                  <div className="absolute -top-3 -left-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>

                  <div className="absolute -top-3 -right-3">
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      title="Remove Product"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                    <div className="space-y-2">
                      <label
                        htmlFor={`Product-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        id={`Product-${index}`}
                        value={product.Product}
                        onChange={(e) => handleProductChange(index, 'Product', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white px-4 py-2 border hover:border-blue-400 transition-colors duration-200"
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor={`Capacity-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Capacity
                      </label>
                      <input
                        type="number"
                        id={`Capacity-${index}`}
                        value={product.Capacity}
                        onChange={(e) => handleProductChange(index, 'Capacity', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white px-4 py-2 border hover:border-blue-400 transition-colors duration-200"
                        placeholder="Enter capacity"
                        min="0"
                        step="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor={`Description-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <input
                        type="text"
                        id={`Description-${index}`}
                        value={product.Description}
                        onChange={(e) => handleProductChange(index, 'Description', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white px-4 py-2 border hover:border-blue-400 transition-colors duration-200"
                        placeholder="Enter description"
                        required
                      />
                    </div>
                  </div>

                  {/* Validation Error Messages */}
                  {state?.Error?.Product && index === 0 && (
                    <div className="mt-2 text-sm text-red-500">
                      {Array.isArray(state.Error.Product)
                        ? state.Error.Product.map((error, i) => (
                            <p key={i}>{error}</p>
                          ))
                        : <p>{state.Error.Product}</p>
                      }
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="text-gray-400">
                  <PlusCircle className="w-12 h-12" />
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-sm">No products added yet</p>
                  <button
                    type="button"
                    onClick={addProduct}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Add your first product
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8 space-y-4">
          <label className="block text-sm font-medium text-gray-900">
            Upload Document
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="document"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 border-gray-300"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                )}
                <p className="mb-2 text-sm text-gray-500">
                  {uploading ? 'Uploading...' : 
                   (uploadedFile || shipment.document_url) ? 'Document uploaded successfully!' :
                   'Click or drag and drop to upload document'}
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX or TXT (MAX. 10MB)</p>
              </div>
              <input
                type="file"
                name="document"
                id="document"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {(uploadedFile || shipment.document_url) && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex-1 truncate">
                Uploaded: {uploadedFile?.document_name || shipment.document_name}
              </div>
              <a 
                href={uploadedFile?.document_url || shipment.document_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                View Document
              </a>
            </div>
          )}
        </div>

        <SubmitButton label="Update Shipment" />
      </form>
    </div>
  );
};

export default EditShipmentForm;