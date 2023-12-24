import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, teacherProcedure } from "../../trpc";
import { ZCreateCollaborativeSchema } from "./create-collaborative.schema";
import { ZCreateAssignmentSchema } from "./create.schema";

type AssignmentsRouteHandlerCache = {
  handlers: {
    create?: typeof import("./create.handler").createHandler;
    ["create-collaborative"]?: typeof import("./create-collaborative.handler").createCollaborativeHandler;
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
  createCollaborative: teacherProcedure
    .input(ZCreateCollaborativeSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "create-collaborative");
      return HANDLER_CACHE.handlers["create-collaborative"]!({ ctx, input });
    }),
});
