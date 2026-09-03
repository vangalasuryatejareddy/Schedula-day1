import { NextResponse } from "next/server";
import { getState, saveState } from "@/lib/state";

export async function GET() {
  return NextResponse.json(await getState());
}

export async function PUT(req: Request) {
  const data = await req.json();
  await saveState(data);
  return NextResponse.json({ ok: true, data });
}
