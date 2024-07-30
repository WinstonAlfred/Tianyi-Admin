'use client';

import React, { useState } from 'react';
import { useFormState } from "react-dom";
import { createDetail } from "@/lib/action/detailAction";
import { SubmitButton } from "@/components/buttons";
import { PlusCircle, XCircle } from 'lucide-react';

type FieldSetter = React.Dispatch<React.SetStateAction<string[] | null>>;

const DetailForm: React.FC = () => {
  const [state, formAction] = useFormState(createDetail, null);
  const [loading, setLoading] = useState<string[] | null>(null);
  const [unloading, setUnloading] = useState<string[] | null>(null);
  const [dailyActivities, setDailyActivities] = useState<string[] | null>(null);

  const addField = (setter: FieldSetter) => {
    setter(prev => prev ? [...prev, ''] : ['']);
  };

  const removeField = (setter: FieldSetter, index: number) => {
    setter(prev => {
      if (!prev) return null;
      const newFields = prev.filter((_, i) => i !== index);
      return newFields.length ? newFields : null;
    });
  };

  const handleFieldChange = (setter: FieldSetter, index: number, value: string) => {
    setter(prev => {
      if (!prev) return [value];
      const newFields = [...prev];
      newFields[index] = value;
      return newFields;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, setter: FieldSetter, index: number) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + '\n' + value.substring(end);
      handleFieldChange(setter, index, newValue);
      // Set cursor position after inserted newline
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    loading?.forEach((item) => formData.append('Loading', item));
    unloading?.forEach((item) => formData.append('Unloading', item));
    dailyActivities?.forEach((item) => formData.append('Daily_activities', item));
    formAction(formData);
  };

  const renderFields = (label: string, fields: string[] | null, setter: FieldSetter) => (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-900">{label}</label>
      {fields && fields.map((field, index) => (
        <div key={index} className="flex items-start space-x-2 mt-2">
          <textarea
            value={field}
            onChange={(e) => handleFieldChange(setter, index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, setter, index)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder={`${label}...`}
            rows={3}
          />
          <button
            type="button"
            onClick={() => removeField(setter, index)}
            className="p-2.5 text-red-500 hover:text-red-700"
          >
            <XCircle size={20} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addField(setter)}
        className="mt-2 p-2.5 text-blue-500 hover:text-blue-700"
      >
        <PlusCircle size={20} /> Add {label}
      </button>
    </div>
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-900"
          >
            Detail ID
          </label>
          <input
            type="text"
            name="id"
            id="id"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Detail ID..."
          />
          <div id="id-error" aria-live="polite" aria-atomic="true">
            <p className="mt-2 text-sm text-red-500">{state?.Error?.id}</p>
          </div>
        </div>

        {renderFields("Loading", loading, setLoading)}
        {renderFields("Unloading", unloading, setUnloading)}
        {renderFields("Daily Activities", dailyActivities, setDailyActivities)}

        <SubmitButton label="Save Detail" />
      </form>
    </div>
  );
};

export default DetailForm;