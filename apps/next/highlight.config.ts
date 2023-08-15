import { Highlight } from "@highlight-run/next/server";
import type { NextApiHandler } from "next";

import { env } from "@quenti/env/client";

export const withHighlight = env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID
  ? Highlight({
      projectID: env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
    })
  : (handler: NextApiHandler) => handler;
