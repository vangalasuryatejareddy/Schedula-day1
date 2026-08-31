export type DoctorProfile = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  specialty: string;
  licenseNumber: string;
  experienceYears: number;
  consultationFee: number;
  phone: string;
  email: string;
  clinicName: string;
  clinicAddress: string;
  username: string;
  password: string;
  bio: string;
  createdAt: string;
};

export type AvailabilitySlot = {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  recurrence?: "weekly" | "none";
  createdAt: string;
};

export type DoctorAppointment = {
  id: string;
  doctorId: string;
  patientName: string;
  patientInitials: string;
  specialty: string;
  date: string;
  time: string;
  status: "pending" | "confirmed";
  reason: string;
};
