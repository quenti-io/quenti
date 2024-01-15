import { loadHandler } from "../../lib/load-handler";
import {
  createTRPCRouter,
  protectedProcedure,
  teacherProcedure,
} from "../../trpc";
import { ZAddEntitiesSchema } from "./add-entities.schema";
import { ZAddStudentsSchema } from "./add-students.schema";
import { ZBanStudentsSchema } from "./ban-students.schema";
import { ZBulkAddSectionsSchema } from "./bulk-add-sections.schema";
import { ZCreateJoinCodeSchema } from "./create-join-code.schema";
import { ZCreateSectionSchema } from "./create-section.schema";
import { ZCreateSchema } from "./create.schema";
import { ZDeleteSectionSchema } from "./delete-section.schema";
import { ZDeleteSchema } from "./delete.schema";
import { ZGetMembersSchema } from "./get-members.schema";
import { ZGetStudentsSchema } from "./get-students.schema";
import { ZGetSchema } from "./get.schema";
import { ZInviteTeachersSchema } from "./invite-teachers.schema";
import { ZJoinSchema } from "./join.schema";
import { ZLeaveSchema } from "./leave.schema";
import { ZRemoveEntitySchema } from "./remove-entity.schema";
import { ZRemoveMembersSchema } from "./remove-members.schema";
import { ZSetPreferencesSchema } from "./set-preferences.schema";
import { ZUpdateSectionSchema } from "./update-section.schema";
import { ZUpdateStudentsSchema } from "./update-students.schema";
import { ZUpdateSchema } from "./update.schema";
import { ZUploadLogoCompleteSchema } from "./upload-logo-complete.schema";
import { ZUploadLogoSchema } from "./upload-logo.schema";

type ClassesRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    ["get-belonging"]?: typeof import("./get-belonging.handler").getBelongingHandler;
    join?: typeof import("./join.handler").joinHandler;
    ["get-members"]?: typeof import("./get-members.handler").getMembersHandler;
    ["get-students"]?: typeof import("./get-students.handler").getStudentsHandler;
    create?: typeof import("./create.handler").createHandler;
    update?: typeof import("./update.handler").updateHandler;
    delete?: typeof import("./delete.handler").deleteHandler;
    leave?: typeof import("./leave.handler").leaveHandler;
    ["invite-teachers"]?: typeof import("./invite-teachers.handler").inviteTeachersHandler;
    ["add-students"]?: typeof import("./add-students.handler").addStudentsHandler;
    ["add-entities"]?: typeof import("./add-entities.handler").addEntitiesHandler;
    ["remove-entity"]?: typeof import("./remove-entity.handler").removeEntityHandler;
    ["bulk-add-sections"]?: typeof import("./bulk-add-sections.handler").bulkAddSectionsHandler;
    ["create-section"]?: typeof import("./create-section.handler").createSectionHandler;
    ["update-section"]?: typeof import("./update-section.handler").updateSectionHandler;
    ["delete-section"]?: typeof import("./delete-section.handler").deleteSectionHandler;
    ["create-join-code"]?: typeof import("./create-join-code.handler").createJoinCodeHandler;
    ["delete-join-code"]?: typeof import("./delete-join-code.handler").deleteJoinCodeHandler;
    ["remove-members"]?: typeof import("./remove-members.handler").removeMembersHandler;
    ["update-students"]?: typeof import("./update-students.handler").updateStudentsHandler;
    ["ban-students"]?: typeof import("./ban-students.handler").banStudentsHandler;
    ["upload-logo"]?: typeof import("./upload-logo.handler").uploadLogoHandler;
    ["upload-logo-complete"]?: typeof import("./upload-logo-complete.handler").uploadLogoCompleteHandler;
    ["set-preferences"]?: typeof import("./set-preferences.handler").setPreferencesHandler;
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
  getBelonging: protectedProcedure.query(async ({ ctx }) => {
    await loadHandler(HANDLER_CACHE, "get-belonging");
    return HANDLER_CACHE.handlers["get-belonging"]!({ ctx });
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
  getStudents: teacherProcedure
    .input(ZGetStudentsSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-students");
      return HANDLER_CACHE.handlers["get-students"]!({ ctx, input });
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
  leave: protectedProcedure
    .input(ZLeaveSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "leave");
      return HANDLER_CACHE.handlers.leave!({ ctx, input });
    }),
  inviteTeachers: teacherProcedure
    .input(ZInviteTeachersSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "invite-teachers");
      return HANDLER_CACHE.handlers["invite-teachers"]!({ ctx, input });
    }),
  addStudents: teacherProcedure
    .input(ZAddStudentsSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "add-students");
      return HANDLER_CACHE.handlers["add-students"]!({ ctx, input });
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
  updateSection: teacherProcedure
    .input(ZUpdateSectionSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "update-section");
      return HANDLER_CACHE.handlers["update-section"]!({ ctx, input });
    }),
  deleteSection: teacherProcedure
    .input(ZDeleteSectionSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "delete-section");
      return HANDLER_CACHE.handlers["delete-section"]!({ ctx, input });
    }),
  createJoinCode: teacherProcedure
    .input(ZCreateJoinCodeSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "create-join-code");
      return HANDLER_CACHE.handlers["create-join-code"]!({ ctx, input });
    }),
  deleteJoinCode: teacherProcedure
    .input(ZCreateJoinCodeSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "delete-join-code");
      return HANDLER_CACHE.handlers["delete-join-code"]!({ ctx, input });
    }),
  removeMembers: teacherProcedure
    .input(ZRemoveMembersSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "remove-members");
      return HANDLER_CACHE.handlers["remove-members"]!({ ctx, input });
    }),
  updateStudents: teacherProcedure
    .input(ZUpdateStudentsSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "update-students");
      return HANDLER_CACHE.handlers["update-students"]!({ ctx, input });
    }),
  banStudents: teacherProcedure
    .input(ZBanStudentsSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "ban-students");
      return HANDLER_CACHE.handlers["ban-students"]!({ ctx, input });
    }),
  uploadLogo: teacherProcedure
    .input(ZUploadLogoSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "upload-logo");
      return HANDLER_CACHE.handlers["upload-logo"]!({ ctx, input });
    }),
  uploadLogoComplete: teacherProcedure
    .input(ZUploadLogoCompleteSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "upload-logo-complete");
      return HANDLER_CACHE.handlers["upload-logo-complete"]!({ ctx, input });
    }),
  setPreferences: protectedProcedure
    .input(ZSetPreferencesSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-preferences");
      return HANDLER_CACHE.handlers["set-preferences"]!({ ctx, input });
    }),
});
