'use client';

import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import { useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

interface ButtonProps {
  id: string;
}

interface CreateButtonProps {
  targetEntity: string; // Prop to specify the entity (e.g., "shipment", "loading", "unloading", "product", "activities")
}

interface EditButtonProps {
  id: string;
  entityType: string; // e.g., 'shipment', 'loading', 'unloading', 'product', 'activities'
}

interface DeleteButtonProps extends ButtonProps {
  onDelete: (id: string) => Promise<void>;
}


export const EditButton: React.FC<EditButtonProps> = ({ id, entityType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await router.push(`/${entityType}/edit/${id}`);
    setIsLoading(false);
  };

  return (
    <Link
      href={`/${entityType}/edit/${id}`}
      onClick={handleClick}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded inline-flex items-center text-sm ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {isLoading ? (
        <span className="animate-spin mr-1 md:mr-2">↻</span>
      ) : (
        <FaEdit className="mr-1 md:mr-2" />
      )}
      <span className="hidden md:inline">{isLoading ? 'Loading...' : 'Edit'}</span>
    </Link>
  );
};

export const DeleteButton: React.FC<DeleteButtonProps> = ({ id, onDelete }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      startTransition(async () => {
        try {
          await onDelete(id);
          // The page should automatically update due to the server action
          // If it doesn't, you might need to manually trigger a refresh or update the UI
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 md:py-2 md:px-4 rounded inline-flex items-center text-sm ${
        isPending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <FaTrash className="mr-1 md:mr-2" />
      <span className="hidden md:inline">{isPending ? 'Deleting...' : 'Delete'}</span>
    </button>
  );
};

export const CreateButton: React.FC<CreateButtonProps> = ({ targetEntity }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await router.push(`/${targetEntity}/create`); 
    // In a real scenario, you might want to handle potential navigation errors here
    setIsLoading(false); 
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center text-sm mb-4"
    >
      {isLoading ? (
        <FaSpinner className="animate-spin mr-2" /> // Loading spinner
      ) : (
        <FaPlus className="mr-2" /> // Plus icon
      )}
      <span>{isLoading ? "Creating..." : `Create new ${targetEntity}`}</span>
    </button>
  );
};

export const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();

  const className = clsx(
    "text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-sm text-sm w-full px-5 py-3 text-center",
    {
      "opacity-50 cursor-progress": pending,
    }
  );

  return (
    <button type="submit" className={className} disabled={pending}>
      {label === "save" ? (
        <span>{pending ? "Saving..." : "Save"}</span>
      ) : (
        <span>{pending ? "Updating..." : "Update"}</span>
      )}
    </button>
  );
};