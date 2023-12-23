import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, teacherProcedure } from "../../trpc";
import { ZCreateAssignmentSchema } from "./create.schema";

type AssignmentsRouteHandlerCache = {
  handlers: {
    create?: typeof import("./create.handler").createHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: AssignmentsRouteHandlerCache = {
  handlers: {},
  routerPath: "assignments",
};

export const assignmentsRouter = createTRPCRouter({
  create: teacherProcedure
    .input(ZCreateAssignmentSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "create");
      return HANDLER_CACHE.handlers.create!({ ctx, input });
    }),
});
