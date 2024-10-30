'use client';

import { createShipment } from "@/lib/action/shipmentAction";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/buttons";
import { useState } from 'react';
import { PlusCircle, XCircle, Upload, Loader2 } from 'lucide-react';

const ShipmentForm = () => {
  const [state, formAction] = useFormState(createShipment, null);
  const [products, setProducts] = useState([{ Product: '', Capacity: '', Description: '' }]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    document_name: string;
    document_type: string;
    document_url: string;
    uploaded_at: string;
  } | null>(null);

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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
  
      const data = await response.json();
      setUploadedFile(data.data);
    } catch (error) {
      console.error('Upload error:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Add products data
    products.forEach((product, index) => {
      formData.append(`products[${index}][Product]`, product.Product);
      formData.append(`products[${index}][Capacity]`, product.Capacity);
      formData.append(`products[${index}][Description]`, product.Description);
    });

    // Add uploaded file data if available
    if (uploadedFile) {
      formData.append('document_name', uploadedFile.document_name);
      formData.append('document_type', uploadedFile.document_type);
      formData.append('document_url', uploadedFile.document_url);
      formData.append('uploaded_at', uploadedFile.uploaded_at);
    }

    formAction(formData);
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Existing form fields */}
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
            htmlFor="Status"
            className="block text-sm font-medium text-gray-900"
          >
            Shipment Status
          </label>
          <select
            name="Status"
            id="Status"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">...</option>
            <option value="QUEUEING">Queueing</option>
            <option value="PICKUP">Out for Pickup</option>
            <option value="LOADING">Loading</option>
            <option value="ONGOING">Out for Delivery</option>
            <option value="UNLOADING">Unloading</option>
            <option value="FINISHED">Finished</option>
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

        {/* Products section */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Products
          </label>
          {products.map((product, index) => (
            <div key={index} className="mb-3 flex items-end space-x-2">
              <div className="flex-grow">
                <input
                  type="text"
                  value={product.Product}
                  onChange={(e) => handleProductChange(index, 'Product', e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Product Name..."
                />
              </div>
              <div className="flex-grow">
                <input
                  type="number"
                  value={product.Capacity}
                  onChange={(e) => handleProductChange(index, 'Capacity', e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Capacity..."
                />
              </div>
              <div className="flex-grow">
                <input
                  type="text"
                  value={product.Description}
                  onChange={(e) => handleProductChange(index, 'Description', e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Description..."
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
        </div>

        {/* Document Upload Section */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Upload Document
          </label>
          <div className="flex items-center space-x-2">
            <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-sm cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              <span className="ml-2">{uploading ? 'Uploading...' : 'Choose File'}</span>
            </label>
            {uploadedFile && (
              <div className="flex-1 text-sm text-gray-600">
                <p>Uploaded: {uploadedFile.document_name}</p>
                <a 
                  href={uploadedFile.document_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Document
                </a>
              </div>
            )}
          </div>
        </div>

        <SubmitButton label="Create Shipment" />
      </form>
    </div>
  );
};

export default ShipmentForm;