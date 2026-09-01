"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDoctorAuth } from "@/features/doctor-portal/hooks";

export function DoctorPortalGuard({ children }: { children: React.ReactNode }) {
  const { doctor, ready } = useDoctorAuth();
  const router = useRouter();
  useEffect(() => { if (ready && !doctor) router.replace("/doctor/login"); }, [doctor, ready, router]);
  if (!ready || !doctor) return <div className="grid min-h-screen place-items-center text-sm text-[var(--muted)]">Loading doctor workspace…</div>;
  return <>{children}</>;
}
