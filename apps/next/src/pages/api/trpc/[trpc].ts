import { Handlers } from "@highlight-run/node";
import { withAxiom } from "next-axiom";

import { env as clientEnv } from "@quenti/env/client";
import { env } from "@quenti/env/server";
import { createNextApiHandler } from "@quenti/trpc/server/adapters/next";
import { appRouter } from "@quenti/trpc/server/root";
import { createTRPCContext } from "@quenti/trpc/server/trpc";

export default withAxiom(
  createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : clientEnv.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID
          ? async ({ error, req }) => {
              await Handlers.trpcOnError(
                { error, req },
                {
                  projectID: clientEnv.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID!,
                  serviceName: "quenti-trpc",
                  serviceVersion: "1.0.0",
                },
              );
            }
          : undefined,
  }),
);
