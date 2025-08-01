import { PrismaClient } from '@prisma/client';


// obtengo toda la data de la base de datos
export const prisma = new PrismaClient();