import { PrismaPg } from "@prisma/adapter-pg";

// Lazy import to avoid loading at build time
let prisma: any;

function getPrismaClient() {
  if (!prisma) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl && typeof window === "undefined") {
      // Only throw error on server-side when actually needed
      console.warn("DATABASE_URL not set");
    }

    if (databaseUrl) {
      const { PrismaClient } = require("@prisma/client");
      const adapter = new PrismaPg({
        connectionString: databaseUrl,
      });
      prisma = new PrismaClient({ adapter });
    }
  }
  return prisma;
}

export default getPrismaClient;
