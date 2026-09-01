"use client";
import { useEffect, useState } from "react";
import { getCurrentDoctor } from "./storage";
import type { DoctorProfile } from "./types";

export function useDoctorAuth() {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setDoctor(getCurrentDoctor()); setReady(true); }, []);
  return { doctor, ready, refresh: () => setDoctor(getCurrentDoctor()) };
}
