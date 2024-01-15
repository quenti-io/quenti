import { loadHandler } from "../../lib/load-handler";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  teacherProcedure,
} from "../../trpc";
import { ZByIdSchema } from "./by-id.schema";
import { ZCreateSchema } from "./create.schema";
import { ZDeleteSchema } from "./delete.schema";
import { ZEditSchema } from "./edit.schema";
import { ZGetAllowedClassesSchema } from "./get-allowed-classes.schema";
import { ZGetAutosaveSchema } from "./get-autosave.schema";
import { ZGetPublicSchema } from "./get-public.schema";
import { ZGetShareIdSchema } from "./get-share-id.schema";
import { ZRecentSchema } from "./recent.schema";
import { ZSetAllowedClassesSchema } from "./set-allowed-classes.schema";

type StudySetsRouterHandlerCache = {
  handlers: {
    recent?: typeof import("./recent.handler").recentHandler;
    ["by-id"]?: typeof import("./by-id.handler").byIdHandler;
    ["get-public"]?: typeof import("./get-public.handler").getPublicHandler;
    ["get-autosave"]?: typeof import("./get-autosave.handler").getAutosaveHandler;
    ["create-autosave"]?: typeof import("./create-autosave.handler").createAutosaveHandler;
    ["get-share-id"]?: typeof import("./get-share-id.handler").getShareIdHandler;
    ["get-allowed-classes"]?: typeof import("./get-allowed-classes.handler").getAllowedClassesHandler;
    ["set-allowed-classes"]?: typeof import("./set-allowed-classes.handler").setAllowedClassesHandler;
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
  getAutosave: protectedProcedure
    .input(ZGetAutosaveSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-autosave");
      return HANDLER_CACHE.handlers["get-autosave"]!({ ctx, input });
    }),
  createAutosave: protectedProcedure.mutation(async ({ ctx }) => {
    await loadHandler(HANDLER_CACHE, "create-autosave");
    return HANDLER_CACHE.handlers["create-autosave"]!({ ctx });
  }),
  getShareId: publicProcedure
    .input(ZGetShareIdSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-share-id");
      return HANDLER_CACHE.handlers["get-share-id"]!({ ctx, input });
    }),
  getAllowedClasses: teacherProcedure
    .input(ZGetAllowedClassesSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-allowed-classes");
      return HANDLER_CACHE.handlers["get-allowed-classes"]!({ ctx, input });
    }),
  setAllowedClasses: teacherProcedure
    .input(ZSetAllowedClassesSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-allowed-classes");
      return HANDLER_CACHE.handlers["set-allowed-classes"]!({ ctx, input });
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
