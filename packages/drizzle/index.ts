import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "@quenti/env/server";

import * as schema from "./schema";

export * from "drizzle-orm";

const connection = env.PLANETSCALE
  ? connect({
      url: env.DATABASE_URL,
    })
  : null;

export const db = connection ? drizzle(connection, { schema }) : null;
