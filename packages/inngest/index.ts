import { env } from "@quenti/env/server";

import { collectOrganizationActivity } from "./functions/collect-organization-activity";
import { completeQuizletProfileImport } from "./functions/complete-quizlet-profile-import";
import { cortexClassifyClass } from "./functions/cortex-classify-class";
import { importQuizletProfile } from "./functions/import-quizlet-profile";
import { importQuizletProfileSet } from "./functions/import-quizlet-profile-set";
import { scheduleOrgDeletion } from "./functions/schedule-organization-deletion";
import { sendClassInviteEmails } from "./functions/send-class-invite-emails";
import { sendOrgInviteEmails } from "./functions/send-org-invite-emails";
import { sendOrgTeacherInviteEmails } from "./functions/send-org-teacher-invite-emails";

type BaseInviter = {
  id: string;
  image: string;
  name: string | null;
  email: string;
};

type OrgsInviteMembers = {
  data: {
    org: {
      id: string;
      name: string;
    };
    inviter: BaseInviter;
    signupEmails: string[];
    loginEmails: string[];
  };
};
type OrgInviteTeachers = {
  data: {
    org: {
      id: string;
      name: string;
    };
    inviter: BaseInviter;
    emails: string[];
  };
};
type OrgDelete = {
  data: {
    org: {
      id: string;
      name: string;
    };
    ownerEmails: string[];
  };
};
type ClassesInviteTeachers = {
  data: {
    class: {
      id: string;
      name: string;
    };
    inviter: BaseInviter;
    signupEmails: string[];
    loginEmails: string[];
  };
};

type CortexClassifyClass = {
  data: {
    classId: string;
    name: string;
  };
};

type IntegrationsQuizletImportProfile = {
  data: {
    userId: string;
    username: string;
  };
};
type IntegrationsQuizletImportProfileSet = {
  data: {
    url: string;
    userId: string;
    publishedTimestamp: number;
  };
};
type IntegrationsQuizletCompleteImportProfile = {
  data: {
    userId: string;
  };
};

export type Events = {
  "cortex/classify-class": CortexClassifyClass;
  "orgs/invite-members": OrgsInviteMembers;
  "orgs/invite-teachers": OrgInviteTeachers;
  "orgs/delete": OrgDelete;
  "classes/invite-teachers": ClassesInviteTeachers;
  "integrations/quizlet/import-profile": IntegrationsQuizletImportProfile;
  "integrations/quizlet/import-profile-set": IntegrationsQuizletImportProfileSet;
  "integrations/quizlet/complete-import-profile": IntegrationsQuizletCompleteImportProfile;
};

export * from "./inngest";
export const functions = [
  // Events
  sendOrgInviteEmails,
  sendOrgTeacherInviteEmails,
  scheduleOrgDeletion,
  sendClassInviteEmails,
  cortexClassifyClass,
  importQuizletProfile,
  importQuizletProfileSet,
  completeQuizletProfileImport,
  // Scheduled jobs
  env.ENABLE_CLICKHOUSE === "true" ? collectOrganizationActivity : [],
].flat();
