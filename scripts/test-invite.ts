import { inviteUser } from "../actions/user";

async function test() {
    console.log("Simulating React Client calling Server Action...");
    try {
        const res = await inviteUser({ name: "Test User", email: "test-staff@xinteck.com", role: "Support Staff" });
        console.log("Server Action returned:", res);
    } catch (e) {
        console.log("Server Action CRASHED:", e);
    }
}
test();
