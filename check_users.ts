import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users.map(u => ({ email: u.email, role: u.role })));
}

main().catch(console.error).finally(() => prisma.$disconnect());
