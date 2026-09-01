<<<<<<< HEAD
﻿export type AppointmentStatus = "confirmed" | "pending" | "cancelled";
=======
﻿export type AppointmentStatus = "confirmed" | "pending" | "cancelled";
>>>>>>> origin/feat/day-1-doctor-booking-flow
export type Appointment = { id: string; patient: { name: string; initials: string; age: number }; clinician: string; specialty: string; startsAt: string; durationMinutes: number; status: AppointmentStatus; reason: string; room: string };