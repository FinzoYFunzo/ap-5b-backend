import { PrismaClient } from "@prisma/client";
import { createApp } from './app';
import env from './config/env';

const prisma = new PrismaClient();
const PORT = env.port;

async function main() {
  try {
    await prisma.$connect();
    const app = createApp();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log()
    });
  } catch (err) {
    console.error("Failed to connect to database", err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}