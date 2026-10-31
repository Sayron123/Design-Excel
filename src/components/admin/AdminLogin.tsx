"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/admin/actions";
import { buttonClass } from "@/components/ui/button";

export function AdminLogin() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  return (
    <form action={action} className="mt-8 max-w-sm rounded-xl bg-surface p-6">
      <label htmlFor="admin-password" className="block text-base font-semibold text-ink">
        Password
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? "admin-password-error" : undefined}
        className="mt-2 block h-12 w-full rounded-xl bg-bg px-4 text-base text-ink ring-1 ring-inset ring-border focus:outline-none focus:ring-2 focus:ring-accent"
      />
      {state.error && (
        <p id="admin-password-error" role="alert" className="mt-2 text-[14px] font-semibold text-red-700">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={buttonClass("primary", "md", "mt-5 w-full disabled:opacity-70")}>
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
