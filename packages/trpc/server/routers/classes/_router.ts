import { loadHandler } from "../../lib/load-handler";
import {
  createTRPCRouter,
  protectedProcedure,
  teacherProcedure,
} from "../../trpc";
import { ZAddEntitiesSchema } from "./add-entities.schema";
import { ZCreateSectionSchema } from "./create-section.schema";
import { ZCreateSchema } from "./create.schema";
import { ZDeleteSectionSchema } from "./delete-section.schema";
import { ZGetSchema } from "./get.schema";
import { ZRemoveEntitySchema } from "./remove-entity.schema";

type ClassesRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    create?: typeof import("./create.handler").createHandler;
    ["add-entities"]?: typeof import("./add-entities.handler").addEntitiesHandler;
    ["remove-entity"]?: typeof import("./remove-entity.handler").removeEntityHandler;
    ["create-section"]?: typeof import("./create-section.handler").createSectionHandler;
    ["delete-section"]?: typeof import("./delete-section.handler").deleteSectionHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: ClassesRouterHandlerCache = {
  handlers: {},
  routerPath: "classes",
};

export const classesRouter = createTRPCRouter({
  get: protectedProcedure.input(ZGetSchema).query(async ({ ctx, input }) => {
    await loadHandler(HANDLER_CACHE, "get");
    return HANDLER_CACHE.handlers.get!({ ctx, input });
  }),
  create: teacherProcedure
    .input(ZCreateSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "create");
      return HANDLER_CACHE.handlers.create!({ ctx, input });
    }),
  addEntities: teacherProcedure
    .input(ZAddEntitiesSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "add-entities");
      return HANDLER_CACHE.handlers["add-entities"]!({ ctx, input });
    }),
  removeEntity: teacherProcedure
    .input(ZRemoveEntitySchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "remove-entity");
      return HANDLER_CACHE.handlers["remove-entity"]!({ ctx, input });
    }),
  createSection: teacherProcedure
    .input(ZCreateSectionSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "create-section");
      return HANDLER_CACHE.handlers["create-section"]!({ ctx, input });
    }),
  deleteSection: teacherProcedure
    .input(ZDeleteSectionSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "delete-section");
      return HANDLER_CACHE.handlers["delete-section"]!({ ctx, input });
    }),
});
