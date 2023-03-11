import { createNextApiHandler } from "@trpc/server/adapters/next";
import { withAxiom } from "next-axiom";

import { withHighlight } from "../../../../highlight.config";
import { env } from "../../../env/server.mjs";
import { appRouter } from "../../../server/api/root";
import { createTRPCContext } from "../../../server/api/trpc";

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
