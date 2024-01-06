import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZAddTermSchema } from "./add-term.schema";
import { ZDeleteTermSchema } from "./delete-term.schema";
import { ZEditTermSchema } from "./edit-term.schema";
import { ZGetSchema } from "./get.schema";
import { ZNewAttemptSchema } from "./new-attempt.schema";
import { ZRemoveTermImageSchema } from "./remove-term-image.schema";
import { ZReorderTermSchema } from "./reorder-term.schema";
import { ZSetTermImageSchema } from "./set-term-image.schema";
import { ZSubmitSchema } from "./submit.schema";
import { ZUploadTermImageCompleteSchema } from "./upload-term-image-complete.schema";
import { ZUploadTermImageSchema } from "./upload-term-image.schema";

type CollabRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    submit?: typeof import("./submit.handler").submitHandler;
    ["add-term"]?: typeof import("./add-term.handler").addTermHandler;
    ["edit-term"]?: typeof import("./edit-term.handler").editTermHandler;
    ["delete-term"]?: typeof import("./delete-term.handler").deleteTermHandler;
    ["reorder-term"]?: typeof import("./reorder-term.handler").reorderTermHandler;
    ["set-term-image"]?: typeof import("./set-term-image.handler").setTermImageHandler;
    ["remove-term-image"]?: typeof import("./remove-term-image.handler").removeTermImageHandler;
    ["upload-term-image"]?: typeof import("./upload-term-image.handler").uploadTermImageHandler;
    ["upload-term-image-complete"]?: typeof import("./upload-term-image-complete.handler").uploadTermImageCompleteHandler;
    ["new-attempt"]?: typeof import("./new-attempt.handler").newAttemptHandler;
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
  reorderTerm: protectedProcedure
    .input(ZReorderTermSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "reorder-term");
      return HANDLER_CACHE.handlers["reorder-term"]!({ ctx, input });
    }),
  setTermImage: protectedProcedure
    .input(ZSetTermImageSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-term-image");
      return HANDLER_CACHE.handlers["set-term-image"]!({ ctx, input });
    }),
  removeTermImage: protectedProcedure
    .input(ZRemoveTermImageSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "remove-term-image");
      return HANDLER_CACHE.handlers["remove-term-image"]!({ ctx, input });
    }),
  uploadTermImage: protectedProcedure
    .input(ZUploadTermImageSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "upload-term-image");
      return HANDLER_CACHE.handlers["upload-term-image"]!({ ctx, input });
    }),
  uploadTermImageComplete: protectedProcedure
    .input(ZUploadTermImageCompleteSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "upload-term-image-complete");
      return HANDLER_CACHE.handlers["upload-term-image-complete"]!({
        ctx,
        input,
      });
    }),
  newAttempt: protectedProcedure
    .input(ZNewAttemptSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "new-attempt");
      return HANDLER_CACHE.handlers["new-attempt"]!({ ctx, input });
    }),
});
