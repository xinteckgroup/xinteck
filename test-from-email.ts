import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function decrypt(enc: string) {
    let key = process.env.ENCRYPTION_KEY;
    if (!key) throw new Error("ENCRYPTION_KEY required");
    let keyBuffer = key.length === 64 ? Buffer.from(key, 'hex') : Buffer.from(key, 'utf8');
    const [ivHex, encrypted, tagHex] = enc.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

async function check() {
    const config = await prisma.secretConfig.findUnique({ where: { key: "RESEND_FROM_EMAIL" }});
    if (!config) {
        console.log("No config found in db for RESEND_FROM_EMAIL");
    } else {
        console.log("Found RESEND_FROM_EMAIL:", decrypt(config.encryptedValue));
    }
    
    // Check all configs
    const configs = await prisma.secretConfig.findMany();
    console.log("ALL DB SECRETS:", configs.map(c => c.key));
}
check().finally(() => prisma.$disconnect());
