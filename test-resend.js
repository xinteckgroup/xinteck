const fs = require('fs');
require('dotenv').config();

async function check() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("NO RESEND_API_KEY found in .env");
    return;
  }
  
  try {
    const res = await fetch("https://api.resend.com/emails", {
      headers: {
        "Authorization": `Bearer ${key}`
      }
    });
    
    const data = await res.json();
    console.log("RECENT EMAILS:", JSON.stringify(data.data.slice(0, 5), null, 2));
  } catch (e) {
    console.log("Error fetching from Resend:", e);
  }
}
check();
