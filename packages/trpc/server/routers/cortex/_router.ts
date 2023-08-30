import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZBulkGradeSchema } from "./bulk-grade.schema";

type CortexRouterHandlerCache = {
  handlers: {
    ["bulk-grade"]?: typeof import("./bulk-grade.handler").bulkGradeHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: CortexRouterHandlerCache = {
  handlers: {},
  routerPath: "cortex",
};

export const cortexRouter = createTRPCRouter({
  bulkGrade: protectedProcedure
    .input(ZBulkGradeSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "bulk-grade");
      return HANDLER_CACHE.handlers["bulk-grade"]!({ ctx, input });
    }),
});
