'use client';

import React, { useState } from 'react';
import { EditButton, DeleteButton } from '../buttons';
import { deleteDetail } from '@/lib/action/detailAction';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Detail {
  id: string;
  Loading: string[];
  Unloading: string[];
  Daily_activities: string[];
}

type ActivityType = 'Loading' | 'Unloading' | 'Daily Activities';

interface ClientRowProps {
  detail: Detail;
  index: number;
}

const ClientRow: React.FC<ClientRowProps> = ({ detail, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getItemColor = (type: ActivityType): string => {
    switch(type) {
      case 'Loading':
        return 'bg-blue-100 text-blue-800';
      case 'Unloading':
        return 'bg-green-100 text-green-800';
      case 'Daily Activities':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderFormattedText = (items: string[], type: ActivityType): JSX.Element => {
    return (
      <div className={`space-y-4 ${isExpanded ? '' : 'max-h-20 overflow-hidden'}`}>
        {items.map((text, index) => (
          <pre key={index} className={`whitespace-pre font-mono text-xs ${getItemColor(type)} p-4 rounded overflow-x-auto`}>
            {text}
          </pre>
        ))}
      </div>
    );
  };

  return (
    <>
      <tr className="bg-white border-b hover:bg-gray-50 transition duration-150 ease-in-out">
        <td className="py-4 px-4 font-medium text-gray-900 align-top">
          {index + 1}
        </td>
        <td className="py-4 px-4 font-medium text-gray-900 align-top">
          {detail.id}
        </td>
        <td className="py-4 px-4 align-top">
          {renderFormattedText(detail.Loading, 'Loading')}
        </td>
        <td className="py-4 px-4 align-top">
          {renderFormattedText(detail.Unloading, 'Unloading')}
        </td>
        <td className="py-4 px-4 align-top">
          {renderFormattedText(detail.Daily_activities, 'Daily Activities')}
        </td>
        <td className="py-4 px-4 align-top">
          <div className="flex justify-center gap-2">
            <EditButton id={detail.id} entityType='details'/>
            <DeleteButton id={detail.id} onDelete={deleteDetail}/>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={6} className="py-2 px-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500 hover:text-blue-700 text-sm flex items-center"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                See less
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                See more
              </>
            )}
          </button>
        </td>
      </tr>
    </>
  );
};

export default ClientRow;