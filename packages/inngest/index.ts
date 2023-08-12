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

export type Events = {
  "orgs/invite-members": OrgsInviteMembers;
  "classes/invite-teachers": ClassesInviteTeachers;
};

export * from "./inngest";
export const functions = [sendOrgInviteEmails, sendClassInviteEmails];
