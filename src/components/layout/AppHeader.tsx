"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/appointments/hooks/useAuth";

export function AppHeader() {
  const router = useRouter();
  const { auth, ready, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Schedula home">
          <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-sm font-bold text-white shadow-sm">S</span>
          <span>
            <span className="block text-[15px] font-bold tracking-tight">Schedula</span>
            <span className="hidden text-xs text-[var(--muted)] sm:block">Healthcare appointments</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary navigation">
          <Link href="/doctors" className="rounded-lg px-2.5 py-2 text-xs font-semibold text-[var(--muted)] hover:bg-stone-100 hover:text-[var(--ink)] sm:px-3 sm:text-sm">Patient Portal</Link>
          <Link href="/doctor" className="rounded-lg px-2.5 py-2 text-xs font-semibold text-[var(--brand)] hover:bg-emerald-50 sm:px-3 sm:text-sm">Doctor Portal</Link>
          <Link href="/doctor/register" className="hidden rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-[var(--brand)] hover:border-[var(--brand)] sm:block">Join as Doctor</Link>
          <Link href="/" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-stone-100 hover:text-[var(--ink)] lg:block">Dashboard</Link>
          {ready && auth ? (
            <button type="button" onClick={handleLogout} className="ml-1 rounded-lg border border-[var(--line)] px-2.5 py-2 text-xs font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)] sm:px-3 sm:text-sm">Sign out</button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
