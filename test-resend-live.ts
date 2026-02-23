import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function getKey(): Buffer {
    let key = process.env.ENCRYPTION_KEY;
    if (!key) throw new Error("ENCRYPTION_KEY must be set in environment variables.");
    
    // Quick fallback mapping in case dotenv is not loaded from Next.js root
    if (key.length === 64) {
        return Buffer.from(key, 'hex');
    }
    if (key.length === 32) {
        return Buffer.from(key, 'utf8');
    }
    throw new Error("Invalid key length");
}

function decrypt(enc: string) {
    const keyBuffer = getKey();
    const [ivHex, encrypted, tagHex] = enc.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', keyBuffer, iv);
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

async function check() {
    console.log("Fetching config...");
    const config = await prisma.secretConfig.findUnique({ where: { key: "RESEND_API_KEY" }});
    if (!config) {
        console.log("No config found in db for RESEND_API_KEY");
        return;
    }
    
    try {
        const apiKey = decrypt(config.encryptedValue);
        console.log("Decrypted API Key successfully. Fetching from Resend...");
        
        const res = await fetch("https://api.resend.com/emails", {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        });
        
        const data = await res.json();
        console.log("Recent Emails Summary:", data.data.map((e: any) => ({
             id: e.id,
             to: e.to,
             subject: e.subject,
             status: e.status
        })));
        
    } catch (e) {
        console.log("Script Error", e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
