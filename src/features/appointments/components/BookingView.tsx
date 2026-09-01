"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { getDoctors } from "@/features/appointments/api/doctors";
import { getBookings, saveBooking } from "@/features/appointments/api/bookings";
import { useAuth } from "@/features/appointments/hooks/useAuth";
import type { BookingRecord } from "@/features/appointments/types";
import type { Doctor } from "@/types/doctor";

const formatDate = (date: string) => new Intl.DateTimeFormat("en-IN", { weekday: "short", month: "short", day: "numeric" }).format(new Date(`${date}T12:00:00`));
const formatLongDate = (date: string) => new Intl.DateTimeFormat("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00:00`));

function CheckIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6"><path fill="currentColor" d="m9.55 18.1-5.3-5.3 1.4-1.4 3.9 3.9 8.8-8.8 1.4 1.4-10.2 10.2Z" /></svg>;
}

export function BookingView() {
  const params = useParams<{ doctorId: string }>();
  const router = useRouter();
  const { auth, ready } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [bookingError, setBookingError] = useState("");
  const [appointmentType, setAppointmentType] = useState<"In-person"|"Video consultation"|"Follow-up">("In-person");

  useEffect(() => {
    if (ready && !auth) router.replace("/login");
  }, [auth, ready, router]);

  useEffect(() => {
    if (!ready || !auth) return;
    getDoctors().then((data) => { setDoctors(data); setStatus("ready"); }).catch(() => setStatus("error"));
  }, [auth, ready]);

  const doctor = doctors.find((item) => item.id === params.doctorId);

  useEffect(() => {
    if (doctor && !selectedDate) setSelectedDate(doctor.availableDates[0] ?? "");
  }, [doctor, selectedDate]);

  const availableSlots = useMemo(() => doctor?.slotsByDate[selectedDate] ?? [], [doctor, selectedDate]);
  const bookedTimes = useMemo(() => getBookings().filter((item) => item.doctorId === doctor?.id && item.date === selectedDate).map((item) => item.time), [doctor?.id, selectedDate]);
  const openSlots = availableSlots.filter((slot) => !bookedTimes.includes(slot));

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
    setBookingError("");
  };

  const handleConfirm = () => {
    setBookingError("");
    if (!doctor || !selectedDate || !selectedTime) {
      setBookingError("Please select an available date and time before confirming.");
      return;
    }

    if (getBookings().some((item) => item.doctorId === doctor.id && item.date === selectedDate && item.time === selectedTime)) {
      setBookingError("That time was just booked. Please choose another slot.");
      setSelectedTime("");
      return;
    }

    const nextBooking: BookingRecord = {
      id: `SCH-${Math.floor(100000 + Math.random() * 900000)}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate,
      time: selectedTime,
      createdAt: new Date().toISOString(),
      patientName: auth?.email || "Schedula user",
      patientId: auth?.email,
      reason: "General consultation",
      appointmentType,
      status: "pending",
    };

    try {
      saveBooking(nextBooking);
      setBooking(nextBooking);
    } catch {
      setBookingError("We couldn’t save the appointment on this device. Please try again.");
    }
  };

  if (!ready || !auth) return <div className="grid min-h-screen place-items-center text-sm text-[var(--muted)]">Loading your Schedula workspace…</div>;
  if (status === "loading") return <div className="grid min-h-screen place-items-center text-sm text-[var(--muted)]">Loading appointment details…</div>;
  if (status === "error" || !doctor) return <><AppHeader /><main className="mx-auto max-w-xl px-4 py-16 text-center"><div className="rounded-2xl border border-red-200 bg-red-50 p-8" role="alert"><h1 className="text-xl font-bold">Doctor not found</h1><p className="mt-2 text-sm text-red-800">We couldn’t find the selected doctor. Please return to the doctor list.</p><Link href="/doctors" className="mt-5 inline-flex rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-bold text-white">Back to doctors</Link></div></main></>;

  if (booking) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center px-4 py-10 sm:px-6">
          <section className="w-full rounded-3xl border border-[var(--line)] bg-white p-6 text-center shadow-[0_20px_60px_rgba(27,41,37,0.08)] sm:p-10" aria-labelledby="confirmation-title">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-[var(--brand)]"><CheckIcon /></div>
            <p className="mt-6 text-sm font-semibold text-[var(--brand)]">Appointment confirmed</p>
            <h1 id="confirmation-title" className="mt-1 text-3xl font-bold tracking-tight">You’re all set.</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">Your appointment has been saved on this device. Keep this confirmation for your records.</p>

            <div className="mt-8 rounded-2xl bg-[var(--canvas)] p-5 text-left sm:p-6">
              <div className="flex items-center gap-4"><div className="grid size-12 place-items-center rounded-xl bg-white font-bold text-[var(--brand-deep)] shadow-sm">{doctor.initials}</div><div><p className="font-bold">{booking.doctorName}</p><p className="mt-0.5 text-sm text-[var(--muted)]">{booking.specialty}</p></div></div>
              <dl className="mt-6 grid gap-4 border-t border-[var(--line)] pt-5 sm:grid-cols-2"><div><dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Date</dt><dd className="mt-1 text-sm font-bold">{formatLongDate(booking.date)}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Time</dt><dd className="mt-1 text-sm font-bold">{booking.time}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Reference</dt><dd className="mt-1 text-sm font-bold">{booking.id}</dd></div><div><dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">Status</dt><dd className="mt-1 text-sm font-bold text-[var(--brand)]">Confirmed</dd></div></dl>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"><Link href="/doctors" className="rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--brand-deep)]">Book another appointment</Link><Link href="/" className="rounded-xl border border-[var(--line)] px-5 py-3 text-sm font-bold hover:border-[var(--brand)] hover:text-[var(--brand)]">Go to dashboard</Link></div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Link href="/doctors" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--brand)]">← Back to doctors</Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <section className="rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[0_12px_40px_rgba(27,41,37,0.05)] sm:p-7" aria-labelledby="booking-title">
            <div className="flex items-center gap-4 border-b border-[var(--line)] pb-6"><div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 font-bold text-[var(--brand-deep)]">{doctor.initials}</div><div><p className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Book with</p><h1 id="booking-title" className="mt-1 text-xl font-bold tracking-tight">{doctor.name}</h1><p className="mt-1 text-sm text-[var(--muted)]">{doctor.specialty} · {doctor.experienceYears} years experience</p></div></div>

            <div className="mt-7"><div className="flex items-center justify-between"><div><p className="text-sm font-bold">1. Select a date</p><p className="mt-1 text-xs text-[var(--muted)]">Only dates with available appointments are shown.</p></div><span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">{doctor.availableDates.length} days available</span></div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">{doctor.availableDates.map((date) => <button key={date} type="button" onClick={() => handleDateChange(date)} aria-pressed={selectedDate === date} className={`rounded-xl border px-3 py-3 text-left ${selectedDate === date ? "border-[var(--brand)] bg-emerald-50 ring-2 ring-emerald-100" : "border-[var(--line)] hover:border-emerald-300"}`}><span className="block text-xs text-[var(--muted)]">{formatDate(date).split(" ")[0]}</span><span className="mt-1 block text-sm font-bold">{formatDate(date).replace(`${formatDate(date).split(" ")[0]} `, "")}</span></button>)}</div>
            </div>

            <div className="mt-8 border-t border-[var(--line)] pt-7"><div className="mb-4"><p className="text-sm font-bold">2. Appointment type</p><div className="mt-3 flex flex-wrap gap-2">{(["In-person","Video consultation","Follow-up"] as const).map(type=><button key={type} type="button" onClick={()=>setAppointmentType(type)} className={`rounded-xl border px-3 py-2 text-xs font-bold ${appointmentType===type?"border-[var(--brand)] bg-emerald-50 text-[var(--brand)]":"border-[var(--line)]"}`}>{type}</button>)}</div></div><div><p className="text-sm font-bold">3. Select a time</p><p className="mt-1 text-xs text-[var(--muted)]">Choose one available slot for your appointment.</p></div>
              {openSlots.length === 0 ? <div className="mt-4 rounded-xl border border-dashed border-[var(--line)] bg-[var(--canvas)] p-5 text-sm text-[var(--muted)]">No slots remain for this date. Please choose another date.</div> : <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{openSlots.map((slot) => <button key={slot} type="button" onClick={() => { setSelectedTime(slot); setBookingError(""); }} aria-pressed={selectedTime === slot} className={`rounded-xl border px-3 py-3 text-sm font-semibold ${selectedTime === slot ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--line)] hover:border-emerald-300 hover:bg-emerald-50"}`}>{slot}</button>)}</div>}
            </div>

            {bookingError ? <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">{bookingError}</p> : null}
          </section>

          <aside className="h-fit rounded-3xl border border-[var(--line)] bg-white p-5 shadow-[0_12px_40px_rgba(27,41,37,0.05)] sm:p-6 lg:sticky lg:top-6" aria-label="Appointment summary">
            <p className="text-sm font-bold">4. Confirm appointment</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Review your selection before confirming.</p>
            <div className="mt-5 space-y-4 rounded-2xl bg-[var(--canvas)] p-4"><div><p className="text-xs text-[var(--muted)]">Doctor</p><p className="mt-1 text-sm font-bold">{doctor.name}</p></div><div><p className="text-xs text-[var(--muted)]">Specialization</p><p className="mt-1 text-sm font-semibold">{doctor.specialty}</p></div><div><p className="text-xs text-[var(--muted)]">Date</p><p className="mt-1 text-sm font-semibold">{selectedDate ? formatLongDate(selectedDate) : "Not selected"}</p></div><div><p className="text-xs text-[var(--muted)]">Time</p><p className="mt-1 text-sm font-semibold">{selectedTime || "Not selected"}</p></div><div><p className="text-xs text-[var(--muted)]">Appointment type</p><p className="mt-1 text-sm font-semibold">{appointmentType}</p></div><div className="border-t border-[var(--line)] pt-4"><div className="flex items-center justify-between"><span className="text-sm text-[var(--muted)]">Consultation fee</span><span className="font-bold">₹{doctor.consultationFee}</span></div></div></div>
            <button type="button" onClick={handleConfirm} disabled={!selectedDate || !selectedTime} className="mt-5 w-full rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-bold text-white hover:bg-[var(--brand-deep)] disabled:cursor-not-allowed disabled:opacity-45">Confirm appointment</button>
            <p className="mt-3 text-center text-[11px] leading-5 text-[var(--muted)]">Demo mode: this booking is stored locally in your browser.</p>
          </aside>
        </div>
      </main>
    </div>
  );
}
