import { NextRequest, NextResponse } from 'next/server';
const SYSTEM = `You are Schedula AI Care Assistant. You provide general, non-diagnostic health education and help users navigate Schedula appointments. Never claim to diagnose, prescribe, or replace a clinician. For emergencies advise contacting local emergency services. Keep answers concise, calm and practical.`;
export async function POST(request: NextRequest) {
  const { message, doctors = [] } = await request.json();
  if (!message || typeof message !== 'string') return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    const names = doctors.map((d: { name: string; specialty: string }) => `${d.name} (${d.specialty})`).join(', ');
    return NextResponse.json({ reply: `Demo mode: I can help with appointments, specialties and general health education. Based on your message, consider booking the most relevant specialist. Available Schedula doctors include: ${names}. This is general information, not a diagnosis.` });
  }
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant', temperature: 0.3, messages: [{ role: 'system', content: `${SYSTEM}\nSchedula doctors: ${JSON.stringify(doctors)}` }, { role: 'user', content: message }] }) });
  if (!res.ok) return NextResponse.json({ error: 'AI service is temporarily unavailable' }, { status: 502 });
  const data = await res.json();
  return NextResponse.json({ reply: data.choices?.[0]?.message?.content ?? 'I could not generate a response right now.' });
}
