import { collectOrganizationActivity } from "./functions/collect-organization-activity";
import { cortexClassifyClass } from "./functions/cortex-classify-class";
import { sendClassInviteEmails } from "./functions/send-class-invite-emails";
import { sendOrgInviteEmails } from "./functions/send-org-invite-emails";

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
  "classes/invite-teachers": ClassesInviteTeachers;
};

export * from "./inngest";
export const functions = [
  // Events
  sendOrgInviteEmails,
  sendClassInviteEmails,
  cortexClassifyClass,
  // Scheduled jobs
  collectOrganizationActivity,
];
