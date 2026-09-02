export type Status = "Pending" | "Confirmed" | "Upcoming" | "Completed" | "Cancelled" | "Missed";
export type Appointment = { id:string; patient:string; doctor:string; specialty:string; date:string; time:string; type:string; status:Status; slotAvailable?:boolean; prescriptionId?:string; };
export type Slot = { id:string; date:string; time:string; recurring:boolean; booked:boolean; };
export type Prescription = { id:string; appointmentId:string; patient:string; doctor:string; diagnosis:string; medicines:{name:string; dosage:string; duration:string}[]; instructions:string; updatedAt:string; };
export type DoctorProfile = { name:string; specialty:string; email:string; phone:string; hospital:string; experience:string; bio:string; };
export type UserProfile = { name:string; email:string; phone:string; dob:string; gender:string; height:string; weight:string; bloodGroup:string; conditions:string; allergies:string; medications:string; insurance:string; policy:string; emergencyName:string; emergencyPhone:string; };
export type Notification = { id:string; message:string; read:boolean; createdAt:string; };
export type AppData = { doctor:DoctorProfile; user:UserProfile; appointments:Appointment[]; slots:Slot[]; prescriptions:Prescription[]; notifications:Notification[]; };
