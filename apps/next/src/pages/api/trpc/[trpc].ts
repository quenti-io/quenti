import { withAxiom } from "next-axiom";

import { env } from "@quenti/env/server";
import { createNextApiHandler } from "@quenti/trpc/server/adapters/next";
import { appRouter } from "@quenti/trpc/server/root";
import { createTRPCContext } from "@quenti/trpc/server/trpc";
import { withHighlight } from "../../../../highlight.config";

export default withAxiom(
  withHighlight(
    createNextApiHandler({
      router: appRouter,
      createContext: createTRPCContext,
      onError:
        env.NODE_ENV === "development"
          ? ({ path, error }) => {
              console.error(
                `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
              );
            }
          : undefined,
    })
  )
);
