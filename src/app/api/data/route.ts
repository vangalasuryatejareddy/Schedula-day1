import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
export const runtime = 'nodejs';
const file = path.join(process.cwd(), 'data', 'schedula-db.json');
async function ensure() { await fs.mkdir(path.dirname(file), { recursive: true }); try { await fs.access(file); } catch { await fs.writeFile(file, JSON.stringify({ updatedAt: new Date().toISOString(), state: null }, null, 2)); } }
export async function GET() { await ensure(); return NextResponse.json(JSON.parse(await fs.readFile(file, 'utf8'))); }
export async function POST(request: NextRequest) { await ensure(); const body = await request.json(); const payload = { updatedAt: new Date().toISOString(), state: body.state ?? body }; await fs.writeFile(file, JSON.stringify(payload, null, 2)); return NextResponse.json({ ok: true, updatedAt: payload.updatedAt }); }
