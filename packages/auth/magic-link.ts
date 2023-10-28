import { sendMagicLinkEmail } from "@quenti/emails";

export const sendVerificationRequest = async (params: {
  identifier: string;
  url: string;
}) => {
  await sendMagicLinkEmail(params.identifier, params);
};
