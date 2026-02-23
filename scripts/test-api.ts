import { inviteUser } from "../actions/user";

async function test() {
  console.log("Simulating inviteUser...");
  try {
    const res = await inviteUser({ name: "Kuzzi Staff 2", email: "test-receiver-123@xinteck.co.ke", role: "Support Staff" });
    console.log("Response:", res);
  } catch(e) {
    console.log("Error:", e);
  }
}
test();
