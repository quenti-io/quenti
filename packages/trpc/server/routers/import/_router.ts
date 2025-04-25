import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZFromUrlSchema } from "./from-url.schema";
import { ZFromFileSchema } from "./from-file.schema";
import { fromFileHandler } from "./from-file.handler";

type ImportRouterHandlerCache = {
  handlers: {
    ["from-url"]?: typeof import("./from-url.handler").fromUrlHandler;
    ["from-file"]?: typeof fromFileHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: ImportRouterHandlerCache = {
  handlers: {},
  routerPath: "import",
};

export const importRouter = createTRPCRouter({
  fromUrl: protectedProcedure
    .input(ZFromUrlSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "from-url");
      return HANDLER_CACHE.handlers["from-url"]!({ ctx, input });
    }),

    fromFile: protectedProcedure
    .input(ZFromFileSchema)        // ← aqui usamos ZFromFileSchema
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "from-file");
      return HANDLER_CACHE.handlers["from-file"]!({ ctx, input });
    }),
});
