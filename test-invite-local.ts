import { PrismaClient, UserStatus } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function test() {
  console.log("Simulating inviteUser Database Transaction...");
  const tempPassword = "xinteck123";
  const hashedPassword = await bcrypt.hash(tempPassword, 10);
  
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: "kuzzi735@gmail.com" } });
    console.log("Found existing user:", !!existingUser, "deletedAt:", existingUser?.deletedAt);
    
    if (existingUser) {
        if (existingUser.deletedAt !== null) {
            console.log("Attempting Resurrection...");
            const resurrected = await prisma.user.update({
                where: { email: "kuzzi735@gmail.com" },
                data: {
                    name: "Kuzzi Admin Test",
                    passwordHash: hashedPassword,
                    role: "SUPPORT_STAFF",
                    status: UserStatus.ACTIVE,
                    deletedAt: null // Resurrection!
                }
            });
            console.log("Resurrection Success:", resurrected.email, "deletedAt:", resurrected.deletedAt);
        } else {
            console.log("User already exists and is active.");
        }
    }
  } catch(e) {
    console.log("Prisma CRASHED:", e);
  } finally {
    await prisma.$disconnect()
  }
}
test();
