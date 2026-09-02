import { AppData, Appointment, Prescription, Slot } from "./types";
const KEY="schedula-day4-data";
const seed:AppData={
 doctor:{name:"Dr. Sarah Wilson",specialty:"Cardiologist",email:"sarah@medicare.com",phone:"+1 555 0142",hospital:"CityCare Medical Center",experience:"12 years",bio:"Focused on preventive and compassionate cardiac care."},
 user:{name:"Maya Patel",email:"maya@example.com",phone:"+1 555 0199",dob:"1992-05-18",gender:"Female",height:"165 cm",weight:"62 kg",bloodGroup:"B+",conditions:"Mild hypertension",allergies:"Penicillin",medications:"Vitamin D",insurance:"HealthPlus",policy:"HP-204811",emergencyName:"Arjun Patel",emergencyPhone:"+1 555 0108"},
 appointments:[
 {id:"apt-1042",patient:"Maya Patel",doctor:"Dr. Sarah Wilson",specialty:"Cardiologist",date:"2026-09-03",time:"09:00 AM",type:"Consultation",status:"Confirmed"},
 {id:"apt-1043",patient:"Maya Patel",doctor:"Dr. Sarah Wilson",specialty:"Cardiologist",date:"2026-09-04",time:"10:30 AM",type:"Follow-up",status:"Upcoming"},
 {id:"apt-1044",patient:"Maya Patel",doctor:"Dr. Sarah Wilson",specialty:"Cardiologist",date:"2026-08-26",time:"11:00 AM",type:"Consultation",status:"Completed",prescriptionId:"rx-1001"},
 {id:"apt-1045",patient:"Maya Patel",doctor:"Dr. Sarah Wilson",specialty:"Cardiologist",date:"2026-08-20",time:"02:30 PM",type:"Consultation",status:"Cancelled"},
 {id:"apt-1046",patient:"Maya Patel",doctor:"Dr. Sarah Wilson",specialty:"Cardiologist",date:"2026-08-18",time:"04:00 PM",type:"Consultation",status:"Missed"}
 ],
 slots:[{id:"s1",date:"2026-09-03",time:"09:00 AM",recurring:true,booked:true},{id:"s2",date:"2026-09-03",time:"11:00 AM",recurring:true,booked:false},{id:"s3",date:"2026-09-04",time:"10:30 AM",recurring:false,booked:true},{id:"s4",date:"2026-09-05",time:"02:00 PM",recurring:true,booked:false}],
 prescriptions:[{id:"rx-1001",appointmentId:"apt-1044",patient:"Maya Patel",doctor:"Dr. Sarah Wilson",diagnosis:"Mild hypertension",medicines:[{name:"Amlodipine",dosage:"5 mg once daily",duration:"30 days"},{name:"Vitamin D3",dosage:"1000 IU daily",duration:"30 days"}],instructions:"Take medicines at the same time each day. Reduce sodium intake and monitor blood pressure weekly.",updatedAt:"2026-08-26"}],
 notifications:[{id:"n1",message:"Your appointment has been confirmed for Sep 3 at 09:00 AM.",read:false,createdAt:"Just now"},{id:"n2",message:"Prescription is available for your completed appointment.",read:false,createdAt:"Today"},{id:"n3",message:"Appointment reminder: follow-up tomorrow at 10:30 AM.",read:true,createdAt:"Today"}]
};
export function getData():AppData{if(typeof window==="undefined")return seed; const raw=localStorage.getItem(KEY); if(!raw){localStorage.setItem(KEY,JSON.stringify(seed)); return seed;} try{return JSON.parse(raw) as AppData;}catch{return seed;}}
export function saveData(data:AppData){if(typeof window!=="undefined")localStorage.setItem(KEY,JSON.stringify(data));}
export function updateAppointment(id:string,patch:Partial<Appointment>){const d=getData();d.appointments=d.appointments.map(a=>a.id===id?{...a,...patch}:a);saveData(d);}
export function addSlot(slot:Slot){const d=getData();d.slots=[...d.slots,slot];saveData(d);}
export function deleteSlot(id:string){const d=getData();d.slots=d.slots.filter(s=>s.id!==id);saveData(d);}
export function upsertPrescription(p:Prescription){const d=getData();const i=d.prescriptions.findIndex(x=>x.appointmentId===p.appointmentId);if(i>=0)d.prescriptions[i]=p;else d.prescriptions.push(p);d.appointments=d.appointments.map(a=>a.id===p.appointmentId?{...a,prescriptionId:p.id,status:"Completed"}:a);saveData(d);}
export function addNotification(message:string){const d=getData();d.notifications=[{id:crypto.randomUUID(),message,read:false,createdAt:"Just now"},...d.notifications];saveData(d);}
export function resetData(){saveData(seed);}
