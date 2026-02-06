'use client';

import { useState } from 'react';
import type { WorkflowInput } from '@/types/workflow';

interface WorkflowInputFormProps {
  inputs: WorkflowInput[];
  values: Record<string, string | number | boolean | string[]>;
  onChange: (name: string, value: string | number | boolean | string[]) => void;
  errors?: Record<string, string>;
}

export function WorkflowInputForm({ inputs, values, onChange, errors }: WorkflowInputFormProps) {
  return (
    <div className="space-y-4">
      {inputs.map((input) => (
        <div key={input.name} className="flex flex-col gap-1.5">
          <label htmlFor={`input-${input.name}`} className="text-sm font-medium text-gray-700">
            {input.label || input.name}
            {input.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {input.description && (
            <p className="text-xs text-gray-500">{input.description}</p>
          )}
          {renderInput(input, values, onChange, errors?.[input.name])}
        </div>
      ))}
    </div>
  );
}

function renderInput(
  input: WorkflowInput,
  values: Record<string, string | number | boolean | string[]>,
  onChange: (name: string, value: string | number | boolean | string[]) => void,
  error?: string
) {
  const value = values[input.name] ?? input.default ?? '';
  const hasError = !!error;

  switch (input.type) {
    case 'string':
      return (
        <input
          type="text"
          id={`input-${input.name}`}
          value={String(value)}
          onChange={(e) => onChange(input.name, e.target.value)}
          placeholder={input.placeholder}
          className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 ${
            hasError
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-purple-500'
          }`}
        />
      );

    case 'number':
      return (
        <input
          type="number"
          id={`input-${input.name}`}
          value={String(value)}
          onChange={(e) => onChange(input.name, Number(e.target.value))}
          placeholder={input.placeholder}
          min={input.validation?.min}
          max={input.validation?.max}
          className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 ${
            hasError
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-purple-500'
          }`}
        />
      );

    case 'boolean':
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`input-${input.name}`}
            checked={Boolean(value)}
            onChange={(e) => onChange(input.name, e.target.checked)}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <label htmlFor={`input-${input.name}`} className="text-sm text-gray-600">
            {input.label || input.name}
          </label>
        </div>
      );

    case 'textarea':
      return (
        <textarea
          id={`input-${input.name}`}
          value={String(value)}
          onChange={(e) => onChange(input.name, e.target.value)}
          placeholder={input.placeholder}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 resize-y ${
            hasError
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-purple-500'
          }`}
        />
      );

    case 'select':
      return (
        <select
          id={`input-${input.name}`}
          value={String(value)}
          onChange={(e) => onChange(input.name, e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 ${
            hasError
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-purple-500'
          }`}
        >
          <option value="">请选择...</option>
          {input.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case 'multiselect':
      return (
        <div className="space-y-2">
          {input.options?.map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Array.isArray(value) ? value.includes(option) : false}
                onChange={(e) => {
                  const current = Array.isArray(value) ? value : [];
                  if (e.target.checked) {
                    onChange(input.name, [...current, option]);
                  } else {
                    onChange(input.name, current.filter((v) => v !== option));
                  }
                }}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      );

    case 'file':
      return (
        <input
          type="file"
          id={`input-${input.name}`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onChange(input.name, file.name);
            }
          }}
          className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 ${
            hasError
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-purple-500'
          } file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100`}
        />
      );

    case 'json':
      return (
        <textarea
          id={`input-${input.name}`}
          value={typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onChange(input.name, parsed);
            } catch {
              onChange(input.name, e.target.value);
            }
          }}
          placeholder='{\n  "key": "value"\n}'
          rows={6}
          className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 resize-y font-mono text-sm ${
            hasError
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-purple-500'
          }`}
        />
      );

    default:
      return (
        <input
          type="text"
          id={`input-${input.name}`}
          value={String(value)}
          onChange={(e) => onChange(input.name, e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 ${
            hasError
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-purple-500'
          }`}
        />
      );
  }
}

interface WorkflowInputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: WorkflowInput[];
  onSubmit: (values: Record<string, string | number | boolean | string[]>) => void;
  title?: string;
}

export function WorkflowInputDialog({
  isOpen,
  onClose,
  inputs,
  onSubmit,
  title = '输入工作流参数',
}: WorkflowInputDialogProps) {
  const [values, setValues] = useState<Record<string, string | number | boolean | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string | number | boolean | string[]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when user modifies the field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: Record<string, string> = {};
    inputs.forEach((input) => {
      if (input.required && !values[input.name]) {
        newErrors[input.name] = `${input.label || input.name} 是必填项`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(values);
    onClose();
    setValues({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
          <form onSubmit={handleSubmit}>
            <WorkflowInputForm
              inputs={inputs}
              values={values}
              onChange={handleChange}
              errors={errors}
            />
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                确认
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
