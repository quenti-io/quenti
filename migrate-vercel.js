"use strict";

const { execSync } = require("child_process");
const { DATABASE_URL_MIGRATE } = process.env;

try {
  if (!DATABASE_URL_MIGRATE) {
    throw new Error("Missing DATABASE_URL_MIGRATE environment variable!");
  }

  // Run the migrate with database connection not using pooling
  // See: https://github.com/prisma/prisma/issues/4752
  execSync(`DATABASE_URL=${DATABASE_URL_MIGRATE} yarn prisma migrate deploy`);
} catch (error) {
  console.error(error);
  process.exit(1);
}
