import { storage } from "../server/storage";

async function main() {
  try {
    const users = await storage.getUsers();
    console.log("Found users:", users.length);
    for (const u of users) {
      console.log({ id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, name: (u.firstName||'') + ' ' + (u.lastName||'')});
    }
  } catch (err) {
    console.error('Error listing users:', err);
    process.exit(1);
  }
}

main();
