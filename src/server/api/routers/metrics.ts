import { register } from "../../prometheus";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const metricsRouter = createTRPCRouter({
  collect: publicProcedure.query(async () => {
    return await register.metrics();
  }),
});
