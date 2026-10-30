import { useMemo, useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useRegistrations } from "@/hooks/useRegistrations";
import { EventCard } from "@/features/events/EventCard";
import { EventFilters } from "@/features/events/EventFilters";

export function EventsPage() {
  const events = useEvents();
  const { registeredIds } = useRegistrations();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const locations = useMemo(
    () => Array.from(new Set(events.map((event) => event.location))).sort(),
    [events],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter((event) => {
      const matchesTerm =
        term === "" || event.name.toLowerCase().includes(term);
      const matchesLocation = location === "" || event.location === location;
      return matchesTerm && matchesLocation;
    });
  }, [events, search, location]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Events
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Find something to attend.
        </p>
      </div>

      <EventFilters
        search={search}
        onSearchChange={setSearch}
        location={location}
        onLocationChange={setLocation}
        locations={locations}
      />

      {/* Always rendered so screen readers announce changes to the count. */}
      <p role="status" className="sr-only" aria-live="polite">
        {filtered.length === 0
          ? "No events match your filters."
          : `${filtered.length} ${filtered.length === 1 ? "event" : "events"} found.`}
      </p>

      {filtered.length === 0 ? (
        <div 
          className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-600"
          aria-hidden="true" 
        >
          <p>No events match your filters.</p>
        </div>
      ) : (
        <div 
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          role="region"
          aria-label="Filtered events"
        >
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              href={`/events/${event.id}`}
              badge={registeredIds.includes(event.id) ? "Going" : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
