import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Config WebSocket pour Neon
neonConfig.webSocketConstructor = ws;

// PrismaClient normal, sans adapter
const prisma = global.prisma || new PrismaClient({ log: ['query'] });

// Pour éviter plusieurs instances en développement
if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export default prisma;
