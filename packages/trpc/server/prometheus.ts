import client from "prom-client";

import { env } from "@quenti/env/server";
import { prisma } from "@quenti/prisma";

import pjson from "../../../apps/next/package.json";

const version = pjson.version;
const versionSegments = version.split(".");

declare global {
  // eslint-disable-next-line no-var
  var register: client.Registry | undefined;
}

export const register =
  global.register ||
  (() => {
    const r = client.register;
    r.setDefaultLabels({ server: env.SERVER_NAME });
    client.collectDefaultMetrics({ register: r });

    new client.Gauge({
      name: "users",
      help: "The number of users",
      async collect() {
        this.set(await prisma.user.count());
      },
    });
    new client.Gauge({
      name: "active_users",
      help: "The number of users seen in the last 10 minutes",
      async collect() {
        this.set(
          await prisma.user.count({
            where: {
              lastSeenAt: {
                gte: new Date(Date.now() - 10 * 60 * 1000),
              },
            },
          }),
        );
      },
    });
    new client.Gauge({
      name: "study_sets",
      help: "The number of study sets",
      async collect() {
        this.set(await prisma.studySet.count());
      },
    });
    new client.Gauge({
      name: "folders",
      help: "The number of folders",
      async collect() {
        this.set(await prisma.folder.count());
      },
    });
    new client.Gauge({
      name: "terms",
      help: "The number of terms",
      async collect() {
        this.set(await prisma.term.count());
      },
    });
    new client.Gauge({
      name: "containers",
      help: "The number of containers",
      async collect() {
        this.set(await prisma.container.count());
      },
    });
    new client.Gauge({
      name: "studiable_terms",
      help: "The number of studiable terms",
      async collect() {
        this.set(await prisma.studiableTerm.count());
      },
    });
    new client.Gauge({
      name: "starred_terms",
      help: "The number of starred terms",
      async collect() {
        this.set(await prisma.starredTerm.count());
      },
    });
    new client.Gauge({
      name: "study_sets_on_folders",
      help: "The number of relationships between study sets and folders (included study sets in folders)",
      async collect() {
        this.set(await prisma.studySetsOnFolders.count());
      },
    });

    new client.Counter({
      name: "authed_api_requests_total",
      help: "The number of requests to the API that were authenticated",
    });
    new client.Counter({
      name: "fetch_import_requests_total",
      help: "The number of requests to import directly from Quizlet.com",
    });
    new client.Counter({
      name: "studiable_requests_total",
      help: 'The number of term "put" requests made to the studiable router',
    });

    new client.Gauge({
      name: "version_info",
      help: "Quizlet version info.",
      labelNames: ["version", "major", "minor", "patch"],
      aggregator: "first",
      collect() {
        this.labels(
          `v${version}`,
          versionSegments[0] || "0",
          versionSegments[1] || "0",
          versionSegments[2] || "0",
        ).set(1);
      },
    });

    return r;
  })();

global.register = register;
