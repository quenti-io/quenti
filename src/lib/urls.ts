import { env } from "../env/client.mjs";

export const getBaseDomain = () => {
  return env.NEXT_PUBLIC_BASE_URL.replace(/https?:\/\//, "");
};

export const getSafeRedirectUrl = (url: string) => {
  let safeUrl = url;

  if (!/^https?:\/\//.test(url)) {
    safeUrl = `${env.NEXT_PUBLIC_BASE_URL}/${url}`;
  }
  const parsed = new URL(safeUrl);

  if (new URL(env.NEXT_PUBLIC_BASE_URL).origin !== parsed.origin) {
    return env.NEXT_PUBLIC_BASE_URL;
  }

  return safeUrl;
};
