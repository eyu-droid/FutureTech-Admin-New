import { PrismaClient } from '@prisma/client';

declare global {
  // allow a global Prisma client variable across modules
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = db;