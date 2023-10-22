import { loadHandler } from "../../lib/load-handler";
import { createTRPCRouter, teacherProcedure } from "../../trpc";
import { ZAcceptInviteSchema } from "./accept-invite.schema";
import { ZAcceptTokenSchema } from "./accept-token.schema";
import { ZAddStudentDomainSchema } from "./add-student-domain.schema";
import { ZAddStudentSchema } from "./add-student.schema";
import { ZCreateInviteSchema } from "./create-invite.schema";
import { ZCreateSchema } from "./create.schema";
import { ZDeleteSchema } from "./delete.schema";
import { ZEditMemberRoleSchema } from "./edit-member-role.schema";
import { ZGetActivitySchema } from "./get-activity.schema";
import { ZGetClassStatisticsSchema } from "./get-class-statistics.schema";
import { ZGetClassesSchema } from "./get-classes.schema";
import { ZGetUserStatisticsSchema } from "./get-user-statistics.schema";
import { ZGetUsersSchema } from "./get-users.schema";
import { ZGetSchema } from "./get.schema";
import { ZInviteMemberSchema } from "./invite-member.schema";
import { ZInviteTeachersSchema } from "./invite-teachers.schema";
import { ZPublishSchema } from "./publish.schema";
import { ZRemoveMemberSchema } from "./remove-member.schema";
import { ZRemoveStudentDomainSchema } from "./remove-student-domain.schema";
import { ZRemoveUserSchema } from "./remove-user.schema";
import { ZResendCodeSchema } from "./resend-code.schema";
import { ZSetDomainFilterSchema } from "./set-domain-filter.schema";
import { ZSetInviteExpirationSchema } from "./set-invite-expiration.schema";
import { ZSetMemberMetadataSchema } from "./set-member-metadata.schema";
import { ZUpdateSchema } from "./update.schema";
import { ZUploadLogoCompleteSchema } from "./upload-logo-complete.schema";
import { ZUploadLogoSchema } from "./upload-logo.schema";
import { ZVerifyStudentDomainSchema } from "./verify-student-domain.schema";

type OrganizationsRouterHandlerCache = {
  handlers: {
    get?: typeof import("./get.handler").getHandler;
    ["get-activity"]?: typeof import("./get-activity.handler").getActivityHandler;
    ["get-user-statistics"]?: typeof import("./get-user-statistics.handler").getUserStatisticsHandler;
    ["get-class-statistics"]?: typeof import("./get-class-statistics.handler").getClassStatisticsHandler;
    ["get-classes"]?: typeof import("./get-classes.handler").getClassesHandler;
    ["get-users"]?: typeof import("./get-users.handler").getStudentsHandler;
    create?: typeof import("./create.handler").createHandler;
    update?: typeof import("./update.handler").updateHandler;
    publish?: typeof import("./publish.handler").publishHandler;
    delete?: typeof import("./delete.handler").deleteHandler;
    ["upload-logo"]?: typeof import("./upload-logo.handler").uploadLogoHandler;
    ["upload-logo-complete"]?: typeof import("./upload-logo-complete.handler").uploadLogoCompleteHandler;
    ["invite-member"]?: typeof import("./invite-member.handler").inviteMemberHandler;
    ["invite-teachers"]?: typeof import("./invite-teachers.handler").inviteTeachersHandler;
    ["create-invite"]?: typeof import("./create-invite.handler").createInviteHandler;
    ["set-invite-expiration"]?: typeof import("./set-invite-expiration.handler").setInviteExpirationHandler;
    ["accept-token"]?: typeof import("./accept-token.handler").acceptTokenHandler;
    ["accept-invite"]?: typeof import("./accept-invite.handler").acceptInviteHandler;
    ["edit-member-role"]?: typeof import("./edit-member-role.handler").editMemberRoleHandler;
    ["remove-member"]?: typeof import("./remove-member.handler").removeMemberHandler;
    ["remove-user"]?: typeof import("./remove-user.handler").removeUserHandler;
    ["add-student-domain"]?: typeof import("./add-student-domain.handler").addStudentDomainHandler;
    ["verify-student-domain"]?: typeof import("./verify-student-domain.handler").verifyStudentDomainHandler;
    ["remove-student-domain"]?: typeof import("./remove-student-domain.handler").removeStudentDomainHandler;
    ["set-domain-filter"]?: typeof import("./set-domain-filter.handler").setDomainFilterHandler;
    ["resend-code"]?: typeof import("./resend-code.handler").resendCodeHandler;
    ["add-student"]?: typeof import("./add-student.handler").addStudentHandler;
    ["set-member-metadata"]?: typeof import("./set-member-metadata.handler").setMemberMetadataHandler;
  };
} & { routerPath: string };

const HANDLER_CACHE: OrganizationsRouterHandlerCache = {
  handlers: {},
  routerPath: "organizations",
};

export const organizationsRouter = createTRPCRouter({
  get: teacherProcedure.input(ZGetSchema).query(async ({ ctx, input }) => {
    await loadHandler(HANDLER_CACHE, "get");
    return HANDLER_CACHE.handlers["get"]!({ ctx, input });
  }),
  getActivity: teacherProcedure
    .input(ZGetActivitySchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-activity");
      return HANDLER_CACHE.handlers["get-activity"]!({ ctx, input });
    }),
  getUserStatistics: teacherProcedure
    .input(ZGetUserStatisticsSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-user-statistics");
      return HANDLER_CACHE.handlers["get-user-statistics"]!({ ctx, input });
    }),
  getClassStatistics: teacherProcedure
    .input(ZGetClassStatisticsSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-class-statistics");
      return HANDLER_CACHE.handlers["get-class-statistics"]!({ ctx, input });
    }),
  getClasses: teacherProcedure
    .input(ZGetClassesSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-classes");
      return HANDLER_CACHE.handlers["get-classes"]!({ ctx, input });
    }),
  getUsers: teacherProcedure
    .input(ZGetUsersSchema)
    .query(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "get-users");
      return HANDLER_CACHE.handlers["get-users"]!({ ctx, input });
    }),
  create: teacherProcedure
    .input(ZCreateSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "create");
      return HANDLER_CACHE.handlers["create"]!({ ctx, input });
    }),
  update: teacherProcedure
    .input(ZUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "update");
      return HANDLER_CACHE.handlers["update"]!({ ctx, input });
    }),
  publish: teacherProcedure
    .input(ZPublishSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "publish");
      return HANDLER_CACHE.handlers["publish"]!({ ctx, input });
    }),
  delete: teacherProcedure
    .input(ZDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "delete");
      return HANDLER_CACHE.handlers["delete"]!({ ctx, input });
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
  inviteMember: teacherProcedure
    .input(ZInviteMemberSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "invite-member");
      return HANDLER_CACHE.handlers["invite-member"]!({ ctx, input });
    }),
  inviteTeachers: teacherProcedure
    .input(ZInviteTeachersSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "invite-teachers");
      return HANDLER_CACHE.handlers["invite-teachers"]!({ ctx, input });
    }),
  createInvite: teacherProcedure
    .input(ZCreateInviteSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "create-invite");
      return HANDLER_CACHE.handlers["create-invite"]!({ ctx, input });
    }),
  setInviteExpiration: teacherProcedure
    .input(ZSetInviteExpirationSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-invite-expiration");
      return HANDLER_CACHE.handlers["set-invite-expiration"]!({ ctx, input });
    }),
  acceptToken: teacherProcedure
    .input(ZAcceptTokenSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "accept-token");
      return HANDLER_CACHE.handlers["accept-token"]!({ ctx, input });
    }),
  acceptInvite: teacherProcedure
    .input(ZAcceptInviteSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "accept-invite");
      return HANDLER_CACHE.handlers["accept-invite"]!({ ctx, input });
    }),
  editMemberRole: teacherProcedure
    .input(ZEditMemberRoleSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "edit-member-role");
      return HANDLER_CACHE.handlers["edit-member-role"]!({ ctx, input });
    }),
  removeMember: teacherProcedure
    .input(ZRemoveMemberSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "remove-member");
      return HANDLER_CACHE.handlers["remove-member"]!({ ctx, input });
    }),
  removeUser: teacherProcedure
    .input(ZRemoveUserSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "remove-user");
      return HANDLER_CACHE.handlers["remove-user"]!({ ctx, input });
    }),
  addStudentDomain: teacherProcedure
    .input(ZAddStudentDomainSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "add-student-domain");
      return HANDLER_CACHE.handlers["add-student-domain"]!({ ctx, input });
    }),
  verifyStudentDomain: teacherProcedure
    .input(ZVerifyStudentDomainSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "verify-student-domain");
      return HANDLER_CACHE.handlers["verify-student-domain"]!({ ctx, input });
    }),
  removeStudentDomain: teacherProcedure
    .input(ZRemoveStudentDomainSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "remove-student-domain");
      return HANDLER_CACHE.handlers["remove-student-domain"]!({ ctx, input });
    }),
  setDomainFilter: teacherProcedure
    .input(ZSetDomainFilterSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-domain-filter");
      return HANDLER_CACHE.handlers["set-domain-filter"]!({ ctx, input });
    }),
  resendCode: teacherProcedure
    .input(ZResendCodeSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "resend-code");
      return HANDLER_CACHE.handlers["resend-code"]!({ ctx, input });
    }),
  addStudent: teacherProcedure
    .input(ZAddStudentSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "add-student");
      return HANDLER_CACHE.handlers["add-student"]!({ ctx, input });
    }),
  setMemberMetadata: teacherProcedure
    .input(ZSetMemberMetadataSchema)
    .mutation(async ({ ctx, input }) => {
      await loadHandler(HANDLER_CACHE, "set-member-metadata");
      return HANDLER_CACHE.handlers["set-member-metadata"]!({ ctx, input });
    }),
});
