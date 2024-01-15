import fs from "fs";
import path from "path";

import { EnabledFeature } from "@quenti/lib/feature";

import { createTRPCRouter, lockedProcedure } from "../trpc";

const staticDir = path.join(process.cwd(), "../../packages/trpc/server/static");

const correct: string[] = fs
  .readFileSync(staticDir + "/insults/correct.txt")
  .toString()
  .split("\n")
  .filter((i) => !!i.length);
const incorrect: string[] = fs
  .readFileSync(staticDir + "/insults/incorrect.txt")
  .toString()
  .split("\n")
  .filter((i) => !!i.length);

export const discoverableRouter = createTRPCRouter({
  fetchInsults: lockedProcedure([EnabledFeature.ExtendedFeedbackBank]).query(
    () => {
      return { correct, incorrect };
    },
  ),
});
