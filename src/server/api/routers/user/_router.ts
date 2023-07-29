import { loadHandler } from "../../../lib/load-handler";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { ZChangeUsernameSchema } from "./change-username.schema";
import { ZCheckUsernameSchema } from "./check-username.schema";
import { ZSetDisplayNameSchema } from "./set-display-name.schema";
import { ZSetEnableUsageDataSchema } from "./set-enable-usage-data.schema";

type UserRouterHandlerCache = {
  handlers: {
    me?: typeof import("./me.handler").meHandler;
    ["change-username"]?: typeof import("./change-username.handler").changeUsernameHandler;
    ["check-username"]?: typeof import("./check-username.handler").checkUsernameHandler;
    ["set-display-name"]?: typeof import("./set-display-name.handler").setDisplayNameHandler;
    ["view-changelog"]?: typeof import("./view-changelog.handler").viewChangelogHandler;
    ["set-enable-usage-data"]?: typeof import("./set-enable-usage-data.handler").setEnableUsageDataHandler;
    ["delete-account"]?: typeof import("./delete-account.handler").deleteAccountHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: UserRouterHandlerCache = {
  handlers: {},
  routerPath: "user",
};

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    await loadHandler(HANDLER_CACHE, "me");
    return HANDLER_CACHE.handlers.me!({ ctx });
  }),
  checkUsername: protectedProcedure
    .input(ZCheckUsernameSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "check-username");
      return HANDLER_CACHE.handlers["check-username"]!({ ctx, input });
    }),
  changeUsername: protectedProcedure
    .input(ZChangeUsernameSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "change-username");
      return HANDLER_CACHE.handlers["change-username"]!({ ctx, input });
    }),
  setDisplayName: protectedProcedure
    .input(ZSetDisplayNameSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-display-name");
      return HANDLER_CACHE.handlers["set-display-name"]!({ ctx, input });
    }),
  viewChangelog: protectedProcedure.mutation(async ({ ctx }) => {
    await loadHandler(HANDLER_CACHE, "view-changelog");
    return HANDLER_CACHE.handlers["view-changelog"]!({ ctx });
  }),
  setEnableUsageData: protectedProcedure
    .input(ZSetEnableUsageDataSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-enable-usage-data");
      return HANDLER_CACHE.handlers["set-enable-usage-data"]!({ ctx, input });
    }),
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await loadHandler(HANDLER_CACHE, "delete-account");
    return HANDLER_CACHE.handlers["delete-account"]!({ ctx });
  }),
});
