import { loadHandler } from "../../../lib/load-handler";
import { adminProcedure, createTRPCRouter } from "../../trpc";
import { ZAddRegexSchema } from "./add-regex.schema";
import { ZAllowFailedLoginSchema } from "./allow-failed-login.schema";
import { ZBanUserSchema } from "./ban-user.schema";
import { ZEditRegexSchema } from "./edit-regex.schema";
import { ZRemoveRegexSchema } from "./remove-regex.schema";
import { ZSetEnabledFlagsSchema } from "./set-enabled-flags.schema";
import { ZVerifyUserSchema } from "./verify-user.schema";
import { ZWhitelistEmailSchema } from "./whitelist-email.schema";

type AdminRouterHandlerCache = {
  handlers: {
    ["landing"]?: typeof import("./landing.handler").landingHandler;
    ["get-users"]?: typeof import("./get-users.handler").getUsersHandler;
    ["get-whitelist"]?: typeof import("./get-whitelist.handler").getWhitelistHandler;
    ["verify-user"]?: typeof import("./verify-user.handler").verifyUserHandler;
    ["ban-user"]?: typeof import("./ban-user.handler").banUserHandler;
    ["set-enabled-flags"]?: typeof import("./set-enabled-flags.handler").setEnabledFlagsHandler;
    ["allow-failed-login"]?: typeof import("./allow-failed-login.handler").allowFailedLoginHandler;
    ["whitelist-email"]?: typeof import("./whitelist-email.handler").whitelistEmailHandler;
    ["add-regex"]?: typeof import("./add-regex.handler").addRegexHandler;
    ["edit-regex"]?: typeof import("./edit-regex.handler").editRegexHandler;
    ["remove-regex"]?: typeof import("./remove-regex.handler").removeRegexHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: AdminRouterHandlerCache = {
  handlers: {},
  routerPath: "admin",
};

export const adminRouter = createTRPCRouter({
  landing: adminProcedure.query(async ({ ctx }) => {
    await loadHandler(HANDLER_CACHE, "landing");
    return HANDLER_CACHE.handlers["landing"]!({ ctx });
  }),
  getUsers: adminProcedure.query(async ({ ctx }) => {
    await loadHandler(HANDLER_CACHE, "get-users");
    return HANDLER_CACHE.handlers["get-users"]!({ ctx });
  }),
  getWhitelist: adminProcedure.query(async ({ ctx }) => {
    await loadHandler(HANDLER_CACHE, "get-whitelist");
    return HANDLER_CACHE.handlers["get-whitelist"]!({ ctx });
  }),
  verifyUser: adminProcedure
    .input(ZVerifyUserSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "verify-user");
      return HANDLER_CACHE.handlers["verify-user"]!({ ctx, input });
    }),
  banUser: adminProcedure
    .input(ZBanUserSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "ban-user");
      return HANDLER_CACHE.handlers["ban-user"]!({ ctx, input });
    }),
  setEnabledFlags: adminProcedure
    .input(ZSetEnabledFlagsSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-enabled-flags");
      return HANDLER_CACHE.handlers["set-enabled-flags"]!({ ctx, input });
    }),
  allowFailedLogin: adminProcedure
    .input(ZAllowFailedLoginSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "allow-failed-login");
      return HANDLER_CACHE.handlers["allow-failed-login"]!({ ctx, input });
    }),
  whitelistEmail: adminProcedure
    .input(ZWhitelistEmailSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "whitelist-email");
      return HANDLER_CACHE.handlers["whitelist-email"]!({ ctx, input });
    }),
  addRegex: adminProcedure
    .input(ZAddRegexSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "add-regex");
      return HANDLER_CACHE.handlers["add-regex"]!({ ctx, input });
    }),
  editRegex: adminProcedure
    .input(ZEditRegexSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "edit-regex");
      return HANDLER_CACHE.handlers["edit-regex"]!({ ctx, input });
    }),
  removeRegex: adminProcedure
    .input(ZRemoveRegexSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "remove-regex");
      return HANDLER_CACHE.handlers["remove-regex"]!({ ctx, input });
    }),
});
