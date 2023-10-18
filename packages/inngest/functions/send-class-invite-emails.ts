import { sendClassInviteEmail } from "@quenti/emails";
import { env } from "@quenti/env/client";

import { inngest } from "../inngest";

export const sendClassInviteEmails = inngest.createFunction(
  { id: "send-class-invite-emails" },
  { event: "classes/invite-teachers" },
  async ({ event, step }) => {
    const sendSignupEmails = Promise.all(
      event.data.signupEmails.map((email) =>
        step.run(
          "Send class invite signup email",
          async () =>
            await sendClassInviteEmail(email, {
              className: event.data.class.name,
              inviter: event.data.inviter,
              url: `${env.NEXT_PUBLIC_APP_URL}/auth/signup?callbackUrl=/classes/${event.data.class.id}/join`,
            }),
        ),
      ),
    );

    const sendLoginEmails = Promise.all(
      event.data.loginEmails.map((email) =>
        step.run(
          "Send class invite login email",
          async () =>
            await sendClassInviteEmail(email, {
              className: event.data.class.name,
              inviter: event.data.inviter,
              url: `${env.NEXT_PUBLIC_APP_URL}/auth/login?callbackUrl=/classes/${event.data.class.id}/join`,
            }),
        ),
      ),
    );

    await Promise.all([sendSignupEmails, sendLoginEmails]);
  },
);
