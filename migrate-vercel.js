"use strict";

const { execSync } = require("child_process");
const { DIRECT_DATABASE_URL } = process.env;

try {
  if (!DIRECT_DATABASE_URL) {
    throw new Error("Missing DIRECT_DATABASE_URL environment variable!");
  }

  // RESOLVED: https://github.com/prisma/prisma/issues/4752
  execSync("yarn prisma migrate deploy");
} catch (error) {
  console.error(error);
  process.exit(1);
}
