import { loadHandler } from "../../lib/load-handler";
import {
  createTRPCRouter,
  protectedProcedure,
  teacherProcedure,
} from "../../trpc";
import { ZAddEntitiesSchema } from "./add-entities.schema";
import { ZBulkAddSectionsSchema } from "./bulk-add-sections.schema";
import { ZCreateSectionSchema } from "./create-section.schema";
import { ZCreateSchema } from "./create.schema";
import { ZDeleteSectionSchema } from "./delete-section.schema";
import { ZDeleteSchema } from "./delete.schema";
import { ZGetMembersSchema } from "./get-members.schema";
import { ZGetSchema } from "./get.schema";
import { ZInviteTeachersSchema } from "./invite-teachers.schema";
import { ZJoinSchema } from "./join.schema";
import { ZRemoveEntitySchema } from "./remove-entity.schema";
import { ZUpdateSchema } from "./update.schema";

type ClassesRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    join?: typeof import("./join.handler").joinHandler;
    ["get-members"]?: typeof import("./get-members.handler").getMembersHandler;
    create?: typeof import("./create.handler").createHandler;
    update?: typeof import("./update.handler").updateHandler;
    delete?: typeof import("./delete.handler").deleteHandler;
    ["invite-teachers"]?: typeof import("./invite-teachers.handler").inviteTeachersHandler;
    ["add-entities"]?: typeof import("./add-entities.handler").addEntitiesHandler;
    ["remove-entity"]?: typeof import("./remove-entity.handler").removeEntityHandler;
    ["bulk-add-sections"]?: typeof import("./bulk-add-sections.handler").bulkAddSectionsHandler;
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
  join: protectedProcedure
    .input(ZJoinSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "join");
      return HANDLER_CACHE.handlers.join!({ ctx, input });
    }),
  getMembers: teacherProcedure
    .input(ZGetMembersSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-members");
      return HANDLER_CACHE.handlers["get-members"]!({ ctx, input });
    }),
  create: teacherProcedure
    .input(ZCreateSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "create");
      return HANDLER_CACHE.handlers.create!({ ctx, input });
    }),
  update: teacherProcedure
    .input(ZUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "update");
      return HANDLER_CACHE.handlers.update!({ ctx, input });
    }),
  delete: teacherProcedure
    .input(ZDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "delete");
      return HANDLER_CACHE.handlers.delete!({ ctx, input });
    }),
  inviteTeachers: teacherProcedure
    .input(ZInviteTeachersSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "invite-teachers");
      return HANDLER_CACHE.handlers["invite-teachers"]!({ ctx, input });
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
  bulkAddSections: teacherProcedure
    .input(ZBulkAddSectionsSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "bulk-add-sections");
      return HANDLER_CACHE.handlers["bulk-add-sections"]!({ ctx, input });
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
