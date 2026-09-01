export type BookingStatus = "pending" | "confirmed" | "upcoming" | "completed" | "cancelled" | "missed";
export type BookingRecord = {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  createdAt: string;
  patientName?: string;
  patientId?: string;
  reason?: string;
  appointmentType?: "In-person" | "Video consultation" | "Follow-up";
  status?: BookingStatus;
  prescription?: string;
  review?: { rating: number; comment: string; createdAt: string };
  updatedAt?: string;
};
