import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type AppData = any;

export async function getState(): Promise<AppData> {
  const row = await prisma.appState.findUnique({ where: { id: 1 } });
  if (!row) return {};
  return JSON.parse(row.data);
}

export async function saveState(data: AppData) {
  await prisma.appState.upsert({
    where: { id: 1 },
    update: { data: JSON.stringify(data) },
    create: { id: 1, data: JSON.stringify(data) }
  });
  return data;
}
