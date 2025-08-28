import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PersonRecord } from "@/store/dataStore";

interface EditableCellProps {
  value: string | number;
  field: keyof PersonRecord;
  onSave: (value: string | number) => void;
  validation?: (value: string) => string | null;
}

const languageOptions = [
  "Sindhi",
  "Hindi",
  "Bosnian",
  "Icelandic",
  "Maltese",
  "Galician",
  "Uyghur",
  "isiZulu",
  "Setswana",
  "Sesotho sa Leboa",
];

const stateOptions = [
  "new customer",
  "served",
  "to contact",
  "paused",
] as const;

export function EditableCell({
  value,
  field,
  onSave,
  validation,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Real-time validation as user types
  useEffect(() => {
    if (isEditing && validation) {
      const validationError = validation(editValue);
      setError(validationError);
    }
  }, [editValue, isEditing, validation]);

  const handleSave = () => {
    // Always run validation before saving
    let validationError = null;
    if (validation) {
      validationError = validation(editValue);
      setError(validationError);
    }

    // Don't save if there are validation errors
    if (validationError) {
      return;
    }

    const finalValue = field === "version" ? parseFloat(editValue) : editValue;
    onSave(finalValue);
    setIsEditing(false);
    setError(null);
  };

  const handleCancel = () => {
    setEditValue(String(value));
    setIsEditing(false);
    setError(null);
  };

  const handleBlur = () => {
    // Only save on blur if there are no validation errors
    if (!error) {
      handleSave();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    if (field === "language") {
      return (
        <div className="min-w-[150px]">
          <Select value={editValue} onValueChange={setEditValue}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1 mt-1">
            <button
              className={`text-xs px-2 py-1 rounded transition-colors ${
                error
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
              onClick={handleSave}
              disabled={!!error}
              title={error ? `Cannot save: ${error}` : "Save changes"}
            >
              ✓
            </button>
            <button
              className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors"
              onClick={handleCancel}
              title="Cancel changes"
            >
              ✕
            </button>
          </div>
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
      );
    }

    if (field === "state") {
      return (
        <div className="min-w-[120px]">
          <Select value={editValue} onValueChange={setEditValue}>
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stateOptions.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-1 mt-1">
            <button
              className={`text-xs px-2 py-1 rounded transition-colors ${
                error
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
              onClick={handleSave}
              disabled={!!error}
              title={error ? `Cannot save: ${error}` : "Save changes"}
            >
              ✓
            </button>
            <button
              className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors"
              onClick={handleCancel}
              title="Cancel changes"
            >
              ✕
            </button>
          </div>
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
      );
    }

    return (
      <div className="min-w-[100px]">
        <Input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={`h-8 text-sm transition-colors ${
            error
              ? "border-red-300 focus:border-red-500 bg-red-50"
              : "border-blue-300 focus:border-blue-500"
          }`}
          type={field === "version" ? "number" : "text"}
          step={field === "version" ? "0.01" : undefined}
        />
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </div>
    );
  }

  // Helper function to get status badge styling
  const getStatusBadgeStyle = (status: string) => {
    const statusConfig = {
      "new customer": "bg-red-50 text-red-700 border-red-200",
      served: "bg-blue-50 text-blue-700 border-blue-200",
      "to contact": "bg-green-50 text-green-700 border-green-200",
      paused: "bg-yellow-50 text-yellow-700 border-yellow-200",
    } as const;

    return (
      statusConfig[status as keyof typeof statusConfig] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  return (
    <div
      className="cursor-pointer hover:bg-blue-50 p-2 rounded min-h-[32px] flex items-center text-sm transition-colors"
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      {field === "state" ? (
        <span
          className={`px-2 py-1 rounded-md border text-xs font-medium ${getStatusBadgeStyle(
            String(value)
          )}`}
        >
          {value}
        </span>
      ) : (
        <span className="truncate">{value}</span>
      )}
    </div>
  );
}
