import crypto from "crypto";
import generator from "otp-generator";
import { env } from "../../env/server.mjs";

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
    .createHmac("sha256", env.NEXTAUTH_SECRET!)
    .update(data)
    .digest("hex");

  return { hash: `${base}.${expires}`, otp };
};

export const verifyOtp = (email: string, otp: string, hash: string) => {
  if (!hash.match(".")) return false;

  const [base, expires] = hash.split(".");
  if (!base || !expires) return false;

  if (Date.now() > parseInt(expires)) return false;

  const data = `${email}.${otp}.${expires}`;
  const newHash = crypto
    .createHmac("sha256", env.NEXTAUTH_SECRET!)
    .update(data)
    .digest("hex");

  return newHash === base;
};
