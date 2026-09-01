"use client";

import type { BookingRecord } from "@/features/appointments/types";
import type { AvailabilitySlot, DoctorAppointment, DoctorProfile } from "./types";

const DOCTORS_KEY = "schedula-doctor-profiles";
const DOCTOR_AUTH_KEY = "schedula-doctor-auth";
const SLOTS_KEY = "schedula-doctor-slots";
const BOOKINGS_KEY = "schedula-bookings";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function write<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getRegisteredDoctors() { return read<DoctorProfile[]>(DOCTORS_KEY, []); }
export function saveRegisteredDoctors(doctors: DoctorProfile[]) { write(DOCTORS_KEY, doctors); }
export function registerDoctor(profile: DoctorProfile) {
  const doctors = getRegisteredDoctors();
  doctors.push(profile);
  saveRegisteredDoctors(doctors);
}
export function updateDoctorProfile(profile: DoctorProfile) {
  saveRegisteredDoctors(getRegisteredDoctors().map((item) => item.id === profile.id ? profile : item));
}
export function findDoctorAccount(identifier: string, password: string) {
  const normalized = identifier.trim().toLowerCase();
  return getRegisteredDoctors().find((doctor) =>
    (doctor.email.toLowerCase() === normalized || doctor.username.toLowerCase() === normalized) && doctor.password === password,
  ) ?? null;
}
export function isDoctorIdentifierTaken(email: string, username: string) {
  const doctors = getRegisteredDoctors();
  return doctors.some((item) => item.email.toLowerCase() === email.trim().toLowerCase() || item.username.toLowerCase() === username.trim().toLowerCase());
}
export function setDoctorSession(doctorId: string) { write(DOCTOR_AUTH_KEY, { doctorId }); }
export function getDoctorSession(): string | null { return read<{ doctorId: string } | null>(DOCTOR_AUTH_KEY, null)?.doctorId ?? null; }
export function clearDoctorSession() { if (typeof window !== "undefined") window.localStorage.removeItem(DOCTOR_AUTH_KEY); }
export function getCurrentDoctor() {
  const id = getDoctorSession();
  return id ? getRegisteredDoctors().find((item) => item.id === id) ?? null : null;
}

export function getAvailabilitySlots(doctorId?: string) {
  const slots = read<AvailabilitySlot[]>(SLOTS_KEY, []);
  return doctorId ? slots.filter((item) => item.doctorId === doctorId) : slots;
}
export function saveAvailabilitySlot(slot: AvailabilitySlot) {
  const all = getAvailabilitySlots();
  write(SLOTS_KEY, [...all, slot]);
}
export function deleteAvailabilitySlot(id: string) {
  write(SLOTS_KEY, getAvailabilitySlots().filter((item) => item.id !== id));
}
export function replaceAvailabilitySlot(slot: AvailabilitySlot) {
  write(SLOTS_KEY, getAvailabilitySlots().map((item) => item.id === slot.id ? slot : item));
}

export function createRecurringSlots(input: Omit<AvailabilitySlot, "id" | "createdAt" | "date" | "recurrence"> & { startDate: string; weeks: number }) {
  const start = new Date(`${input.startDate}T12:00:00`);
  const slots: AvailabilitySlot[] = [];
  for (let week = 0; week < input.weeks; week += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + week * 7);
    slots.push({
      id: `slot-${Date.now()}-${week}-${Math.random().toString(36).slice(2, 7)}`,
      doctorId: input.doctorId,
      date: date.toISOString().slice(0, 10),
      startTime: input.startTime,
      endTime: input.endTime,
      recurrence: "weekly",
      createdAt: new Date().toISOString(),
    });
  }
  write(SLOTS_KEY, [...getAvailabilitySlots(), ...slots]);
  return slots;
}

export function getDoctorAppointments(doctor: DoctorProfile): DoctorAppointment[] {
  const bookings = read<BookingRecord[]>(BOOKINGS_KEY, []);
  return bookings
    .filter((booking) => booking.doctorId === doctor.id || booking.doctorName === `Dr. ${doctor.firstName} ${doctor.lastName}`)
    .map((booking) => ({
      id: booking.id,
      doctorId: doctor.id,
      patientName: booking.patientName || "Schedula user",
      patientInitials: (booking.patientName || "Schedula User").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      specialty: booking.specialty,
      date: booking.date,
      time: booking.time,
      status: booking.status || "pending",
      appointmentType: booking.appointmentType || "In-person",
      reason: booking.reason || "General consultation",
    }))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}
