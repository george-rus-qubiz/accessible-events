import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { MAIN_CONTENT_ID, SkipLink } from "@/components/ui/SkipLink";
import { DEMO_CREDENTIALS } from "@/data/seedUsers";
import type { Credentials } from "@/types";
import {
  hasErrors,
  validateLogin,
  type ValidationErrors,
} from "@/lib/validation";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<ValidationErrors<Credentials>>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validateLogin({ email, password });
    setErrors(validation);
    if (hasErrors(validation)) {
      setError("");
      return;
    }
    const result = login({ email, password });
    if (result.ok) {
      navigate("/dashboard");
    } else {
      setError(result.error ?? "Unable to log in.");
    }
  };

  return (
    <>
    <SkipLink />
    <main
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4 focus:outline-none"
    >
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="text-2xl font-semibold text-brand-600"><h1>Eventer</h1></div>
          <div className="text-sm text-slate-600"><p>
            Log in to your account</p></div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            error={errors.email}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
          />
          <Button
            type="submit"
            className="mt-2 w-full !bg-brand-600 hover:!bg-brand-700 focus:outline-none focus:ring-[4px] focus:ring-[#9b51e0] focus:ring-offset-2"
          >
            Log in
          </Button>
        </form>

        <div className="mt-6 rounded-md bg-slate-50 p-3 text-xs text-slate-500">
          <div className="mb-1 font-medium text-slate-600">Demo accounts</div>
          <div>
            Admin: {DEMO_CREDENTIALS.admin.email} /{" "}
            {DEMO_CREDENTIALS.admin.password}
          </div>
          <div>
            User: {DEMO_CREDENTIALS.user.email} /{" "}
            {DEMO_CREDENTIALS.user.password}
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-slate-600">
          No account?{" "}
          <Link
            to="/register"
            className="text-brand-600 underline underline-offset-2 hover:text-brand-700"
          >
            Create one
          </Link>
        </div>
      </div>
    </main>
    </>
  );
}
