import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { RegisterInput } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { MAIN_CONTENT_ID, SkipLink } from "@/components/ui/SkipLink";
import { validateRegister, type ValidationErrors } from "@/lib/validation";

const EMPTY_FORM: RegisterInput = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  isAdmin: false,
};

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterInput>(EMPTY_FORM);
  const [errors, setErrors] = useState<ValidationErrors<RegisterInput>>({});
  const [formError, setFormError] = useState("");

  const update = <K extends keyof RegisterInput>(
    key: K,
    value: RegisterInput[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validateRegister(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }
    const result = register(form);
    if (result.ok) {
      navigate("/dashboard");
    } else {
      setFormError(result.error ?? "Unable to create the account.");
    }
  };

  return (
    <>
    <SkipLink />
    <main
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 focus:outline-none"
    >
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="text-2xl font-semibold text-brand-600">
            <h1>
              Create your account
            </h1>
          </div>
          <div className="text-sm text-slate-600">
            <p>
              Join Eventer in a few seconds
            </p>
          </div>
        </div>

        {formError && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            <p>
              {formError}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <TextField
            label="Full name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jane Doe"
            error={errors.name}
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            error={errors.email}
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="At least 6 characters"
            error={errors.password}
          />
          <TextField
            label="Confirm password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            placeholder="Repeat your password"
            error={errors.confirmPassword}
          />
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.isAdmin}
              onChange={(e) => update("isAdmin", e.target.checked)}
              className="h-4 w-4"
            />
            Register as an administrator
          </label>

          <Button
            type="submit"
            className="mt-2 w-full !bg-brand-600 hover:!bg-brand-700 focus:outline-none focus:ring-[4px] focus:ring-[#9b51e0] focus:ring-offset-2"
          >
            Create account
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-600 underline underline-offset-2 hover:text-brand-700"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
    </>
  );
}
