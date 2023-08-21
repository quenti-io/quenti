import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZPostQuizletJobSchema } from "./post-quizlet-job.schema";

type ImportRouterHandlerCache = {
  handlers: {
    ["post-quizlet-job"]?: typeof import("./post-quizlet-job.handler").postQuizletJobHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: ImportRouterHandlerCache = {
  handlers: {},
  routerPath: "import",
};

export const importRouter = createTRPCRouter({
  postQuizletJob: protectedProcedure
    .input(ZPostQuizletJobSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "post-quizlet-job");
      return HANDLER_CACHE.handlers["post-quizlet-job"]!({ ctx, input });
    }),
});
