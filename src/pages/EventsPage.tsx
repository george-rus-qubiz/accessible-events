import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { useRegistrations } from "@/hooks/useRegistrations";
import { EventCard } from "@/features/events/EventCard";
import { EventFilters } from "@/features/events/EventFilters";

export function EventsPage() {
  const events = useEvents();
  const { registeredIds } = useRegistrations();
  const navigate = useNavigate();
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
        <div className="text-2xl font-semibold text-slate-800">Events</div>
        <div className="text-sm text-slate-400">Find something to attend.</div>
      </div>

      <EventFilters
        search={search}
        onSearchChange={setSearch}
        location={location}
        onLocationChange={setLocation}
        locations={locations}
      />

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
          No events match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onOpen={(id) => navigate(`/events/${id}`)}
              badge={registeredIds.includes(event.id) ? "Going" : undefined}
            />
          ))}
        </div>
      )}

      {/* <div className="mb-6 max-w-xs">
        <label htmlFor="event-filter" className="block text-sm font-medium text-slate-700 mb-1">
          Filter Events
        </label>
        <select
          id="event-filter"
          value={filterValue} // Bind this to your filter state (e.g., status, category)
          onChange={(e) => setFilterValue(e.target.value)} // Update state on change
          className="block w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">All Events</option>
          <option value="going">Going</option>
          <option value="upcoming">Upcoming</option>
        </select>
        </div> */}
    </div>
  );
}
