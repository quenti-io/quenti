import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZAddSchema } from "./add.schema";
import { ZBulkAddSchema } from "./bulk-add.schema";
import { ZBulkEditSchema } from "./bulk-edit.schema";
import { ZDeleteSchema } from "./delete.schema";
import { ZEditSchema } from "./edit.schema";
import { ZReorderSchema } from "./reorder.schema";
import { ZSetImageSchema } from "./set-image.schema";

type TermsRouterHandlerCache = {
  handlers: {
    add?: typeof import("./add.handler").addHandler;
    ["bulk-add"]?: typeof import("./bulk-add.handler").bulkAddHandler;
    reorder?: typeof import("./reorder.handler").reorderHandler;
    edit?: typeof import("./edit.handler").editHandler;
    ["bulk-edit"]?: typeof import("./bulk-edit.handler").bulkEditHandler;
    ["set-image"]?: typeof import("./set-image.handler").setImageHandler;
    delete?: typeof import("./delete.handler").deleteHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: TermsRouterHandlerCache = {
  handlers: {},
  routerPath: "terms",
};

export const termsRouter = createTRPCRouter({
  add: protectedProcedure.input(ZAddSchema).mutation(async ({ ctx, input }) => {
    await loadHandler(HANDLER_CACHE, "add");
    return HANDLER_CACHE.handlers.add!({ ctx, input });
  }),
  bulkAdd: protectedProcedure
    .input(ZBulkAddSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "bulk-add");
      return HANDLER_CACHE.handlers["bulk-add"]!({ ctx, input });
    }),
  reorder: protectedProcedure
    .input(ZReorderSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "reorder");
      return HANDLER_CACHE.handlers.reorder!({ ctx, input });
    }),
  edit: protectedProcedure
    .input(ZEditSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "edit");
      return HANDLER_CACHE.handlers.edit!({ ctx, input });
    }),
  bulkEdit: protectedProcedure
    .input(ZBulkEditSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "bulk-edit");
      return HANDLER_CACHE.handlers["bulk-edit"]!({ ctx, input });
    }),
  setImage: protectedProcedure
    .input(ZSetImageSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-image");
      return HANDLER_CACHE.handlers["set-image"]!({ ctx, input });
    }),
  delete: protectedProcedure
    .input(ZDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "delete");
      return HANDLER_CACHE.handlers.delete!({ ctx, input });
    }),
});
