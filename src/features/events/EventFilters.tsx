import { useId } from "react";
import { TextField } from "@/components/ui/TextField";

interface EventFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  locations: string[];
}

export function EventFilters({
  search,
  onSearchChange,
  location,
  onLocationChange,
  locations,
}: EventFiltersProps) {
  const locationId = useId();

  return (
    <div className="flex flex-wrap items-end gap-4">
      <TextField
        label="Search"
        labelClassName="mb-1 text-xs font-medium text-slate-500"
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search events"
        className="w-64"
      />

      <div className="flex flex-col gap-1">
        <label
          htmlFor={locationId}
          className="text-xs font-medium text-slate-500"
        >
          Location
        </label>
        <div className="relative w-56">
          <select
            id={locationId}
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full appearance-none rounded-md border border-slate-300 bg-white py-2 pl-3 pr-8 text-sm text-slate-700"
          >
            <option value="">All locations</option>
            {locations.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400"
          >
            ▾
          </span>
        </div>
      </div>

      {(search || location) && (
        <button
          type="button"
          aria-label="Clear active filters"
          onClick={() => {
            onSearchChange("");
            onLocationChange("");
          }}
          className="pb-2 text-sm text-slate-600 hover:text-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span aria-hidden="true">✕</span>
        </button>
      )}
    </div>
  );
}
