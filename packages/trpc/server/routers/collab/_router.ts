import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZAddTermSchema } from "./add-term.schema";
import { ZDeleteTermSchema } from "./delete-term.schema";
import { ZEditTermSchema } from "./edit-term.schema";
import { ZGetSchema } from "./get.schema";
import { ZSubmitSchema } from "./submit.schema";

type CollabRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    submit?: typeof import("./submit.handler").submitHandler;
    ["add-term"]?: typeof import("./add-term.handler").addTermHandler;
    ["edit-term"]?: typeof import("./edit-term.handler").editTermHandler;
    ["delete-term"]?: typeof import("./delete-term.handler").deleteTermHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: CollabRouterHandlerCache = {
  handlers: {},
  routerPath: "collab",
};

export const collabRouter = createTRPCRouter({
  get: protectedProcedure.input(ZGetSchema).query(async ({ ctx, input }) => {
    await loadHandler(HANDLER_CACHE, "get");
    return HANDLER_CACHE.handlers.get!({ ctx, input });
  }),
  submit: protectedProcedure
    .input(ZSubmitSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "submit");
      return HANDLER_CACHE.handlers.submit!({ ctx, input });
    }),
  addTerm: protectedProcedure
    .input(ZAddTermSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "add-term");
      return HANDLER_CACHE.handlers["add-term"]!({ ctx, input });
    }),
  editTerm: protectedProcedure
    .input(ZEditTermSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "edit-term");
      return HANDLER_CACHE.handlers["edit-term"]!({ ctx, input });
    }),
  deleteTerm: protectedProcedure
    .input(ZDeleteTermSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "delete-term");
      return HANDLER_CACHE.handlers["delete-term"]!({ ctx, input });
    }),
});
