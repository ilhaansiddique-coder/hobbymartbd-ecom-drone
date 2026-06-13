import "dotenv/config";
import { prisma } from "./src/lib/prisma";

async function main() {
  await prisma.user.updateMany({
    where: { email: 'elsiddique@gmail.com' },
    data: { role: 'ADMIN' },
  });
  console.log("Updated elsiddique@gmail.com to ADMIN");
}

main().catch(console.error).finally(() => prisma.$disconnect());
