import { Highlight } from "@highlight-run/next";
import type { NextApiHandler } from "next";
import { env } from "./src/env/server.mjs";

export const withHighlight = env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID
  ? Highlight({
      projectID: env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
    })
  : (handler: NextApiHandler) => handler;
