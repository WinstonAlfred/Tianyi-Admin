'use client'

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
        return 'bg-white text-black';
      case 'Unloading':
        return 'bg-white text-black';
      case 'Daily Activities':
        return 'bg-white text-black';
      default:
        return 'bg-white text-black';
    }
  };

  const parseActivityString = (str: string): { description: string, items: { datetime: string, work: string }[] } => {
    const lines = str.split('\n');
    let description = '';
    let items = [];
    let isDescription = true;

    for (let i = 0; i < lines.length; i++) {
      if (isDescription) {
        if (lines[i].startsWith('Datetime:')) {
          isDescription = false;
          i--; // Reprocess this line as an item
        } else {
          description += lines[i] + '\n';
        }
      } else {
        if (i + 1 < lines.length) {
          items.push({
            datetime: lines[i].replace('Datetime: ', ''),
            work: lines[i + 1].replace('Work: ', '')
          });
          i++; // Skip the next line as we've already processed it
        }
      }
    }

    return { description: description.trim(), items };
  };

  const renderFormattedText = (items: string[], type: ActivityType): JSX.Element => {
    return (
      <div className={`space-y-4 ${isExpanded ? '' : 'max-h-20 overflow-hidden'}`}>
        {items.map((text, index) => {
          const { description, items } = parseActivityString(text);
          return (
            <div key={index} className={`${getItemColor(type)} p-4 rounded overflow-x-auto`}>
              <pre className="font-bold mb-2 whitespace-pre-wrap">{description}</pre>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-b-0">
                        <td className="py-2 pr-4 whitespace-nowrap font-medium">{item.datetime}</td>
                        <td className="py-2 whitespace-nowrap">{item.work}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <tr className="bg-white border-b hover:bg-gray-50 transition duration-150 ease-in-out">
        <td className="py-4 px-4 font-medium text-gray-900 align-top">
          {index}
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