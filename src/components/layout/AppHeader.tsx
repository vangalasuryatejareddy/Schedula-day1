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
    <header className="border-b border-[var(--line)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/doctors" className="flex items-center gap-3" aria-label="Schedula home">
          <span className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] text-sm font-bold text-white shadow-sm">S</span>
          <span>
            <span className="block text-[15px] font-bold tracking-tight">Schedula</span>
            <span className="hidden text-xs text-[var(--muted)] sm:block">Doctor appointments</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Primary navigation">
          <Link href="/doctors" className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-stone-100 hover:text-[var(--ink)]">Find a doctor</Link>
          <Link href="/" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-stone-100 hover:text-[var(--ink)] sm:block">Dashboard</Link>
          {ready && auth ? (
            <button type="button" onClick={handleLogout} className="ml-1 rounded-lg border border-[var(--line)] px-3 py-2 text-sm font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]">Sign out</button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
