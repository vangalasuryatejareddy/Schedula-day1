export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  initials: string;
  bio: string;
  availableDates: string[];
  slotsByDate: Record<string, string[]>;
};
