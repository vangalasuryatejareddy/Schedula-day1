import type { BookingRecord } from "@/features/appointments/types";

const STORAGE_KEY = "schedula-bookings";

export function getBookings(): BookingRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as BookingRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: BookingRecord): void {
  const bookings = getBookings();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([booking, ...bookings]));
}

export function updateBookingStatus(id: string, status: "pending" | "confirmed"): void {
  const bookings = getBookings().map((booking) => booking.id === id ? { ...booking, status } : booking);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}
