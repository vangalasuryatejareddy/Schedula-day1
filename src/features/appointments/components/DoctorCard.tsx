import Link from "next/link";
import type { Doctor } from "@/types/doctor";

function StarIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 fill-current"><path d="m10 1.8 2.42 4.9 5.41.79-3.92 3.82.93 5.39L10 14.16l-4.84 2.54.93-5.39-3.92-3.82 5.41-.79L10 1.8Z" /></svg>;
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[0_10px_30px_rgba(27,41,37,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_16px_40px_rgba(27,41,37,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-base font-bold text-[var(--brand-deep)] ring-1 ring-inset ring-emerald-100">{doctor.initials}</div>
          <div className="min-w-0">
            <h2 className="truncate text-base font-bold tracking-tight">{doctor.name}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{doctor.specialty}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[var(--brand-deep)]">Available</span>
      </div>

      <p className="mt-5 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{doctor.bio}</p>

      <dl className="mt-5 grid grid-cols-3 divide-x divide-[var(--line)] rounded-xl bg-[var(--canvas)] py-3 text-center">
        <div><dt className="text-[11px] uppercase tracking-wide text-[var(--muted)]">Experience</dt><dd className="mt-1 text-sm font-semibold">{doctor.experienceYears} yrs</dd></div>
        <div><dt className="text-[11px] uppercase tracking-wide text-[var(--muted)]">Rating</dt><dd className="mt-1 flex items-center justify-center gap-1 text-sm font-semibold text-amber-700"><StarIcon />{doctor.rating}</dd></div>
        <div><dt className="text-[11px] uppercase tracking-wide text-[var(--muted)]">Fee</dt><dd className="mt-1 text-sm font-semibold">₹{doctor.consultationFee}</dd></div>
      </dl>

      <div className="mt-auto pt-5">
        <Link href={`/booking/${doctor.id}`} className="flex w-full items-center justify-center rounded-xl bg-[var(--brand)] px-4 py-3 text-sm font-bold text-white hover:bg-[var(--brand-deep)] focus-visible:outline-none">
          Book appointment
          <span aria-hidden="true" className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </div>
    </article>
  );
}
