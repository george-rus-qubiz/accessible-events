import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCarousel } from "@/hooks/useCarousel";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface CarouselProps<T> {
  /** Accessible name for the carousel, e.g. "Upcoming events". */
  label: string;
  items: T[];
  perView?: number;
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
}

/**
 * Simple windowed carousel, following the WAI-ARIA APG carousel pattern:
 * each item is a labelled "slide" ("3 of 14") so its position is announced
 * when focus enters it, and a polite live region announces the new range
 * after paging.
 */
export function Carousel<T>({
  label,
  items,
  perView = 4,
  getKey,
  renderItem,
}: CarouselProps<T>) {
  const { visibleItems, startIndex, canGoPrev, canGoNext, next, prev } =
    useCarousel(items, perView);
  const slidesRef = useRef<HTMLDivElement>(null);
  const focusAfterPaging = useRef(false);
  // Only announce once the user has paged, not on first render.
  const [hasPaged, setHasPaged] = useState(false);

  // After paging, move focus to the first item on the new page. Otherwise focus
  // stays on the arrow (or is lost entirely when the arrow becomes disabled).
  useEffect(() => {
    if (!focusAfterPaging.current) {
      return;
    }
    focusAfterPaging.current = false;
    slidesRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
  }, [startIndex]);

  const page = (direction: () => void) => () => {
    focusAfterPaging.current = true;
    setHasPaged(true);
    direction();
  };

  const rangeEnd = startIndex + visibleItems.length;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      className="flex items-center gap-3"
    >
      <button
        type="button"
        onClick={page(prev)}
        disabled={!canGoPrev}
        aria-label="Previous events"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-lg ${
          canGoPrev ? "text-slate-600 hover:bg-slate-100" : "text-slate-300"
        }`}
      >
        <span aria-hidden="true">‹</span>
      </button>

      <div
        ref={slidesRef}
        className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {visibleItems.map((item, index) => (
          <div
            key={getKey(item)}
            role="group"
            aria-roledescription="slide"
            aria-label={`${startIndex + index + 1} of ${items.length}`}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={page(next)}
        disabled={!canGoNext}
        aria-label="Next events"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-lg ${
          canGoNext ? "text-slate-600 hover:bg-slate-100" : "text-slate-300"
        }`}
      >
        <span aria-hidden="true">›</span>
      </button>

      <div aria-live="polite" className="sr-only">
        {hasPaged &&
          `Showing ${startIndex + 1} to ${rangeEnd} of ${items.length}.`}
      </div>
    </section>
  );
}
