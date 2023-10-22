import { sendOrganizationInviteEmail } from "@quenti/emails";
import { env } from "@quenti/env/client";

import { inngest } from "../inngest";

export const sendOrgInviteEmails = inngest.createFunction(
  { id: "send-org-invite-emails" },
  { event: "orgs/invite-members" },
  async ({ event, step }) => {
    const sendSignupEmails = Promise.all(
      event.data.signupEmails.map((email) =>
        step.run(
          "Send organization invite signup email",
          async () =>
            await sendOrganizationInviteEmail(email, {
              orgName: event.data.org.name,
              inviter: event.data.inviter,
              // Onboarding fetches the pending invite so we can use the regular signup flow
              url: `${env.NEXT_PUBLIC_APP_URL}/auth/signup`,
            }),
        ),
      ),
    );

    const sendLoginEmails = Promise.all(
      event.data.loginEmails.map((email) =>
        step.run(
          "Send organization invite login email",
          async () =>
            await sendOrganizationInviteEmail(email, {
              orgName: event.data.org.name,
              inviter: event.data.inviter,
              url: `${env.NEXT_PUBLIC_APP_URL}/auth/login?callbackUrl=/orgs`,
            }),
        ),
      ),
    );

    await Promise.all([sendSignupEmails, sendLoginEmails]);
  },
);
