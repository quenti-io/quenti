import { loadHandler } from "../../lib/load-handler";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { ZAddSetsSchema } from "./add-sets.schema";
import { ZCreateSchema } from "./create.schema";
import { ZDeleteSchema } from "./delete.schema";
import { ZEditSchema } from "./edit.schema";
import { ZGetPublicSchema } from "./get-public.schema";
import { ZGetShareIdSchema } from "./get-share-id.schema";
import { ZGetSchema } from "./get.schema";
import { ZRecentForSetAddSchema } from "./recent-for-set-add.schema";
import { ZRecentSchema } from "./recent.schema";
import { ZRemoveSetSchema } from "./remove-set.schema";
import { ZStarTermSchema } from "./star-term.schema";

type FoldersRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    ["get-public"]?: typeof import("./get-public.handler").getPublicHandler;
    recent?: typeof import("./recent.handler").recentHandler;
    ["recent-for-set-add"]?: typeof import("./recent-for-set-add.handler").recentForSetAddHandler;
    ["get-share-id"]?: typeof import("./get-share-id.handler").getShareIdHandler;
    ["create"]?: typeof import("./create.handler").createHandler;
    ["edit"]?: typeof import("./edit.handler").editHandler;
    ["add-sets"]?: typeof import("./add-sets.handler").addSetsHandler;
    delete?: typeof import("./delete.handler").deleteHandler;
    ["remove-set"]?: typeof import("./remove-set.handler").removeSetHandler;
    ["star-term"]?: typeof import("./star-term.handler").starTermHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: FoldersRouterHandlerCache = {
  handlers: {},
  routerPath: "folders",
};

export const foldersRouter = createTRPCRouter({
  get: protectedProcedure.input(ZGetSchema).query(async ({ ctx, input }) => {
    await loadHandler(HANDLER_CACHE, "get");
    return HANDLER_CACHE.handlers["get"]!({ ctx, input });
  }),
  getPublic: publicProcedure
    .input(ZGetPublicSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-public");
      return HANDLER_CACHE.handlers["get-public"]!({ ctx, input });
    }),
  recent: protectedProcedure
    .input(ZRecentSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "recent");
      return HANDLER_CACHE.handlers["recent"]!({ ctx, input });
    }),
  recentForSetAdd: protectedProcedure
    .input(ZRecentForSetAddSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "recent-for-set-add");
      return HANDLER_CACHE.handlers["recent-for-set-add"]!({ ctx, input });
    }),
  getShareId: publicProcedure
    .input(ZGetShareIdSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-share-id");
      return HANDLER_CACHE.handlers["get-share-id"]!({ ctx, input });
    }),
  create: protectedProcedure
    .input(ZCreateSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "create");
      return HANDLER_CACHE.handlers["create"]!({ ctx, input });
    }),
  edit: protectedProcedure
    .input(ZEditSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "edit");
      return HANDLER_CACHE.handlers["edit"]!({ ctx, input });
    }),
  addSets: protectedProcedure
    .input(ZAddSetsSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "add-sets");
      return HANDLER_CACHE.handlers["add-sets"]!({ ctx, input });
    }),
  delete: protectedProcedure
    .input(ZDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "delete");
      return HANDLER_CACHE.handlers["delete"]!({ ctx, input });
    }),
  removeSet: protectedProcedure
    .input(ZRemoveSetSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "remove-set");
      return HANDLER_CACHE.handlers["remove-set"]!({ ctx, input });
    }),
  starTerm: protectedProcedure
    .input(ZStarTermSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "star-term");
      return HANDLER_CACHE.handlers["star-term"]!({ ctx, input });
    }),
});
