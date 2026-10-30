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
    <div className="flex flex-col gap-10">
      <div>
        <div className="text-2xl font-semibold text-slate-800">
          Hello, {currentUser?.name?.split(" ")[0]}
        </div>
        <div className="text-sm text-slate-400">
          Here is what is happening with your events.
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <div className="text-lg font-semibold text-slate-800">My events</div>
        {myEvents.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
            You have not signed up for any events yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          Upcoming events
        </div>
        <Carousel
          items={upcomingEvents}
          perView={4}
          getKey={(event) => event.id}
          renderItem={(event) => (
            <EventCard event={event} href={`/events/${event.id}`} />
          )}
        />
      </section>
    </div>
  );
}
