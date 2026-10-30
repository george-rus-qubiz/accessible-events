interface FieldErrorProps {
  /** Referenced by the field's `aria-describedby`. */
  id: string;
  message?: string;
}

/**
 * Error message for a single form field.
 *
 * The wrapper is always rendered so the live region exists before a message
 * appears — screen readers only announce changes to regions already in the
 * DOM. The icon and "Error:" prefix mean the state isn't conveyed by colour
 * alone.
 */
export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <div id={id} aria-live="polite" className="text-xs text-red-700">
      {message && (
        <p className="mt-1 flex items-start gap-1">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="mt-px h-3.5 w-3.5 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            <span className="sr-only">Error: </span>
            {message}
          </span>
        </p>
      )}
    </div>
  );
}
