import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, teacherProcedure } from "../../trpc";
import { ZBulkAddCollabTopicsSchema } from "./bulk-add-collab-topics.schema";
import { ZCreateCollaborativeSchema } from "./create-collaborative.schema";
import { ZCreateAssignmentSchema } from "./create.schema";
import { ZEditCollabSchema } from "./edit-collab.schema";

type AssignmentsRouteHandlerCache = {
  handlers: {
    create?: typeof import("./create.handler").createHandler;
    ["create-collaborative"]?: typeof import("./create-collaborative.handler").createCollaborativeHandler;
    ["edit-collab"]?: typeof import("./edit-collab.handler").editCollabHandler;
    ["bulk-add-collab-topics"]?: typeof import("./bulk-add-collab-topics.handler").bulkAddCollabTopicsHandler;
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
  editCollab: teacherProcedure
    .input(ZEditCollabSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "edit-collab");
      return HANDLER_CACHE.handlers["edit-collab"]!({ ctx, input });
    }),
  bulkAddCollabTopics: teacherProcedure
    .input(ZBulkAddCollabTopicsSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "bulk-add-collab-topics");
      return HANDLER_CACHE.handlers["bulk-add-collab-topics"]!({ ctx, input });
    }),
});
