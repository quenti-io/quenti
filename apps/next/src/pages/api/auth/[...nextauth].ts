import type { NextApiHandler } from "next";
import NextAuth from "next-auth";

import { authOptions } from "@quenti/auth/next-auth-options";

import { withHighlight } from "../../../../highlight.config";

export default withHighlight(NextAuth(authOptions) as NextApiHandler);
