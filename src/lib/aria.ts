/**
 * ARIA props that link an input to its FieldError. Keeps any description the
 * caller already set.
 */
export function fieldErrorProps(
  errorId: string,
  error: string | undefined,
  describedBy?: string,
) {
  const ids = [describedBy, error ? errorId : undefined].filter(Boolean);
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": ids.length > 0 ? ids.join(" ") : undefined,
  };
}
