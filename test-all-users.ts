import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const users = await prisma.user.findMany();
  console.log("EVERY SINGLE USER IN DB:");
  console.log(users.map(u => ({ email: u.email, role: u.role, deletedAt: u.deletedAt })));
}
check().finally(() => prisma.$disconnect());
