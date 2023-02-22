import client from "prom-client";
import { env } from "../env/server.mjs";
import { prisma } from "./db";

declare global {
  // eslint-disable-next-line no-var
  var register: client.Registry | undefined;
}

export const register =
  global.register ||
  (() => {
    const r = client.register;
    client.collectDefaultMetrics({ register: r });

    new client.Gauge({
      name: "num_study_sets",
      help: "The number of study sets in the database",
      async collect() {
        this.set(await prisma.studySet.count());
      },
    });

    return r;
  })();

if (env.NODE_ENV !== "production") {
  global.register = register;
}
