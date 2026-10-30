import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useEvents } from "@/hooks/useEvents";
import { useRegistrations } from "@/hooks/useRegistrations";
import { EventCard } from "@/features/events/EventCard";
import { Carousel } from "@/components/ui/Carousel";

export function DashboardPage() {
  const { currentUser } = useAuth();
  const events = useEvents();
  const { registeredIds, unregister } = useRegistrations();

  const myEvents = useMemo(
    () => events.filter((event) => registeredIds.includes(event.id)),
    [events, registeredIds],
  );

  const upcomingEvents = useMemo(
    () => events.filter((event) => !registeredIds.includes(event.id)),
    [events, registeredIds],
  );

  return (
    <main className="flex flex-col gap-10">
      <div>
        <div className="text-2xl font-semibold text-slate-800">
          <h1>Hello, {currentUser?.name?.split(" ")[0]}</h1>
        </div>
        <div className="text-sm text-slate-400">
          <p>
            Here is what is happening with your events.
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <div className="text-lg font-semibold text-slate-800">
          <h2>
            My events
          </h2>
        </div>
        {myEvents.length === 0 ? (
          <div 
            className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600" 
            role="status" 
            aria-live="polite"
          >
            <p>You have not signed up for any events yet.</p>
          </div>
        ) : (
          <div 
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"  
            role="region"
            aria-label="Your registered events"
          >
            {myEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                href={`/events/${event.id}`}
                onDismiss={unregister}
                badge="Going"
              />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="text-lg font-semibold text-slate-800">
          <h2>
            Upcoming events
          </h2>
        </div>
        <Carousel
          label="Upcoming events"
          items={upcomingEvents}
          perView={4}
          getKey={(event) => event.id}
          renderItem={(event) => (
            <EventCard event={event} href={`/events/${event.id}`} />
          )}
        />
      </section>
    </main>
  );
}
