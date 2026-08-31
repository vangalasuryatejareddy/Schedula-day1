"use client";
import { useEffect, useMemo, useState } from "react";
import { createRecurringSlots, deleteAvailabilitySlot, getAvailabilitySlots, saveAvailabilitySlot } from "@/features/doctor-portal/storage";
import type { AvailabilitySlot, DoctorProfile } from "@/features/doctor-portal/types";

const today = new Date().toISOString().slice(0, 10);
const formatDate = (date: string) => new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));

export function AvailabilityManager({ doctor }: { doctor: DoctorProfile }) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [mode, setMode] = useState<"single" | "weekly">("single");
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");
  const [weeks, setWeeks] = useState("8");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const refresh = () => setSlots(getAvailabilitySlots(doctor.id).sort((a,b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)));
  useEffect(() => { refresh(); }, [doctor.id]);
  const upcoming = useMemo(() => slots.filter((slot) => slot.date >= today), [slots]);
  const submit = (event: React.FormEvent) => {
    event.preventDefault(); setError(""); setSuccess("");
    if (!date) return setError("Please choose a date.");
    if (!startTime || !endTime || endTime <= startTime) return setError("End time must be later than start time.");
    const duplicate = slots.some((slot) => slot.date === date && slot.startTime === startTime && slot.endTime === endTime);
    if (mode === "single" && duplicate) return setError("This exact slot already exists.");
    if (mode === "single") {
      saveAvailabilitySlot({ id: `slot-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, doctorId: doctor.id, date, startTime, endTime, recurrence: "none", createdAt: new Date().toISOString() });
      setSuccess("Availability slot added successfully.");
    } else {
      const count = Math.min(24, Math.max(2, Number(weeks) || 8));
      createRecurringSlots({ doctorId: doctor.id, startDate: date, startTime, endTime, weeks: count });
      setSuccess(`Weekly availability created for ${count} weeks.`);
    }
    refresh();
  };
  return <section className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[0_12px_40px_rgba(27,41,37,0.05)] sm:p-7" aria-labelledby="availability-title">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-semibold text-[var(--brand)]">Appointment availability</p><h2 id="availability-title" className="mt-1 text-xl font-bold tracking-tight">Create and manage your slots</h2><p className="mt-1 text-sm text-[var(--muted)]">Slots saved here immediately become available to users in the Schedula booking portal.</p></div><span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[var(--brand)]">{upcoming.length} upcoming slots</span></div>
    <form onSubmit={submit} className="mt-6 rounded-2xl bg-[var(--canvas)] p-4 sm:p-5">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Availability type"><button type="button" onClick={() => setMode("single")} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === "single" ? "bg-[var(--brand)] text-white" : "bg-white text-[var(--muted)]"}`}>One-time slot</button><button type="button" onClick={() => setMode("weekly")} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === "weekly" ? "bg-[var(--brand)] text-white" : "bg-white text-[var(--muted)]"}`}>Recurring weekly</button></div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><label className="text-sm font-semibold">{mode === "weekly" ? "First date" : "Date"}<input min={today} value={date} onChange={(e) => setDate(e.target.value)} type="date" className="mt-1.5 h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></label><label className="text-sm font-semibold">Start time<input value={startTime} onChange={(e) => setStartTime(e.target.value)} type="time" className="mt-1.5 h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></label><label className="text-sm font-semibold">End time<input value={endTime} onChange={(e) => setEndTime(e.target.value)} type="time" className="mt-1.5 h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></label>{mode === "weekly" ? <label className="text-sm font-semibold">Repeat for (weeks)<input min="2" max="24" value={weeks} onChange={(e) => setWeeks(e.target.value)} type="number" className="mt-1.5 h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" /></label> : <div className="flex items-end"><button className="h-11 w-full rounded-xl bg-[var(--brand)] px-4 text-sm font-bold text-white hover:bg-[var(--brand-deep)]">Add availability</button></div>}</div>
      {mode === "weekly" ? <button className="mt-4 h-11 w-full rounded-xl bg-[var(--brand)] px-4 text-sm font-bold text-white hover:bg-[var(--brand-deep)]">Create recurring availability</button> : null}
      {error ? <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p> : null}{success ? <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{success}</p> : null}
    </form>
    <div className="mt-7"><div className="flex items-center justify-between"><h3 className="font-bold">Existing slots</h3><span className="text-xs text-[var(--muted)]">Delete a slot to remove it from the user portal.</span></div>{upcoming.length === 0 ? <div className="mt-4 rounded-2xl border border-dashed border-[var(--line)] p-7 text-center"><p className="font-semibold">No availability yet</p><p className="mt-1 text-sm text-[var(--muted)]">Create your first date and time slot above.</p></div> : <div className="mt-4 grid gap-3 md:grid-cols-2">{upcoming.map((slot) => <article key={slot.id} className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--line)] p-4"><div><p className="text-sm font-bold">{formatDate(slot.date)}</p><p className="mt-1 text-sm text-[var(--muted)]">{slot.startTime} – {slot.endTime}</p><p className="mt-1 text-xs font-semibold text-[var(--brand)]">{slot.recurrence === "weekly" ? "Recurring weekly" : "One-time availability"}</p></div><button type="button" onClick={() => { deleteAvailabilitySlot(slot.id); refresh(); }} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">Remove</button></article>)}</div>}</div>
  </section>;
}
