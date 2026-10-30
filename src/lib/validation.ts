import type { Credentials, NewEventInput, RegisterInput } from "@/types";

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function validateLogin(
  input: Credentials,
): ValidationErrors<Credentials> {
  const errors: ValidationErrors<Credentials> = {};

  if (!input.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(input.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!input.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

export function validateRegister(
  input: RegisterInput,
): ValidationErrors<RegisterInput> {
  const errors: ValidationErrors<RegisterInput> = {};

  if (!input.name.trim()) {
    errors.name = "Name is required.";
  }
  if (!input.email.trim()) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(input.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!input.password) {
    errors.password = "Password is required.";
  } else if (input.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (input.confirmPassword !== input.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export function validateNewEvent(
  input: NewEventInput,
): ValidationErrors<NewEventInput> {
  const errors: ValidationErrors<NewEventInput> = {};

  if (!input.name.trim()) {
    errors.name = "Event name is required.";
  }
  if (!input.image) {
    errors.image = "An image is required.";
  }
  if (!input.startDateTime) {
    errors.startDateTime = "Start date and time are required.";
  }
  if (!input.endDateTime) {
    errors.endDateTime = "End date and time are required.";
  }
  if (
    input.startDateTime &&
    input.endDateTime &&
    input.endDateTime <= input.startDateTime
  ) {
    errors.endDateTime = "End must be after the start.";
  }
  if (Number.isNaN(input.price) || input.price < 0) {
    errors.price = "Price must be zero or more.";
  }
  if (Number.isNaN(input.maxPeople) || input.maxPeople < 1) {
    errors.maxPeople = "Capacity must be at least 1.";
  }

  return errors;
}

export function hasErrors<T>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
