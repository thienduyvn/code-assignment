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

  const handleSave = () => {
    if (validation) {
      const validationError = validation(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
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
              className="text-xs bg-green-500 text-white px-2 py-1 rounded"
              onClick={handleSave}
            >
              ✓
            </button>
            <button
              className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
              onClick={handleCancel}
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
              className="text-xs bg-green-500 text-white px-2 py-1 rounded"
              onClick={handleSave}
            >
              ✓
            </button>
            <button
              className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
              onClick={handleCancel}
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
          onBlur={handleSave}
          className="h-8 text-sm border-blue-300 focus:border-blue-500"
          type={field === "version" ? "number" : "text"}
          step={field === "version" ? "0.01" : undefined}
        />
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer hover:bg-blue-50 p-2 rounded min-h-[32px] flex items-center text-sm transition-colors"
      onClick={() => setIsEditing(true)}
      title="Click to edit"
    >
      <span className="truncate">{value}</span>
    </div>
  );
}
