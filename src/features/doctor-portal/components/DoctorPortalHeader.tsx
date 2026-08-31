"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearDoctorSession } from "@/features/doctor-portal/storage";

const links = [
  { href: "/doctor/dashboard", label: "Dashboard" },
  { href: "/doctor/profile", label: "My Profile & Slots" },
  { href: "/doctor/appointments", label: "Appointments" },
];

export function DoctorPortalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  return <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-white/95 backdrop-blur">
    <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
      <Link href="/doctor/dashboard" className="flex shrink-0 items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[var(--brand)] font-bold text-white">S</span><span><span className="block text-[15px] font-bold">Schedula</span><span className="hidden text-xs text-[var(--muted)] sm:block">Doctor portal</span></span></Link>
      <nav className="flex items-center gap-1" aria-label="Doctor portal navigation">
        <Link href="/doctors" className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-stone-100 hover:text-[var(--ink)] xl:block">Patient Portal</Link>
        {links.map((item) => <Link key={item.href} href={item.href} className={`rounded-lg px-2 py-2 text-[11px] font-semibold sm:px-3 sm:text-sm ${pathname === item.href ? "bg-emerald-50 text-[var(--brand)]" : "text-[var(--muted)] hover:bg-stone-100 hover:text-[var(--ink)]"}`}>{item.label}</Link>)}
        <button type="button" onClick={() => { clearDoctorSession(); router.push("/doctor/login"); }} className="ml-1 rounded-lg border border-[var(--line)] px-2 py-2 text-[11px] font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)] sm:px-3 sm:text-sm">Sign out</button>
      </nav>
    </div>
  </header>;
}
