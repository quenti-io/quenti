import crypto from "crypto";
import generator from "otp-generator";

import { env } from "@quenti/env/server";

export const genOtp = (email: string, expiresInMinutes = 5) => {
  const ttl = expiresInMinutes * 60 * 1000;
  const expires = Date.now() + ttl;

  const otp = generator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const data = `${email}.${otp}.${expires}`;
  const base = crypto
    .createHmac("sha256", env.QUENTI_ENCRYPTION_KEY)
    .update(data)
    .digest("hex");

  return { hash: `${base}.${expires}`, otp };
};

type VerifyResult = {
  success: boolean;
  expired?: boolean;
};

export const verifyOtp = (
  email: string,
  otp: string,
  hash: string,
): VerifyResult => {
  if (!hash.match("."))
    return {
      success: false,
    };

  const [base, expires] = hash.split(".");
  if (!base || !expires)
    return {
      success: false,
    };

  if (Date.now() > parseInt(expires))
    return {
      success: false,
      expired: true,
    };

  const data = `${email}.${otp}.${expires}`;
  const newHash = crypto
    .createHmac("sha256", env.QUENTI_ENCRYPTION_KEY)
    .update(data)
    .digest("hex");

  return { success: newHash === base, expired: false };
};
