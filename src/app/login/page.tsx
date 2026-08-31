"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/appointments/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { auth, ready, login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && auth) router.replace("/doctors");
  }, [auth, ready, router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    // This is intentionally a development/demo auth flow for Day 1.
    // Accept any non-empty username, email, word, or number combination.
    const normalizedIdentifier = identifier.trim();
    if (!normalizedIdentifier) return setError("Enter your email, username, or any name to continue.");
    if (!password.trim()) return setError("Enter a password to continue.");

    setSubmitting(true);
    window.setTimeout(() => {
      login(normalizedIdentifier);
      router.push("/doctors");
    }, 300);
  };

  if (!ready || auth) {
    return <div className="grid min-h-screen place-items-center bg-[var(--canvas)] text-sm text-[var(--muted)]">Loading Schedula…</div>;
  }

  return (
    <main className="min-h-screen bg-[var(--canvas)] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[var(--brand-deep)] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(117,220,190,0.14),transparent_34%),radial-gradient(circle_at_20%_85%,rgba(255,255,255,0.06),transparent_30%)]" />
        <div aria-hidden="true" className="absolute -bottom-40 -right-28 size-[32rem] rounded-full border-[54px] border-white/[0.045]" />
        <div aria-hidden="true" className="absolute right-20 top-28 size-40 rounded-full border-[25px] border-emerald-200/[0.08]" />

        <div className="relative z-10 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-white text-sm font-extrabold text-[var(--brand-deep)] shadow-sm">S</span>
          <div>
            <div className="text-base font-extrabold tracking-tight">Schedula</div>
            <div className="text-[10px] font-medium text-emerald-100/60">Doctor appointments</div>
          </div>
        </div>

        <div className="relative z-10 max-w-xl pb-10 xl:pb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold text-emerald-100/85">
            <span className="size-1.5 rounded-full bg-emerald-300" /> Simple care, better scheduling
          </div>
          <h1 className="max-w-lg text-4xl font-extrabold leading-[1.06] tracking-[-0.04em] xl:text-6xl">Healthcare appointments, made simple.</h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-emerald-50/70 xl:text-[15px]">Find a specialist, choose a convenient time, and keep your appointment details organized in one calm, focused experience.</p>

          <div className="mt-9 grid max-w-lg grid-cols-3 gap-3">
            {[
              ["01", "Find", "Choose a specialist"],
              ["02", "Schedule", "Pick a time"],
              ["03", "Confirm", "You're all set"],
            ].map(([number, title, copy]) => (
              <div key={number} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                <div className="text-[10px] font-bold text-emerald-200/55">{number}</div>
                <div className="mt-3 text-xs font-bold">{title}</div>
                <div className="mt-1 text-[10px] leading-4 text-emerald-100/50">{copy}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-emerald-100/45">Schedula · Internship demo experience</div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-[430px]">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] text-sm font-extrabold text-white">S</span>
            <div>
              <div className="text-base font-extrabold tracking-tight">Schedula</div>
              <div className="text-[10px] text-[var(--muted)]">Doctor appointments</div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-[var(--line)] bg-white shadow-[0_24px_80px_rgba(27,41,37,0.08)]">
            <div className="border-b border-[var(--line)] px-6 pb-6 pt-7 sm:px-8 sm:pt-8">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-[var(--brand)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true"><path d="M12 3v18M3 12h18" /></svg>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">Welcome to Schedula</p>
              <h2 className="mt-2 text-[28px] font-extrabold tracking-[-0.035em]">Let’s get started.</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">Enter anything you’d like to use as your login name. This Day 1 demo does not require a real email account.</p>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-7">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="identifier" className="text-xs font-bold text-[var(--ink)]">Email or username</label>
                  <input id="identifier" name="identifier" type="text" autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="e.g. surya, doctor123, hello@demo" className="mt-2 h-12 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" aria-describedby={error ? "login-error" : "identifier-help"} />
                  <p id="identifier-help" className="mt-2 text-[11px] text-[var(--muted)]">Any letters, words, numbers, or an email-style value works.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-bold text-[var(--ink)]">Password</label>
                    <span className="text-[10px] font-medium text-[var(--muted)]">Demo only</span>
                  </div>
                  <div className="relative mt-2">
                    <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter any password" className="h-12 w-full rounded-xl border border-[var(--line)] bg-white px-4 pr-20 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-2 top-2 h-8 rounded-lg px-2.5 text-[10px] font-bold text-[var(--muted)] hover:bg-slate-50 hover:text-[var(--ink)]" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
                  </div>
                </div>

                {error ? <p id="login-error" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold leading-5 text-red-800" role="alert">{error}</p> : null}

                <button type="submit" disabled={submitting} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 text-sm font-extrabold text-white shadow-[0_8px_22px_rgba(14,107,86,0.18)] hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? "Setting up your session…" : "Continue to Schedula"}
                  {!submitting ? <span aria-hidden="true">→</span> : null}
                </button>
              </form>

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[var(--canvas)] p-4">
                <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-white text-[var(--brand)] shadow-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 2.8 7.9 7 10 4.2-2.1 7-5.5 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7 3.4-3.4"/></svg>
                </div>
                <p className="text-[11px] leading-5 text-[var(--muted)]"><span className="font-bold text-[var(--ink)]">Quick demo access.</span> No real account or email verification is needed for this internship prototype. Your session is saved locally in this browser.</p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-[10px] leading-5 text-[var(--muted)]">By continuing, you’re entering the Schedula appointment demo.</p>
          <p className="mt-3 text-center text-xs text-[var(--muted)]">Are you a doctor? <a href="/doctor/login" className="font-bold text-[var(--brand)] hover:underline">Open the Doctor Portal</a></p>
        </div>
      </section>
    </main>
  );
}
