import { env } from "@quenti/env/server";

import { collectOrganizationActivity } from "./functions/collect-organization-activity";
import { cortexClassifyClass } from "./functions/cortex-classify-class";
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

export type Events = {
  "cortex/classify-class": CortexClassifyClass;
  "orgs/invite-members": OrgsInviteMembers;
  "orgs/invite-teachers": OrgInviteTeachers;
  "orgs/delete": OrgDelete;
  "classes/invite-teachers": ClassesInviteTeachers;
};

export * from "./inngest";
export const functions = [
  // Events
  sendOrgInviteEmails,
  sendOrgTeacherInviteEmails,
  scheduleOrgDeletion,
  sendClassInviteEmails,
  cortexClassifyClass,
  // Scheduled jobs
  env.ENABLE_CLICKHOUSE === "true" ? collectOrganizationActivity : [],
].flat();
