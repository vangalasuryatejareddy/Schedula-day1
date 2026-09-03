import { NextResponse } from "next/server";
import { getState } from "@/lib/state";

const safety = `You are Schedula AI Care Assistant. You can help with appointment booking, doctor specialties, doctors available in Schedula, general health education and healthcare navigation. Do not diagnose, prescribe, provide emergency treatment instructions, or claim to replace a clinician. For emergency symptoms tell the user to contact local emergency services immediately. Keep responses concise, supportive and practical.`;

export async function POST(req: Request) {
  const { message } = await req.json();
  const state = await getState();
  const doctors = (state.doctors || []).map((d:any)=>`${d.name} — ${d.specialty}, ${d.experience}, ${d.location}`).join("\n");
  const key = process.env.GROQ_API_KEY;

  if (key) {
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method:"POST",
        headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},
        body:JSON.stringify({
          model:process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
          messages:[
            {role:"system",content:`${safety}\n\nSchedula doctor directory:\n${doctors}`},
            {role:"user",content:String(message)}
          ],
          temperature:0.3,
          max_tokens:450
        })
      });
      const json = await r.json();
      const answer = json?.choices?.[0]?.message?.content;
      if(answer) return NextResponse.json({answer,source:"Groq"});
    } catch {}
  }

  const q = String(message || "").toLowerCase();
  let answer = "I can help you navigate Schedula appointments, doctor specialties, available doctors and general health information.";
  if (q.includes("emergency") || q.includes("chest pain") || q.includes("difficulty breathing")) answer = "If this may be an emergency or you have severe symptoms, please contact your local emergency service or seek urgent medical care immediately. I cannot diagnose emergencies.";
  else if (q.includes("cardio") || q.includes("heart")) answer = "For heart and cardiovascular concerns, Schedula currently lists Dr. Ananya Rao (Cardiology). I can also help you book an available appointment.";
  else if (q.includes("skin") || q.includes("derma")) answer = "For skin or hair concerns, Dr. Arjun Mehta is available in the Dermatology directory.";
  else if (q.includes("appointment") || q.includes("book")) answer = "Open the Doctor List or User Booking page, choose a doctor, select an unbooked slot, and confirm your appointment. The booking will appear in My Appointments.";
  else if (q.includes("doctor")) answer = `Schedula doctors include:\n${doctors}`;
  return NextResponse.json({answer,source:"Safe fallback"});
}
