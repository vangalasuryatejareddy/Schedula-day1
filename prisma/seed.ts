import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const seed = {
  doctors: [
    {id:"d1",name:"Dr. Ananya Rao",specialty:"Cardiology",experience:"12 years",rating:4.9,location:"Hyderabad",fee:700,bio:"Preventive and clinical cardiology specialist.",available:true},
    {id:"d2",name:"Dr. Arjun Mehta",specialty:"Dermatology",experience:"9 years",rating:4.8,location:"Bengaluru",fee:600,bio:"Skin, hair and preventive dermatology.",available:true},
    {id:"d3",name:"Dr. Priya Shah",specialty:"General Medicine",experience:"15 years",rating:4.9,location:"Chennai",fee:500,bio:"Primary care and long-term health management.",available:true},
    {id:"d4",name:"Dr. Vikram Iyer",specialty:"Orthopedics",experience:"11 years",rating:4.7,location:"Mumbai",fee:650,bio:"Bones, joints and sports injuries.",available:true}
  ],
  slots: [
    {id:"s1",doctorId:"d1",date:"2026-09-10",time:"10:00 AM",booked:false,recurring:false},
    {id:"s2",doctorId:"d1",date:"2026-09-10",time:"11:30 AM",booked:false,recurring:false},
    {id:"s3",doctorId:"d1",date:"2026-09-11",time:"04:00 PM",booked:false,recurring:false},
    {id:"s4",doctorId:"d2",date:"2026-09-10",time:"09:30 AM",booked:false,recurring:false},
    {id:"s5",doctorId:"d3",date:"2026-09-12",time:"05:00 PM",booked:false,recurring:false},
    {id:"s6",doctorId:"d4",date:"2026-09-13",time:"02:00 PM",booked:false,recurring:false}
  ],
  appointments: [
    {id:"a1",patient:"Surya",patientEmail:"surya@example.com",doctorId:"d1",doctor:"Dr. Ananya Rao",specialty:"Cardiology",date:"2026-09-08",time:"10:30 AM",type:"Follow-up",status:"Completed",notes:"Routine follow-up",prescriptionId:"p1"},
    {id:"a2",patient:"Surya",patientEmail:"surya@example.com",doctorId:"d3",doctor:"Dr. Priya Shah",specialty:"General Medicine",date:"2026-09-10",time:"05:00 PM",type:"Consultation",status:"Pending",notes:"General consultation"},
    {id:"a3",patient:"Rahul Kumar",patientEmail:"rahul@example.com",doctorId:"d1",doctor:"Dr. Ananya Rao",specialty:"Cardiology",date:"2026-09-11",time:"11:30 AM",type:"Consultation",status:"Confirmed",notes:"Blood pressure review"}
  ],
  prescriptions: [
    {id:"p1",appointmentId:"a1",patient:"Surya",doctor:"Dr. Ananya Rao",diagnosis:"Routine cardiovascular follow-up",medicines:[{name:"Aspirin",dosage:"75 mg",duration:"14 days"}],instructions:"Take medication after food. Maintain hydration and follow the recommended activity plan."}
  ],
  notifications:[
    {id:"n1",text:"Prescription is available for your completed appointment.",read:false,createdAt:"2026-09-03"},
    {id:"n2",text:"Upcoming appointment reminder: Dr. Priya Shah on Sep 10.",read:false,createdAt:"2026-09-03"}
  ],
  profile:{name:"Surya",email:"surya@example.com",phone:"+91 90000 00000",age:"23",gender:"Male",height:"175 cm",weight:"72 kg",conditions:"None reported",allergies:"None reported",medications:"None",insurance:"Schedula Health Cover",emergency:"Emergency Contact +91 90000 00001"},
  doctorProfile:{name:"Dr. Ananya Rao",email:"ananya@schedula.health",phone:"+91 91111 11111",specialty:"Cardiology",qualification:"MD, DM Cardiology",experience:"12 years",bio:"Focused on compassionate, evidence-based cardiac care."},
  reviews:[]
};

async function main(){
  const existing = await prisma.appState.findUnique({where:{id:1}});
  if(!existing) await prisma.appState.create({data:{id:1,data:JSON.stringify(seed)}});
}
main().finally(()=>prisma.$disconnect());
