import type { ReactNode } from "react";
import { useCarousel } from "@/hooks/useCarousel";

interface CarouselProps<T> {
  items: T[];
  perView?: number;
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
}

/**
 * Simple windowed carousel.
 */
export function Carousel<T>({
  items,
  perView = 4,
  getKey,
  renderItem,
}: CarouselProps<T>) {
  const { visibleItems, canGoPrev, canGoNext, next, prev } = useCarousel(
    items,
    perView,
  );

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={prev}
        disabled={!canGoPrev}
        aria-label="Previous events"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-lg ${
          canGoPrev ? "text-slate-600 hover:bg-slate-100" : "text-slate-300"
        }`}
      >
        <span aria-hidden="true">‹</span>
      </button>

      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visibleItems.map((item) => (
          <div key={getKey(item)}>{renderItem(item)}</div>
        ))}
      </div>

      <button
        type="button"
        onClick={next}
        disabled={!canGoNext}
        aria-label="Next events"
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-lg ${
          canGoNext ? "text-slate-600 hover:bg-slate-100" : "text-slate-300"
        }`}
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  );
}
