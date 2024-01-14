import { loadHandler } from "../../lib/load-handler";
import {
  createTRPCRouter,
  protectedProcedure,
  teacherProcedure,
} from "../../trpc";
import { ZBulkAddCollabTopicsSchema } from "./bulk-add-collab-topics.schema";
import { ZCreateCollaborativeSchema } from "./create-collaborative.schema";
import { ZCreateAssignmentSchema } from "./create.schema";
import { ZDeleteAssignmentSchema } from "./delete.schema";
import { ZDuplicateSchema } from "./duplicate.schema";
import { ZEditCollabSchema } from "./edit-collab.schema";
import { ZEditSchema } from "./edit.schema";
import { ZFeedSchema } from "./feed.schema";
import { ZGetSchema } from "./get.schema";
import { ZSetPublishedSchema } from "./set-published.schema";

type AssignmentsRouteHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    feed?: typeof import("./feed.handler").feedHandler;
    create?: typeof import("./create.handler").createHandler;
    edit?: typeof import("./edit.handler").editHandler;
    delete?: typeof import("./delete.handler").deleteHandler;
    duplicate?: typeof import("./duplicate.handler").duplicateHandler;
    ["set-published"]?: typeof import("./set-published.handler").setPublishedHandler;
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
  get: protectedProcedure.input(ZGetSchema).query(async ({ ctx, input }) => {
    await loadHandler(HANDLER_CACHE, "get");
    return HANDLER_CACHE.handlers.get!({ ctx, input });
  }),
  feed: protectedProcedure.input(ZFeedSchema).query(async ({ ctx, input }) => {
    await loadHandler(HANDLER_CACHE, "feed");
    return HANDLER_CACHE.handlers.feed!({ ctx, input });
  }),
  create: teacherProcedure
    .input(ZCreateAssignmentSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "create");
      return HANDLER_CACHE.handlers.create!({ ctx, input });
    }),
  edit: teacherProcedure.input(ZEditSchema).mutation(async ({ ctx, input }) => {
    await loadHandler(HANDLER_CACHE, "edit");
    return HANDLER_CACHE.handlers.edit!({ ctx, input });
  }),
  delete: teacherProcedure
    .input(ZDeleteAssignmentSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "delete");
      return HANDLER_CACHE.handlers.delete!({ ctx, input });
    }),
  duplicate: teacherProcedure
    .input(ZDuplicateSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "duplicate");
      return HANDLER_CACHE.handlers.duplicate!({ ctx, input });
    }),
  setPublished: teacherProcedure
    .input(ZSetPublishedSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-published");
      return HANDLER_CACHE.handlers["set-published"]!({ ctx, input });
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
