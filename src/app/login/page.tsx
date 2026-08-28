"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/appointments/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { auth, ready, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && auth) router.replace("/doctors");
  }, [auth, ready, router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const normalizedEmail = email.trim();
    if (!normalizedEmail) return setError("Enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return setError("Enter a valid email address.");
    if (!password) return setError("Enter your password.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setSubmitting(true);
    window.setTimeout(() => { login(normalizedEmail); router.push("/doctors"); }, 350);
  };

  if (!ready || auth) return <div className="grid min-h-screen place-items-center text-sm text-[var(--muted)]">Loading Schedula…</div>;

  return (
    <main className="min-h-screen bg-[var(--canvas)] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[var(--brand-deep)] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="relative z-10"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-white text-sm font-bold text-[var(--brand-deep)]">S</span><span className="text-lg font-bold">Schedula</span></div><div className="mt-20 max-w-md"><p className="text-sm font-semibold text-emerald-200">Simple care, better scheduling.</p><h1 className="mt-3 text-4xl font-bold leading-tight xl:text-5xl">Healthcare appointments without the hassle.</h1><p className="mt-5 text-sm leading-7 text-emerald-50/75">Find a trusted specialist, choose a convenient time, and keep your appointment details in one place.</p></div></div>
        <div className="relative z-10 flex items-center gap-3 text-xs text-emerald-100/70"><span className="size-2 rounded-full bg-emerald-300" /> Secure-looking demo experience for the internship task</div>
        <div aria-hidden="true" className="absolute -bottom-28 -right-28 size-96 rounded-full border-[42px] border-white/5" /><div aria-hidden="true" className="absolute right-20 top-24 size-40 rounded-full border-[24px] border-emerald-300/10" />
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] text-sm font-bold text-white">S</span><span className="text-lg font-bold">Schedula</span></div></div>
          <div className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-[0_20px_60px_rgba(27,41,37,0.07)] sm:p-8">
            <div><p className="text-sm font-semibold text-[var(--brand)]">Welcome back</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Sign in to Schedula</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Use your email and password to continue to doctor appointments.</p></div>
            <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
              <div><label htmlFor="email" className="text-sm font-semibold">Email address</label><input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 h-12 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" aria-describedby={error ? "login-error" : undefined} /></div>
              <div><label htmlFor="password" className="text-sm font-semibold">Password</label><input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="mt-2 h-12 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></div>
              {error ? <p id="login-error" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">{error}</p> : null}
              <button type="submit" disabled={submitting} className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--brand)] px-4 text-sm font-bold text-white hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Signing in…" : "Sign in"}</button>
            </form>
            <div className="mt-6 rounded-xl bg-[var(--canvas)] p-3 text-xs leading-5 text-[var(--muted)]"><span className="font-semibold text-[var(--ink)]">Demo login:</span> any valid email + a password with 6 or more characters.</div>
          </div>
          <p className="mt-5 text-center text-xs text-[var(--muted)]">By continuing, you’re entering the Schedula appointment demo.</p>
        </div>
      </section>
    </main>
  );
}
