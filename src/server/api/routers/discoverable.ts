import fs from "fs";
import path from "path";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const staticDir = path.join(process.cwd(), "src/server/static");

const correct: string[] = fs
  .readFileSync(staticDir + "/insults/correct.txt")
  .toString()
  .split("\n");
const incorrect: string[] = fs
  .readFileSync(staticDir + "/insults/incorrect.txt")
  .toString()
  .split("\n");

export const discoverableRouter = createTRPCRouter({
  fetchInsults: protectedProcedure.query(() => {
    return { correct, incorrect };
  }),
});
