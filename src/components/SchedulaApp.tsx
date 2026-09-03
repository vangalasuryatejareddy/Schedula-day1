 "use client";

import { useEffect, useMemo, useState } from "react";

type Props = { initialMode:"user"|"doctor"; initialView:string };
type Data = any;

const userLinks = [
  ["Home","/"],["Doctor List","/doctors"],["Book Appointment","/booking"],
  ["My Appointments","/user/appointments"],["My Profile","/user/profile"]
];
const doctorLinks = [
  ["Dashboard","/doctor/dashboard"],["Appointments","/doctor/appointments"],
  ["Calendar","/doctor/calendar"],["Profile & Availability","/doctor/profile"],
  ["Prescriptions","/doctor/prescriptions"]
];

const statuses = ["All","Pending","Confirmed","Upcoming","Completed","Cancelled","Missed"];

export function SchedulaApp({initialMode,initialView}:Props){
  const [data,setData]=useState<Data|null>(null);
  const [mode,setMode]=useState(initialMode);
  const [view,setView]=useState(initialView);
  const [menu,setMenu]=useState(false);
  const [query,setQuery]=useState("");
  const [toast,setToast]=useState("");
  const [tab,setTab]=useState("Upcoming");
  const [selectedDoctor,setSelectedDoctor]=useState<any>(null);
  const [selectedSlot,setSelectedSlot]=useState<any>(null);
  const [aiOpen,setAiOpen]=useState(false);
  const [aiMessages,setAiMessages]=useState([{role:"assistant",text:"Hi! I’m Schedula AI Care Assistant. I can help with appointments, doctor specialties and general healthcare questions."}]);
  const [aiInput,setAiInput]=useState("");
  const [busy,setBusy]=useState(false);

  useEffect(()=>{ fetch("/api/state").then(r=>r.json()).then(setData).catch(()=>setToast("Could not load application data.")); },[]);

  async function persist(next:any, message?:string){
    setData(next);
    await fetch("/api/state",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(next)});
    if(message){setToast(message); setTimeout(()=>setToast(""),3500);}
  }
  function addNotification(next:any,text:string){
    next.notifications=[{id:crypto.randomUUID(),text,read:false,createdAt:new Date().toISOString()},...(next.notifications||[])];
  }
  function go(label:string,href:string){
    setMenu(false);
    if(label==="Home"){setMode("user");setView("home");}
    else if(label==="Doctor List"){setMode("user");setView("doctors");}
    else if(label==="Book Appointment"){setMode("user");setView("booking");}
    else if(label==="My Appointments"){setMode("user");setView("appointments");}
    else if(label==="My Profile"){setMode("user");setView("profile");}
    else {setMode("doctor");setView(label==="Profile & Availability"?"profile":label.toLowerCase());}
    window.history.pushState({}, "", href);
  }

  const doctors=useMemo(()=>data?.doctors?.filter((d:any)=>`${d.name} ${d.specialty} ${d.location}`.toLowerCase().includes(query.toLowerCase()))||[],[data,query]);
  const currentDoctor=data?.doctors?.[0];

  function book(){
    if(!data||!selectedDoctor||!selectedSlot) return setToast("Select a doctor and an available slot first.");
    if(selectedSlot.booked) return setToast("That slot is no longer available.");
    const next=structuredClone(data);
    const appointment={id:crypto.randomUUID(),patient:next.profile.name,patientEmail:next.profile.email,doctorId:selectedDoctor.id,doctor:selectedDoctor.name,specialty:selectedDoctor.specialty,date:selectedSlot.date,time:selectedSlot.time,type:"Consultation",status:"Pending",notes:"Booked through Schedula"};
    next.appointments.push(appointment);
    next.slots=next.slots.map((s:any)=>s.id===selectedSlot.id?{...s,booked:true}:s);
    addNotification(next,`Appointment request sent to ${selectedDoctor.name} for ${selectedSlot.date} at ${selectedSlot.time}.`);
    persist(next,"Appointment booked successfully. The doctor can now confirm or decline it.");
    setSelectedSlot(null);
  }

  function updateStatus(a:any,status:string){
    const next=structuredClone(data);
    next.appointments=next.appointments.map((x:any)=>x.id===a.id?{...x,status}:x);
    addNotification(next,`Your appointment with ${a.doctor} is now ${status}.`);
    persist(next,`Appointment marked as ${status}.`);
  }

  function reschedule(a:any){
    const next=structuredClone(data);
    const slot=next.slots.find((s:any)=>s.doctorId===a.doctorId&&!s.booked);
    if(!slot) return setToast("No available slot found for rescheduling.");
    next.slots=next.slots.map((s:any)=>s.id===slot.id?{...s,booked:true}:s);
    next.appointments=next.appointments.map((x:any)=>x.id===a.id?{...x,date:slot.date,time:slot.time,status:"Confirmed"}:x);
    addNotification(next,`Appointment rescheduled to ${slot.date} at ${slot.time}.`);
    persist(next,"Appointment rescheduled and user notified.");
  }

  function createPrescription(a:any){
    const diagnosis=prompt("Diagnosis","Follow-up review")||"Follow-up review";
    const instructions=prompt("Instructions","Follow the doctor’s instructions and return if symptoms worsen.")||"Follow instructions.";
    const next=structuredClone(data);
    const p={id:crypto.randomUUID(),appointmentId:a.id,patient:a.patient,doctor:a.doctor,diagnosis,medicines:[{name:"Recommended medicine",dosage:"As prescribed",duration:"7 days"}],instructions};
    next.prescriptions.push(p);
    next.appointments=next.appointments.map((x:any)=>x.id===a.id?{...x,prescriptionId:p.id,status:"Completed"}:x);
    addNotification(next,`Prescription available for appointment with ${a.doctor}.`);
    persist(next,"Prescription saved and linked to the completed appointment.");
  }

  function addSlot(){
    if(!data) return;
    const date=prompt("Date (YYYY-MM-DD)","2026-09-15"); if(!date)return;
    const time=prompt("Time","10:00 AM"); if(!time)return;
    const next=structuredClone(data);
    next.slots.push({id:crypto.randomUUID(),doctorId:currentDoctor.id,date,time,booked:false,recurring:false});
    persist(next,"Availability slot added.");
  }

  function removeSlot(id:string){
    const next=structuredClone(data);
    next.slots=next.slots.filter((s:any)=>s.id!==id||s.booked);
    persist(next,"Availability updated.");
  }

  async function downloadPrescription(p:any){
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();
    const lines = [
      "SCHEDULA HEALTHCARE",
      "PRESCRIPTION",
      "",
      `Patient: ${p.patient}`,
      `Doctor: ${p.doctor}`,
      `Diagnosis: ${p.diagnosis}`,
      "",
      "Medicines:",
      ...p.medicines.map((m:any)=>`${m.name} - ${m.dosage} - ${m.duration}`),
      "",
      "Instructions:",
      p.instructions
    ];
    pdf.setFontSize(18);
    pdf.text("SCHEDULA HEALTHCARE", 20, 20);
    pdf.setFontSize(13);
    pdf.text("PRESCRIPTION", 20, 30);
    pdf.setFontSize(11);
    let y = 45;
    for (const line of lines.slice(3)) {
      const wrapped = pdf.splitTextToSize(String(line), 165);
      if (y + wrapped.length * 7 > 280) { pdf.addPage(); y = 20; }
      pdf.text(wrapped, 20, y);
      y += wrapped.length * 7 + 3;
    }
    pdf.save("schedula-prescription.pdf");
  }

  async function askAI(){
    const message=aiInput.trim(); if(!message||busy)return;
    setAiInput("");setAiMessages(m=>[...m,{role:"user",text:message}]);setBusy(true);
    try{
      const r=await fetch("/api/ai",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message})});
      const j=await r.json(); setAiMessages(m=>[...m,{role:"assistant",text:j.answer||"I’m unable to answer that right now."}]);
    }catch{setAiMessages(m=>[...m,{role:"assistant",text:"I’m temporarily unavailable. Please try again."}]);}
    setBusy(false);
  }

  if(!data)return <div className="boot"><div className="loader"></div><h2>Loading Schedula</h2><p>Preparing your healthcare workspace…</p></div>;

  const links=mode==="doctor"?doctorLinks:userLinks;
  const unread=(data.notifications||[]).filter((n:any)=>!n.read).length;
  const appointments=data.appointments||[];

  const renderHome=()=>(
    <><section className="hero"><div><span className="pill">Healthcare made simpler</span><h1>Your care.<br/><em>One connected schedule.</em></h1><p>Discover doctors, book appointments, manage prescriptions and keep your healthcare journey organized in one professional workspace.</p><div className="row"><button className="btn primary" onClick={()=>setView("doctors")}>Find a doctor</button><button className="btn ghost" onClick={()=>{setMode("doctor");setView("dashboard")}}>Doctor portal</button></div></div><div className="hero-card"><div className="pulse">24/7</div><h3>Connected care</h3><p>Appointments, availability, prescriptions and notifications stay connected.</p><div className="metric"><b>{data.doctors.length}</b><span>Specialist profiles</span></div><div className="metric"><b>{appointments.length}</b><span>Appointments tracked</span></div></div></section><section><div className="section-head"><div><span className="eyebrow">Featured care</span><h2>Find the right specialist</h2></div><button className="text-btn" onClick={()=>setView("doctors")}>View all doctors →</button></div><div className="grid doctors">{data.doctors.slice(0,3).map((d:any)=><DoctorCard key={d.id} d={d} onBook={()=>{setSelectedDoctor(d);setView("booking")}} />)}</div></section></>
  );

  const renderDoctors=()=>(
    <><div className="page-head"><span className="eyebrow">Care directory</span><h1>Find your doctor</h1><p>Browse trusted specialists and book an available time.</p><input className="search" placeholder="Search doctor, specialty or location" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="grid doctors">{doctors.length?doctors.map((d:any)=><DoctorCard key={d.id} d={d} onBook={()=>{setSelectedDoctor(d);setView("booking")}}/>):<Empty text="No doctors match your search."/>}</div></>
  );

  const renderBooking=()=>{
    const d=selectedDoctor||data.doctors[0];
    const slots=data.slots.filter((s:any)=>s.doctorId===d.id&&!s.booked);
    return <><div className="page-head"><span className="eyebrow">Secure booking</span><h1>Book an appointment</h1><p>Select a doctor, review available slots and confirm your appointment.</p></div><div className="booking-layout"><div className="card"><h3>1. Choose doctor</h3><select value={d.id} onChange={e=>{setSelectedDoctor(data.doctors.find((x:any)=>x.id===e.target.value));setSelectedSlot(null)}}>{data.doctors.map((x:any)=><option key={x.id} value={x.id}>{x.name} — {x.specialty}</option>)}</select><div className="doctor-summary"><div className="avatar">{d.name.split(" ").slice(-1)[0][0]}</div><div><b>{d.name}</b><p>{d.specialty} · {d.experience}</p></div></div><h3>2. Available slots</h3><div className="slots">{slots.length?slots.map((s:any)=><button key={s.id} className={`slot ${selectedSlot?.id===s.id?"active":""}`} onClick={()=>setSelectedSlot(s)}>{s.date}<b>{s.time}</b></button>):<Empty text="No open slots available."/ >}</div></div><div className="card booking-confirm"><h3>3. Confirm appointment</h3><p><b>Doctor:</b> {d.name}</p><p><b>Date:</b> {selectedSlot?.date||"Select a date"}</p><p><b>Time:</b> {selectedSlot?.time||"Select a time"}</p><p><b>Type:</b> Consultation</p><button className="btn primary wide" onClick={book}>Confirm appointment</button><small>You will receive an appointment notification after booking.</small></div></div></>
  };

  const renderUserAppointments=()=>{
    const visible=appointments.filter((a:any)=>tab==="Upcoming"?["Pending","Confirmed","Upcoming"].includes(a.status):a.status===tab);
    return <><PageTitle title="My appointments" subtitle="Track your care, prescriptions and follow-up actions."/><div className="tabs">{["Upcoming","Completed","Cancelled","Missed"].map(x=><button key={x} className={tab===x?"active":""} onClick={()=>setTab(x)}>{x}</button>)}</div>{visible.length?visible.map((a:any)=>{const p=data.prescriptions.find((x:any)=>x.appointmentId===a.id);return <AppointmentCard key={a.id} a={a} actions={<div className="actions">{tab==="Completed"&&<>{p?<><button className="btn secondary" onClick={()=>alert(`Diagnosis: ${p.diagnosis}\nMedicines: ${p.medicines.map((m:any)=>m.name).join(", ")}\nInstructions: ${p.instructions}`)}>View prescription</button><button className="btn secondary" onClick={()=>downloadPrescription(p)}>Download prescription</button></>:<span className="muted">Prescription Not Available</span>}<button className="btn secondary" onClick={()=>setToast("Thank you! Your review has been recorded.")}>Review doctor</button><button className="btn primary" onClick={()=>{setSelectedDoctor(data.doctors.find((d:any)=>d.id===a.doctorId));setView("booking")}}>Rebook</button></>}</div>}/>}):<Empty text={`No ${tab.toLowerCase()} appointments.`}/>}</>
  };

  const renderDoctorDashboard=()=>{
    const upcoming=appointments.filter((a:any)=>["Pending","Confirmed","Upcoming"].includes(a.status)&&a.doctorId===currentDoctor.id);
    return <><PageTitle title={`Welcome back, ${currentDoctor.name}`} subtitle="Your upcoming care schedule and quick actions at a glance."/><div className="stats"><Stat label="Upcoming" value={upcoming.length}/><Stat label="Pending" value={upcoming.filter((a:any)=>a.status==="Pending").length}/><Stat label="Open slots" value={data.slots.filter((s:any)=>s.doctorId===currentDoctor.id&&!s.booked).length}/><Stat label="Prescriptions" value={data.prescriptions.filter((p:any)=>p.doctor===currentDoctor.name).length}/></div><div className="section-head"><div><span className="eyebrow">Upcoming schedule</span><h2>Patient appointments</h2></div><div className="quick"><button className="btn secondary" onClick={()=>setView("profile")}>My profile</button><button className="btn primary" onClick={()=>setView("appointments")}>View all appointments</button></div></div>{upcoming.length?upcoming.map((a:any)=><AppointmentCard key={a.id} a={a} actions={<div className="actions"><button className="btn secondary" onClick={()=>alert(`Patient: ${a.patient}\nEmail: ${a.patientEmail}\nNotes: ${a.notes||"No notes"}`)}>👤 Patient details</button><button className="btn secondary" onClick={()=>setView("calendar")}>🗓 Calendar</button><button className="btn primary" onClick={()=>setView("appointments")}>View details</button></div>}/>):<Empty text="No upcoming appointments. Create availability to receive bookings."/ >}</>
  };

  const renderDoctorAppointments=()=>{
    const [q,setQ]=[query,setQuery];
    const visible=appointments.filter((a:any)=>a.doctorId===currentDoctor.id&&(tab==="All"||a.status===tab)&&(`${a.patient} ${a.type} ${a.date}`.toLowerCase().includes(q.toLowerCase())));
    return <><PageTitle title="Appointment management" subtitle="Search, filter and manage the complete appointment lifecycle."/><div className="toolbar"><input className="search" placeholder="Search patient or appointment" value={q} onChange={e=>setQ(e.target.value)}/><select value={tab} onChange={e=>setTab(e.target.value)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></div>{visible.length?visible.map((a:any)=><AppointmentCard key={a.id} a={a} actions={<div className="actions">{a.status==="Pending"&&<><button className="btn primary" onClick={()=>updateStatus(a,"Confirmed")}>Confirm</button><button className="btn danger" onClick={()=>updateStatus(a,"Cancelled")}>Decline</button></>}{["Confirmed","Upcoming"].includes(a.status)&&<><button className="btn secondary" onClick={()=>reschedule(a)}>Reschedule</button><button className="btn danger" onClick={()=>updateStatus(a,"Cancelled")}>Cancel</button><button className="btn primary" onClick={()=>updateStatus(a,"Completed")}>Mark completed</button><button className="btn secondary" onClick={()=>updateStatus(a,"Missed")}>Mark missed</button></>}{a.status==="Completed"&&<button className="btn primary" onClick={()=>createPrescription(a)}>View / create prescription</button>}</div>}/>):<Empty text="No appointments match the selected filters."/ >}</>
  };

  const renderCalendar=()=>{
    const ap=appointments.filter((a:any)=>a.doctorId===currentDoctor.id);
    const sl=data.slots.filter((s:any)=>s.doctorId===currentDoctor.id);
    return <><PageTitle title="Calendar & availability" subtitle="Day, week and month planning with appointment and availability visibility."/><div className="calendar-switch"><button className="active">Month</button><button>Week</button><button>Day</button><button className="btn primary" onClick={addSlot}>+ Add slot</button></div><div className="calendar-grid">{[...new Set([...sl.map((s:any)=>s.date),...ap.map((a:any)=>a.date)])].sort().map((date:any)=><div className="day-col" key={date}><h3>{date}</h3>{sl.filter((s:any)=>s.date===date).map((s:any)=><div className={`calendar-item ${s.booked?"booked":"available"}`} key={s.id}><b>{s.time}</b><span>{s.booked?"Booked":"Available"}</span></div>)}{ap.filter((a:any)=>a.date===date).map((a:any)=><div className={`calendar-item appt ${a.status.toLowerCase()}`} key={a.id}><b>{a.time}</b><span>{a.patient} · {a.status}</span>{["Pending","Confirmed","Upcoming"].includes(a.status)&&<button className="mini" onClick={()=>reschedule(a)}>Move to next available slot</button>}</div>)}</div>)}</div></>
  };

  const renderProfile=()=>{
    if(mode==="doctor"){
      const slots=data.slots.filter((s:any)=>s.doctorId===currentDoctor.id);
      return <><PageTitle title="Doctor profile & availability" subtitle="Manage professional information and appointment availability."/><ProfileForm values={data.doctorProfile} onSave={(vals:any)=>{const next=structuredClone(data);next.doctorProfile={...next.doctorProfile,...vals};next.doctors[0]={...next.doctors[0],name:vals.name,specialty:vals.specialty,experience:vals.experience,bio:vals.bio};persist(next,"Doctor profile updated.");}}/><section className="card"><div className="section-head"><div><h2>Appointment availability</h2><p>Create and manage slots. Unbooked slots become selectable in the User Portal.</p></div><button className="btn primary" onClick={addSlot}>+ Add availability</button></div><div className="slot-list">{slots.map((s:any)=><div className="slot-row" key={s.id}><span>{s.date} · <b>{s.time}</b></span><span className={s.booked?"status pending":"status confirmed"}>{s.booked?"Booked":"Available"}</span>{!s.booked&&<button className="text-btn danger-text" onClick={()=>removeSlot(s.id)}>Remove</button>}</div>)}</div></section></>
    }
    return <><PageTitle title="My health profile" subtitle="Keep your personal and healthcare information up to date."/><ProfileForm values={data.profile} onSave={(vals:any)=>{const next=structuredClone(data);next.profile={...next.profile,...vals};persist(next,"Profile updated successfully.");}}/><div className="stats"><Stat label="Total prescriptions" value={data.prescriptions.length}/><Stat label="Completed appointments" value={appointments.filter((a:any)=>a.status==="Completed").length}/><Stat label="Test reports" value={0}/></div></>
  };

  const renderPrescriptions=()=>{
    const ps=data.prescriptions.filter((p:any)=>p.doctor===currentDoctor.name);
    return <><PageTitle title="Prescription management" subtitle="Create, review and update prescriptions linked to completed appointments."/><div className="toolbar"><input className="search" placeholder="Search prescriptions" value={query} onChange={e=>setQuery(e.target.value)}/></div>{ps.filter((p:any)=>`${p.patient} ${p.diagnosis}`.toLowerCase().includes(query.toLowerCase())).length?ps.filter((p:any)=>`${p.patient} ${p.diagnosis}`.toLowerCase().includes(query.toLowerCase())).map((p:any)=><div className="card prescription" key={p.id}><div><span className="eyebrow">Patient</span><h2>{p.patient}</h2><p><b>Diagnosis:</b> {p.diagnosis}</p><p><b>Medicines:</b> {p.medicines.map((m:any)=>`${m.name} (${m.dosage})`).join(", ")}</p><p>{p.instructions}</p></div><button className="btn secondary" onClick={()=>downloadPrescription(p)}>Download copy</button></div>):<Empty text="No prescriptions found. Complete an appointment and create a prescription."/ >}</>
  };

  const renderLogin=()=> <AuthCard title="Doctor Login" subtitle="Access your professional Schedula workspace." button="Login to dashboard" onDone={()=>{setView("dashboard");setToast("Doctor login successful.");}} extra="New to Schedula?" extraAction={()=>setView("register")} />;
  const renderRegister=()=> <AuthCard title="Doctor Registration" subtitle="Create your professional healthcare account." button="Create doctor account" onDone={()=>{setView("login");setToast("Registration successful. Please login.");}} extra="Already registered?" extraAction={()=>setView("login")} register/>;

  let content:any=renderHome();
  if(view==="doctors")content=renderDoctors();
  if(view==="booking")content=renderBooking();
  if(mode==="user"&&view==="appointments")content=renderUserAppointments();
  if(mode==="user"&&view==="profile")content=renderProfile();
  if(mode==="doctor"&&view==="dashboard")content=renderDoctorDashboard();
  if(mode==="doctor"&&view==="appointments")content=renderDoctorAppointments();
  if(mode==="doctor"&&view==="calendar")content=renderCalendar();
  if(mode==="doctor"&&view==="profile")content=renderProfile();
  if(mode==="doctor"&&view==="prescriptions")content=renderPrescriptions();
  if(mode==="doctor"&&view==="login")content=renderLogin();
  if(mode==="doctor"&&view==="register")content=renderRegister();

  return <div className="app-shell">
    <header><button className="brand" onClick={()=>{setMode("user");setView("home")}}><span>✚</span> SCHEDULA</button><nav className={menu?"open":""}>{links.map(([l,h])=><button key={l} onClick={()=>go(l,h)} className={view===(l==="Home"?"home":l==="Doctor List"?"doctors":l==="Book Appointment"?"booking":l==="My Appointments"?"appointments":l==="My Profile"?"profile":l==="Profile & Availability"?"profile":l.toLowerCase())?"nav-active":""}>{l}</button>)}</nav><div className="header-actions"><button className="icon-btn" onClick={()=>setAiOpen(!aiOpen)}>✦ AI Care</button><button className="icon-btn" onClick={()=>{const next=structuredClone(data);next.notifications=next.notifications.map((n:any)=>({...n,read:true}));persist(next);setToast(unread?`${unread} notifications marked as read.`:"No new notifications.");}}>🔔 {unread?unread:""}</button><button className="mode-btn" onClick={()=>{setMode(mode==="user"?"doctor":"user");setView(mode==="user"?"dashboard":"home")}}>{mode==="user"?"Doctor":"User"} Portal</button><button className="mobile-menu" onClick={()=>setMenu(!menu)}>☰</button></div></header>
    <main>{content}</main>
    {toast&&<div className="toast">✓ {toast}</div>}
    {aiOpen&&<div className="ai-panel"><div className="ai-head"><div><span className="ai-dot"></span><b>Schedula AI Care Assistant</b><small>Healthcare navigation · Safety-first</small></div><button onClick={()=>setAiOpen(false)}>×</button></div><div className="ai-chat">{aiMessages.map((m,i)=><div key={i} className={`bubble ${m.role}`}>{m.text}</div>)}{busy&&<div className="bubble assistant">Thinking…</div>}</div><div className="ai-input"><input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askAI()} placeholder="Ask about appointments or general health…"/><button className="btn primary" onClick={askAI}>Send</button></div><p className="ai-note">Not for diagnosis or emergencies. For severe symptoms, seek urgent professional care.</p></div>}
  </div>;
}

function DoctorCard({d,onBook}:{d:any,onBook:()=>void}){return <article className="doctor-card"><div className="avatar large">{d.name.split(" ").filter(Boolean).slice(-1)[0]?.[0]}</div><div className="rating">★ {d.rating}</div><span className="eyebrow">{d.specialty}</span><h2>{d.name}</h2><p>{d.bio}</p><div className="doctor-meta"><span>{d.experience}</span><span>{d.location}</span><span>₹{d.fee}</span></div><button className="btn primary wide" onClick={onBook}>View slots & book</button></article>}
function PageTitle({title,subtitle}:{title:string,subtitle:string}){return <div className="page-head"><span className="eyebrow">Schedula healthcare</span><h1>{title}</h1><p>{subtitle}</p></div>}
function Stat({label,value}:{label:string,value:any}){return <div className="stat"><span>{label}</span><b>{value}</b></div>}
function Empty({text}:{text:string}){return <div className="empty"><div>⌁</div><b>{text}</b><p>Try another filter or create new availability to continue.</p></div>}
function AppointmentCard({a,actions}:{a:any,actions?:any}){return <article className="appointment-card"><div className="appointment-main"><div className="avatar">{(a.patient||a.doctor||"S")[0]}</div><div><span className="eyebrow">{a.type}</span><h3>{a.doctor}</h3><p>{a.specialty} · Patient: {a.patient}</p><b>{a.date} · {a.time}</b></div></div><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span>{actions}</article>}
function ProfileForm({values,onSave}:{values:any,onSave:(x:any)=>void}){const [form,setForm]=useState(values);useEffect(()=>setForm(values),[values]);return <form className="card profile-form" onSubmit={e=>{e.preventDefault();onSave(form)}}>{Object.entries(form).map(([k,v])=><label key={k}><span>{k.replace(/([A-Z])/g," $1").replace(/^./,x=>x.toUpperCase())}</span><input value={String(v)} onChange={e=>setForm({...form,[k]:e.target.value})}/></label>)}<button className="btn primary">Save changes</button></form>}
function AuthCard({title,subtitle,button,onDone,extra,extraAction,register}:{title:string,subtitle:string,button:string,onDone:()=>void,extra:string,extraAction:()=>void,register?:boolean}){const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [name,setName]=useState("");const [error,setError]=useState("");function submit(e:any){e.preventDefault();if((register&&!name.trim())||!email.includes("@")||password.length<6)return setError("Enter valid details. Password must contain at least 6 characters.");onDone()}return <div className="auth-wrap"><form className="auth-card" onSubmit={submit}><span className="pill">Professional portal</span><h1>{title}</h1><p>{subtitle}</p>{register&&<input placeholder="Full professional name" value={name} onChange={e=>setName(e.target.value)}/>}<input placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)}/><input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>{error&&<div className="error">{error}</div>}<button className="btn primary wide">{button}</button><p>{extra} <button type="button" className="text-btn" onClick={extraAction}>{register?"Login":"Register"}</button></p></form></div>}
