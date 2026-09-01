"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { DoctorCard } from "@/features/appointments/components/DoctorCard";
import { getDoctors } from "@/features/appointments/api/doctors";
import { useAuth } from "@/features/appointments/hooks/useAuth";
import type { Doctor } from "@/types/doctor";

export function DoctorsView() {
  const router = useRouter();
  const { auth, ready } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    if (ready && !auth) router.replace("/login");
  }, [auth, ready, router]);

  useEffect(() => {
    if (!ready || !auth) return;
    getDoctors().then((data) => { setDoctors(data); setStatus("ready"); }).catch(() => setStatus("error"));
  }, [auth, ready]);

  const specialties = useMemo(() => ["All specialties", ...Array.from(new Set(doctors.map((doctor) => doctor.specialty)))], [doctors]);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return doctors.filter((doctor) => {
      const matchesQuery = !normalized || `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(normalized);
      const matchesSpecialty = specialty === "All specialties" || doctor.specialty === specialty;
      return matchesQuery && matchesSpecialty;
    });
  }, [doctors, query, specialty]);

  if (!ready || !auth) return <div className="grid min-h-screen place-items-center text-sm text-[var(--muted)]">Loading your Schedula workspace…</div>;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <section className="relative overflow-hidden rounded-3xl bg-[var(--brand-deep)] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-10">
          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-emerald-200">Find the right care</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Book a doctor in a few simple steps.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/80 sm:text-base">Browse available specialists, choose a convenient time, and confirm your appointment without the back-and-forth.</p><div className="mt-5 flex flex-wrap items-center gap-3"><span className="text-xs font-semibold text-emerald-100/65">Are you a healthcare professional?</span><a href="/doctor" className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-xs font-bold text-white hover:bg-white/10">Open Doctor Portal →</a></div>
          </div>
          <div aria-hidden="true" className="absolute -right-12 -top-16 size-56 rounded-full border-[28px] border-white/5 sm:size-72" />
          <div aria-hidden="true" className="absolute -bottom-24 right-20 size-48 rounded-full border-[24px] border-emerald-300/10" />
        </section>

        <section className="mt-8" aria-labelledby="doctors-title">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="text-sm font-semibold text-[var(--brand)]">Our specialists</p><h2 id="doctors-title" className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Choose your doctor</h2><p className="mt-2 text-sm text-[var(--muted)]">Select a specialist to view available dates and time slots.</p></div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative"><span className="sr-only">Search doctors</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search doctors" className="h-11 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm outline-none placeholder:text-stone-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:w-56" /></label>
              <label><span className="sr-only">Filter by specialty</span><select value={specialty} onChange={(event) => setSpecialty(event.target.value)} className="h-11 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 sm:w-48">{specialties.map((item) => <option key={item}>{item}</option>)}</select></label>
            </div>
          </div>

          {status === "loading" && <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading doctors">{[1,2,3,4,5,6].map((item) => <div key={item} className="h-72 animate-pulse rounded-2xl border border-[var(--line)] bg-white" />)}</div>}
          {status === "error" && <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 p-8 text-center" role="alert"><p className="font-semibold text-red-900">We couldn’t load the doctor list.</p><button type="button" onClick={() => window.location.reload()} className="mt-3 text-sm font-bold text-red-700 underline">Try again</button></div>}
          {status === "ready" && filtered.length === 0 && <div className="mt-7 rounded-2xl border border-dashed border-[var(--line)] bg-white p-10 text-center"><p className="font-semibold">No doctors match your search.</p><p className="mt-1 text-sm text-[var(--muted)]">Try another name or specialty.</p></div>}
          {status === "ready" && filtered.length > 0 && <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}</div>}
        </section>
      </main>
    </div>
  );
}
