const { PrismaClient } = require("../generated/prisma");

const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.NEON_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

module.exports = {
  prisma,
};
