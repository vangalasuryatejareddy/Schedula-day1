import type { Doctor } from "@/types/doctor";
import { getAvailabilitySlots, getRegisteredDoctors } from "@/features/doctor-portal/storage";

type DoctorsResponse = { data: Doctor[] };

function profileToDoctor(profile: ReturnType<typeof getRegisteredDoctors>[number]): Doctor {
  const slots = getAvailabilitySlots(profile.id).reduce<Record<string, string[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    if (!acc[slot.date].includes(slot.startTime)) acc[slot.date].push(slot.startTime);
    return acc;
  }, {});
  return {
    id: profile.id,
    name: `Dr. ${profile.firstName} ${profile.lastName}`,
    specialty: profile.specialty,
    experienceYears: profile.experienceYears,
    rating: 5,
    reviewCount: 0,
    consultationFee: profile.consultationFee,
    initials: `${profile.firstName[0] ?? "D"}${profile.lastName[0] ?? "R"}`.toUpperCase(),
    bio: profile.bio,
    availableDates: Object.keys(slots).sort(),
    slotsByDate: slots,
  };
}

export async function getDoctors(): Promise<Doctor[]> {
  const response = await fetch("/api/doctors");
  if (!response.ok) throw new Error("Unable to load doctors");
  const body = (await response.json()) as DoctorsResponse;
  // Day 2 integration: doctor registrations and availability are stored locally in this frontend demo.
  // Merge them with the starter API data so slots created in the Doctor Portal are immediately bookable by users.
  if (typeof window === "undefined") return body.data;
  const registered = getRegisteredDoctors().map(profileToDoctor);
  return [...registered, ...body.data];
}
