export type NotificationRecord={id:string; audience:"user"|"doctor"; doctorId?:string; title:string; message:string; appointmentId?:string; createdAt:string; read:boolean};
const KEY="schedula-notifications";
const read=()=>{if(typeof window==="undefined")return [] as NotificationRecord[];try{return JSON.parse(window.localStorage.getItem(KEY)||"[]") as NotificationRecord[]}catch{return [] as NotificationRecord[]}};
const write=(items:NotificationRecord[])=>{window.localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new Event("schedula-notifications-changed"));};
export const getNotifications=(audience:"user"|"doctor",doctorId?:string)=>read().filter(n=>n.audience===audience&&(!doctorId||n.doctorId===doctorId)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
export const addNotification=(input:Omit<NotificationRecord,"id"|"createdAt"|"read">)=>write([{...input,id:`NTF-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,createdAt:new Date().toISOString(),read:false},...read()]);
export const markNotificationsRead=(audience:"user"|"doctor",doctorId?:string)=>write(read().map(n=>n.audience===audience&&(!doctorId||n.doctorId===doctorId)?{...n,read:true}:n));
