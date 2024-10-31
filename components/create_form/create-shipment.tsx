'use client';

import { createShipment } from "@/lib/action/shipmentAction";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/components/buttons";
import { useState } from 'react';
import { PlusCircle, XCircle, Upload, Loader2 } from 'lucide-react';

interface Product {
  Product: string;
  Capacity: number;
  Description: string;
}

interface ShipmentInput {
  id: string;
  Status: string;
  Ship_from: string;
  Ship_destination: string;
  Product?: string[];
  Capacity?: number[];
  Description?: string[];
  document_url?: string;
  document_name?: string;
  document_type?: string;
  uploaded_at?: Date;
}

interface FormState {
  Error?: {
    id?: string[];
    Status?: string[];
    Ship_from?: string[];
    Ship_destination?: string[];
    Product?: string[];
    Capacity?: string[];
    Description?: string[];
    document?: string[];
    message?: string;
  };
}

const ShipmentForm = () => {
  const [state, formAction] = useFormState<FormState, FormData>(createShipment, { Error: {} });
  const [products, setProducts] = useState<Product[]>([{ Product: '', Capacity: 0, Description: '' }]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<string | null>(null);

  const addProduct = () => {
    setProducts([...products, { Product: '', Capacity: 0, Description: '' }]);
  };

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      const newProducts = products.filter((_, i) => i !== index);
      setProducts(newProducts);
    }
  };

  const handleProductChange = (index: number, field: keyof Product, value: string | number) => {
    const newProducts = [...products];
    if (field === 'Capacity') {
      newProducts[index][field] = Number(value);
    } else {
      newProducts[index][field] = value as string;
    }
    setProducts(newProducts);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(false);
  
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      try {
        const response = await fetch('/api/shipment/document', {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Upload failed');
        }
  
        const data = await response.json();
        
        // Use the values from the server response
        setDocumentUrl(data.url);
        setDocumentName(data.name);
        setDocumentType(data.type);
        setUploadSuccess(true);
        
        console.log('Document upload successful:', {
          url: data.url,
          name: data.name,
          type: data.type
        });
      } catch (error) {
        console.error('Upload error:', error);
        setUploadError('Failed to upload document. Please try again.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  // Add products to formData
  products.forEach((product, index) => {
    formData.append('Product', product.Product);
    formData.append('Capacity', product.Capacity.toString());
    formData.append('Description', product.Description);
  });
  
  // Add document information to formData
  if (documentUrl) {
    formData.append('document_url', documentUrl);
    formData.append('document_name', documentName || '');
    formData.append('document_type', documentType || '');
    
    // Add debug logging
    console.log('Document data being sent:', {
      url: documentUrl,
      name: documentName,
      type: documentType
    });
  }
  
  // Submit the form
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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Shipment ID..."
            required
          />
          {state?.Error?.id && (
            <div className="mt-2 text-sm text-red-500">
              {state.Error.id.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
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
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
              {state.Error.Status.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
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
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Shipment from..."
          />
          {state?.Error?.Ship_from && (
            <div className="mt-2 text-sm text-red-500">
              {state.Error.Ship_from.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
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
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Shipment destination..."
          />
          {state?.Error?.Ship_destination && (
            <div className="mt-2 text-sm text-red-500">
              {state.Error.Ship_destination.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
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
          {/* Product Number Label */}
          <div className="absolute -top-3 -left-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
            {index + 1}
          </div>
          
          {/* Remove Button */}
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
            {/* Product Name Field */}
            <div className="space-y-2">
              <label
                htmlFor={`Product-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name={`Product-${index}`}
                  id={`Product-${index}`}
                  value={product.Product}
                  onChange={(e) => handleProductChange(index, 'Product', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                           focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                           bg-white px-4 py-2 border hover:border-blue-400 
                           transition-colors duration-200"
                  placeholder="Enter product name"
                  required
                />
              </div>
            </div>

            {/* Capacity Field */}
            <div className="space-y-2">
              <label
                htmlFor={`Capacity-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Capacity
              </label>
              <div className="relative">
                <input
                  type="number"
                  name={`Capacity-${index}`}
                  id={`Capacity-${index}`}
                  value={product.Capacity}
                  onChange={(e) => handleProductChange(index, 'Capacity', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                           focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                           bg-white px-4 py-2 border hover:border-blue-400 
                           transition-colors duration-200"
                  placeholder="Enter capacity"
                  min="0"
                  step="1"
                  required
                />
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label
                htmlFor={`Description-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="relative">
                <input
                  type="text"
                  name={`Description-${index}`}
                  id={`Description-${index}`}
                  value={product.Description}
                  onChange={(e) => handleProductChange(index, 'Description', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                           focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                           bg-white px-4 py-2 border hover:border-blue-400 
                           transition-colors duration-200"
                  placeholder="Enter description"
                  required
                />
              </div>
            </div>
          </div>

          {/* Validation Error Messages */}
          {state?.Error?.Product && index === 0 && (
            <div className="mt-2 text-sm text-red-500">
              {state.Error.Product.map((error, i) => (
                <p key={i}>{error}</p>
              ))}
            </div>
          )}
          {state?.Error?.Capacity && index === 0 && (
            <div className="mt-2 text-sm text-red-500">
              {state.Error.Capacity.map((error, i) => (
                <p key={i}>{error}</p>
              ))}
            </div>
          )}
          {state?.Error?.Description && index === 0 && (
            <div className="mt-2 text-sm text-red-500">
              {state.Error.Description.map((error, i) => (
                <p key={i}>{error}</p>
              ))}
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

        {state?.Error?.message && (
          <div className="mt-2 text-sm text-red-500">{state.Error.message}</div>
        )}

<div className="mb-8 space-y-4">
          <label className="block text-sm font-medium text-gray-900">
            Upload Document
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="document"
              className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer 
                ${uploading ? 'bg-gray-50' : 'hover:bg-gray-50'} 
                ${uploadSuccess ? 'border-green-300' : 'border-gray-300'}`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                ) : (
                  <Upload className={`w-8 h-8 mb-4 ${uploadSuccess ? 'text-green-500' : 'text-gray-500'}`} />
                )}
                <p className="mb-2 text-sm text-gray-500">
                  {uploading ? 'Uploading...' : 
                   uploadSuccess ? 'Document uploaded successfully!' :
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
          
          {file && !uploadError && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex-1 truncate">
                Selected file: {file.name}
              </div>
              {uploadSuccess && (
                <div className="flex items-center text-green-600">
                  <span className="text-xs">✓ Uploaded</span>
                </div>
              )}
            </div>
          )}
          
          {uploadError && (
            <div className="text-sm text-red-500">
              {uploadError}
            </div>
          )}
        </div>

        <SubmitButton label="Create Shipment"/>
      </form>
    </div>
  );
};

export default ShipmentForm;