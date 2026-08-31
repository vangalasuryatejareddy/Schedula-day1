import Link from "next/link";

const capabilities = [
  ["01", "Register", "Create your professional account with personal, contact, and practice details."],
  ["02", "Manage availability", "Create one-time or recurring date and time slots and manage existing availability."],
  ["03", "Receive bookings", "Only open slots are shown to patients and appointments flow back into your workspace."],
];

export default function DoctorPortalPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--brand)] text-sm font-bold text-white">S</span>
            <span><span className="block text-[15px] font-bold">Schedula</span><span className="block text-xs text-[var(--muted)]">Doctor portal</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/doctors" className="rounded-xl px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-stone-100">Patient Portal</Link>
            <Link href="/doctor/login" className="rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-semibold hover:border-[var(--brand)] hover:text-[var(--brand)]">Doctor Login</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[var(--brand-deep)] px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8">
        <div aria-hidden="true" className="absolute -right-24 -top-28 size-[30rem] rounded-full border-[60px] border-white/[0.05]" />
        <div aria-hidden="true" className="absolute -bottom-28 left-[38%] size-80 rounded-full border-[38px] border-emerald-300/[0.08]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-emerald-100">SCHEDULA · DOCTOR WORKSPACE</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-[-0.045em] sm:text-5xl lg:text-6xl">Run your availability. Keep your appointments organized.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50/75">One connected experience for professional registration, profile management, appointment availability, recurring schedules, and patient bookings.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/doctor/register" className="rounded-xl bg-white px-5 py-3.5 text-center text-sm font-extrabold text-[var(--brand-deep)] hover:bg-emerald-50">Register as Doctor →</Link>
              <Link href="/doctor/login" className="rounded-xl border border-white/15 px-5 py-3.5 text-center text-sm font-extrabold text-white hover:bg-white/[0.06]">Doctor Login</Link>
            </div>
            <p className="mt-4 text-xs text-emerald-100/60">Already registered? Sign in to manage your profile, slots, and appointments.</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 backdrop-blur sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">Connected workflow</p>
            <div className="mt-5 space-y-4">
              {[
                ["Doctor", "Register & login"],
                ["Profile", "Create & manage slots"],
                ["Patient", "See open slots only"],
                ["Booking", "Appointment appears in dashboard"],
              ].map(([label, copy], index) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-bold text-emerald-100">{index + 1}</span>
                  <div><p className="font-bold">{label}</p><p className="text-sm text-emerald-100/60">{copy}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-bold text-[var(--brand)]">Everything in one application</p><h2 className="mt-1 text-3xl font-bold tracking-tight">Doctor Portal capabilities</h2></div>
          <Link href="/doctors" className="text-sm font-bold text-[var(--brand)] hover:underline">Switch to Patient Portal →</Link>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {capabilities.map(([number, title, copy]) => (
            <article key={number} className="rounded-3xl border border-[var(--line)] bg-white p-6 shadow-[0_12px_40px_rgba(27,41,37,0.05)]">
              <span className="text-xs font-extrabold text-[var(--brand)]">{number}</span>
              <h3 className="mt-5 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-5 rounded-3xl border border-[var(--line)] bg-white p-6 sm:grid-cols-2 sm:p-8">
          <div>
            <p className="text-sm font-bold text-[var(--brand)]">New to Schedula?</p>
            <h3 className="mt-1 text-2xl font-bold">Create your doctor account.</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Complete your professional profile and move directly to secure portal login.</p>
            <Link href="/doctor/register" className="mt-5 inline-flex rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-bold text-white hover:bg-[var(--brand-deep)]">Register as Doctor →</Link>
          </div>
          <div className="border-t border-[var(--line)] pt-6 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
            <p className="text-sm font-bold text-[var(--brand)]">Already registered?</p>
            <h3 className="mt-1 text-2xl font-bold">Open your workspace.</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">View upcoming appointments, update your profile, and manage appointment availability.</p>
            <Link href="/doctor/login" className="mt-5 inline-flex rounded-xl border border-[var(--line)] px-5 py-3 text-sm font-bold hover:border-[var(--brand)] hover:text-[var(--brand)]">Doctor Login →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
