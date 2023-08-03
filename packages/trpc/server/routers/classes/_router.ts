import { loadHandler } from "../../lib/load-handler";
import {
  createTRPCRouter,
  protectedProcedure,
  teacherProcedure,
} from "../../trpc";
import { ZCreateSchema } from "./create.schema";
import { ZGetSchema } from "./get.schema";

type ClassesRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    create?: typeof import("./create.handler").createHandler;
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
});
