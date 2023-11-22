import { loadHandler } from "../../lib/load-handler";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import { ZByIdSchema } from "./by-id.schema";
import { ZCreateSchema } from "./create.schema";
import { ZDeleteSchema } from "./delete.schema";
import { ZEditSchema } from "./edit.schema";
import { ZGetPublicSchema } from "./get-public.schema";
import { ZGetShareIdSchema } from "./get-share-id.schema";
import { ZRecentSchema } from "./recent.schema";

type StudySetsRouterHandlerCache = {
  handlers: {
    recent?: typeof import("./recent.handler").recentHandler;
    ["by-id"]?: typeof import("./by-id.handler").byIdHandler;
    ["get-public"]?: typeof import("./get-public.handler").getPublicHandler;
    ["get-autosave"]?: typeof import("./get-autosave.handler").getAutosaveHandler;
    ["get-share-id"]?: typeof import("./get-share-id.handler").getShareIdHandler;
    create?: typeof import("./create.handler").createHandler;
    edit?: typeof import("./edit.handler").editHandler;
    delete?: typeof import("./delete.handler").deleteHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: StudySetsRouterHandlerCache = {
  handlers: {},
  routerPath: "study-sets",
};

export const studySetsRouter = createTRPCRouter({
  recent: protectedProcedure
    .input(ZRecentSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "recent");
      return HANDLER_CACHE.handlers.recent!({ ctx, input });
    }),
  byId: protectedProcedure.input(ZByIdSchema).query(async ({ ctx, input }) => {
    await loadHandler(HANDLER_CACHE, "by-id");
    return HANDLER_CACHE.handlers["by-id"]!({ ctx, input });
  }),
  getPublic: publicProcedure
    .input(ZGetPublicSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-public");
      return HANDLER_CACHE.handlers["get-public"]!({ ctx, input });
    }),
  getAutoSave: protectedProcedure.query(async ({ ctx }) => {
    await loadHandler(HANDLER_CACHE, "get-autosave");
    return HANDLER_CACHE.handlers["get-autosave"]!({ ctx });
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
      return HANDLER_CACHE.handlers.edit!({ ctx, input });
    }),
  delete: protectedProcedure
    .input(ZDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "delete");
      return HANDLER_CACHE.handlers.delete!({ ctx, input });
    }),
});
