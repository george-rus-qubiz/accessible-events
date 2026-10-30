import { useId, type InputHTMLAttributes } from "react";
import { FieldError } from "@/components/ui/FieldError";
import { fieldErrorProps } from "@/lib/aria";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Basic labelled text input used across the forms.
 */
export function TextField({
  label,
  error,
  id,
  className = "",
  "aria-describedby": describedBy,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col">
      <label
        htmlFor={inputId}
        className="mb-1 text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`rounded-md border px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 ${
          error ? "border-red-600" : "border-slate-300"
        } ${className}`}
        {...fieldErrorProps(errorId, error, describedBy)}
        {...rest}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}
