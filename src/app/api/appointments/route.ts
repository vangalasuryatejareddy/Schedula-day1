<<<<<<< HEAD
﻿import { appointments } from "@/lib/mock-data/appointments";
=======
﻿import { appointments } from "@/lib/mock-data/appointments";
>>>>>>> origin/feat/day-1-doctor-booking-flow
export async function GET() { return Response.json({ data: appointments, meta: { total: appointments.length } }); }