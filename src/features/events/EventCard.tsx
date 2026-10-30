import { Link } from "react-router-dom";
import type { EventItem } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";

interface EventCardProps {
  event: EventItem;
  /** When set, the whole card links to this URL. */
  href?: string;
  onDismiss?: (eventId: string) => void;
  badge?: string;
}

export function EventCard({ event, href, onDismiss, badge }: EventCardProps) {
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white ${
        href
          ? "hover:border-brand-300 hover:shadow-md focus-within:ring-2 focus-within:ring-brand-600"
          : ""
      }`}
    >
      {onDismiss && (
        <button
          type="button"
          onClick={() => onDismiss(event.id)}
          aria-label={`Remove ${event.name}`}
          className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/60 text-white hover:bg-slate-900/80"
        >
          ×
        </button>
      )}
      <div className="relative">
        <img src={event.image} className="h-36 w-full object-cover" />
        {badge && (
          <span className="absolute left-2 top-2 rounded bg-brand-500 px-2 py-0.5 text-xs font-medium text-white">
            {badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-base font-semibold text-slate-800">
          {href ? (
            // The ::after overlay stretches the link over the whole card, so
            // the card stays clickable while only the title is a Tab stop.
            <Link
              to={href}
              className="after:absolute after:inset-0 after:content-[''] focus:outline-none"
            >
              {event.name}
            </Link>
          ) : (
            event.name
          )}
        </h3>
        <div className="text-xs text-slate-400">{event.location}</div>
        <div className="text-xs text-slate-500">
          {formatDate(event.startDateTime)}
        </div>
        <div className="mt-auto pt-2 text-sm font-medium text-brand-600">
          {formatCurrency(event.price)}
        </div>
      </div>
    </article>
  );
}
