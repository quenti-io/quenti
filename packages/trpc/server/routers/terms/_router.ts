import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZAddSchema } from "./add.schema";
import { ZBulkAddSchema } from "./bulk-add.schema";
import { ZBulkDeleteSchema } from "./bulk-delete.schema";
import { ZBulkEditSchema } from "./bulk-edit.schema";
import { ZDeleteSchema } from "./delete.schema";
import { ZEditSchema } from "./edit.schema";
import { ZRemoveImageSchema } from "./remove-image.schema";
import { ZReorderSchema } from "./reorder.schema";
import { ZSetImageSchema } from "./set-image.schema";
import { ZUploadImageSchema } from "./upload-image.schema";

type TermsRouterHandlerCache = {
  handlers: {
    add?: typeof import("./add.handler").addHandler;
    reorder?: typeof import("./reorder.handler").reorderHandler;
    edit?: typeof import("./edit.handler").editHandler;
    ["bulk-add"]?: typeof import("./bulk-add.handler").bulkAddHandler;
    ["bulk-edit"]?: typeof import("./bulk-edit.handler").bulkEditHandler;
    ["bulk-delete"]?: typeof import("./bulk-delete.handler").bulkDeleteHandler;
    ["set-image"]?: typeof import("./set-image.handler").setImageHandler;
    ["upload-image"]?: typeof import("./upload-image.handler").uploadImageHandler;
    ["upload-image-complete"]?: typeof import("./upload-image-complete.handler").uploadImageCompleteHandler;
    ["remove-image"]?: typeof import("./remove-image.handler").removeImageHandler;
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
  bulkAdd: protectedProcedure
    .input(ZBulkAddSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "bulk-add");
      return HANDLER_CACHE.handlers["bulk-add"]!({ ctx, input });
    }),
  bulkEdit: protectedProcedure
    .input(ZBulkEditSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "bulk-edit");
      return HANDLER_CACHE.handlers["bulk-edit"]!({ ctx, input });
    }),
  bulkDelete: protectedProcedure
    .input(ZBulkDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "bulk-delete");
      return HANDLER_CACHE.handlers["bulk-delete"]!({ ctx, input });
    }),
  setImage: protectedProcedure
    .input(ZSetImageSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-image");
      return HANDLER_CACHE.handlers["set-image"]!({ ctx, input });
    }),
  uploadImage: protectedProcedure
    .input(ZUploadImageSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "upload-image");
      return HANDLER_CACHE.handlers["upload-image"]!({ ctx, input });
    }),
  uploadImageComplete: protectedProcedure
    .input(ZUploadImageSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "upload-image-complete");
      return HANDLER_CACHE.handlers["upload-image-complete"]!({ ctx, input });
    }),
  removeImage: protectedProcedure
    .input(ZRemoveImageSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "remove-image");
      return HANDLER_CACHE.handlers["remove-image"]!({ ctx, input });
    }),
  delete: protectedProcedure
    .input(ZDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "delete");
      return HANDLER_CACHE.handlers.delete!({ ctx, input });
    }),
});
