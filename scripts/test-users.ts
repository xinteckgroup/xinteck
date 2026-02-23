import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

async function check() {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
    console.log("Current Live DB Users:");
    console.log(users.map(u => ({ email: u.email, role: u.role, createdAt: u.createdAt, deletedAt: u.deletedAt, status: u.status })));
}
check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
