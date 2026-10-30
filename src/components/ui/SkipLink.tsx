export const MAIN_CONTENT_ID = "main-content";

/**
 * "Skip to main content" link. Visually hidden until focused, so it appears
 * as the first Tab stop for keyboard users only. The target needs
 * `id={MAIN_CONTENT_ID}` and `tabIndex={-1}` so focus actually moves there.
 */
export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-700 focus:shadow focus:outline-none focus:ring-2 focus:ring-brand-600"
    >
      Skip to main content
    </a>
  );
}
