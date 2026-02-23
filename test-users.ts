import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
  console.log("Recent Users:", users.map(u => ({ email: u.email, role: u.role, createdAt: u.createdAt, deletedAt: u.deletedAt })));
}
check();
