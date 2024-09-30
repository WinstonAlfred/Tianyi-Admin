'use client'

import React, { useState } from 'react';
import { useFormState } from "react-dom";
import { updateDetail } from "@/lib/action/detailAction";
import { SubmitButton } from "@/components/buttons";
import { PlusCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

type WorkItem = {
  datetime: string;
  work: string;
};

type ActivityItem = {
  description: string;
  workItems: WorkItem[];
};

type ActivityGroup = ActivityItem[];

interface EditDetailFormProps {
  detail: {
    id: string;
    Loading?: string[];
    Unloading?: string[];
    Daily_activities?: string[];
  };
}

const EditDetailForm: React.FC<EditDetailFormProps> = ({ detail }) => {
  const [state, formAction] = useFormState(updateDetail.bind(null, detail.id), null);
  const [loading, setLoading] = useState<ActivityGroup>(parseActivityGroup(detail.Loading));
  const [unloading, setUnloading] = useState<ActivityGroup>(parseActivityGroup(detail.Unloading));
  const [dailyActivities, setDailyActivities] = useState<ActivityGroup>(parseActivityGroup(detail.Daily_activities));
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  function parseActivityGroup(activities?: string[]): ActivityGroup {
    if (!activities) return [];
    return activities.map(activity => {
      const lines = activity.split('\n');
      const descriptionLines = [];
      let workItems = [];
      let isDescription = true;

      for (let line of lines) {
        if (line.startsWith('Datetime:') || line.startsWith('Work:')) {
          isDescription = false;
        }

        if (isDescription) {
          descriptionLines.push(line.replace('Description: ', ''));
        } else {
          if (line.startsWith('Datetime:')) {
            workItems.push({ datetime: line.replace('Datetime: ', ''), work: '' });
          } else if (line.startsWith('Work:')) {
            workItems[workItems.length - 1].work = line.replace('Work: ', '');
          }
        }
      }

      return {
        description: descriptionLines.join('\n'),
        workItems: workItems
      };
    });
  }

  const addActivity = (setter: React.Dispatch<React.SetStateAction<ActivityGroup>>) => {
    setter(prev => [...prev, { description: '', workItems: [{ datetime: '', work: '' }] }]);
  };

  const removeActivity = (setter: React.Dispatch<React.SetStateAction<ActivityGroup>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const updateActivity = (
    setter: React.Dispatch<React.SetStateAction<ActivityGroup>>,
    activityIndex: number,
    field: keyof ActivityItem,
    value: string | WorkItem[]
  ) => {
    setter(prev => {
      const newActivities = [...prev];
      if (field === 'workItems' && Array.isArray(value)) {
        newActivities[activityIndex] = { ...newActivities[activityIndex], workItems: value };
      } else if (field === 'description' && typeof value === 'string') {
        newActivities[activityIndex] = { ...newActivities[activityIndex], description: value };
      }
      return newActivities;
    });
  };

  const addWorkItem = (setter: React.Dispatch<React.SetStateAction<ActivityGroup>>, activityIndex: number) => {
    setter(prev => {
      const newActivities = [...prev];
      newActivities[activityIndex] = {
        ...newActivities[activityIndex],
        workItems: [...newActivities[activityIndex].workItems, { datetime: '', work: '' }]
      };
      return newActivities;
    });
  };

  const removeWorkItem = (setter: React.Dispatch<React.SetStateAction<ActivityGroup>>, activityIndex: number, workItemIndex: number) => {
    setter(prev => {
      const newActivities = [...prev];
      newActivities[activityIndex].workItems = newActivities[activityIndex].workItems.filter((_, i) => i !== workItemIndex);
      return newActivities;
    });
  };

  const updateWorkItem = (
    setter: React.Dispatch<React.SetStateAction<ActivityGroup>>,
    activityIndex: number,
    workItemIndex: number,
    field: keyof WorkItem,
    value: string
  ) => {
    setter(prev => {
      const newActivities = [...prev];
      newActivities[activityIndex].workItems[workItemIndex] = {
        ...newActivities[activityIndex].workItems[workItemIndex],
        [field]: value
      };
      return newActivities;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const serializeActivities = (activities: ActivityGroup) => {
      return activities.map(item => 
        `Description: ${item.description}\n${item.workItems.map(wi => `Datetime: ${wi.datetime}\nWork: ${wi.work}`).join('\n')}`
      );
    };

    serializeActivities(loading).forEach(item => formData.append('Loading', item));
    serializeActivities(unloading).forEach(item => formData.append('Unloading', item));
    serializeActivities(dailyActivities).forEach(item => formData.append('Daily_activities', item));

    formAction(formData);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderActivityFields = (
    label: string,
    activities: ActivityGroup,
    setter: React.Dispatch<React.SetStateAction<ActivityGroup>>
  ) => (
    <div className="mb-6">
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-t-lg cursor-pointer" onClick={() => toggleSection(label)}>
        <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
        {expandedSections[label] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      {expandedSections[label] && (
        <div className="border border-gray-200 border-t-0 rounded-b-lg p-4 space-y-4">
          {activities.map((activity, activityIndex) => (
            <div key={activityIndex} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={activity.description}
                  onChange={(e) => updateActivity(setter, activityIndex, 'description', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                />
              </div>
              {activity.workItems.map((workItem, workItemIndex) => (
                <div key={workItemIndex} className="flex items-center space-x-2 mb-2">
                  <input
                    type="datetime-local"
                    value={workItem.datetime}
                    onChange={(e) => updateWorkItem(setter, activityIndex, workItemIndex, 'datetime', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={workItem.work}
                    onChange={(e) => updateWorkItem(setter, activityIndex, workItemIndex, 'work', e.target.value)}
                    placeholder="Work description"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeWorkItem(setter, activityIndex, workItemIndex)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              ))}
              <div className="flex justify-between mt-2">
                <button
                  type="button"
                  onClick={() => addWorkItem(setter, activityIndex)}
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                >
                  <PlusCircle size={16} className="mr-1" /> Add Work Item
                </button>
                <button
                  type="button"
                  onClick={() => removeActivity(setter, activityIndex)}
                  className="text-red-500 hover:text-red-700 flex items-center"
                >
                  <XCircle size={16} className="mr-1" /> Remove Activity
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addActivity(setter)}
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Add {label} Activity
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">Detail ID</label>
          <input
            type="text"
            name="id"
            id="id"
            defaultValue={detail.id}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            readOnly
          />
          {state?.Error?.id && (
            <p className="mt-2 text-sm text-red-600">{state.Error.id}</p>
          )}
        </div>

        {renderActivityFields("Loading", loading, setLoading)}
        {renderActivityFields("Unloading", unloading, setUnloading)}
        {renderActivityFields("Daily Activities", dailyActivities, setDailyActivities)}

        <SubmitButton label="Update Detail" />
      </form>
    </div>
  );
};

export default EditDetailForm;