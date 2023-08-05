import { env } from "@quenti/env/server";
import { Resend } from "resend";
import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";

import ClasssInviteEmail, {
  type ClassInviteEmailProps,
} from "./templates/class-invite";
import ConfirmCodeEmail, {
  type ConfirmCodeEmailProps,
} from "./templates/confirm-code";
import OrganizationInviteEmail, {
  type OrganizationInviteEmailProps,
} from "./templates/organization-invite";

const NOTIFICATIONS_SENDER = `Quenti <notifications@${env.EMAIL_SENDER || ""}>`;

const to = (email: string | string[]) => {
  if (env.USE_RESEND_PREVIEWS) return "delivered@resend.dev";
  return email;
};

export const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

export const sendEmail = async (opts: CreateEmailOptions) => {
  if (!resend) {
    console.warn("Resend not configured, skipping email send", opts);
    return;
  }
  await resend.sendEmail({ ...opts, to: to(opts.to) });
};

export const sendClassInviteEmail = async (
  email: string,
  opts: ClassInviteEmailProps
) => {
  await sendEmail({
    from: NOTIFICATIONS_SENDER,
    to: email,
    subject: `${opts.inviter.name ?? opts.inviter.email} invited you to join ${
      opts.className
    } on Quenti`,
    react: ClasssInviteEmail(opts),
  });
};

export const sendOrganizationInviteEmail = async (
  email: string,
  opts: OrganizationInviteEmailProps
) => {
  await sendEmail({
    from: NOTIFICATIONS_SENDER,
    to: email,
    subject: `${opts.inviter.name ?? opts.inviter.email} invited you to join ${
      opts.orgName
    } on Quenti`,
    react: OrganizationInviteEmail(opts),
  });
};

export const sendConfirmCodeEmail = async (
  email: string,
  opts: ConfirmCodeEmailProps
) => {
  await sendEmail({
    from: NOTIFICATIONS_SENDER,
    to: email,
    subject: `Verify ${opts.orgName}`,
    react: ConfirmCodeEmail(opts),
  });
};