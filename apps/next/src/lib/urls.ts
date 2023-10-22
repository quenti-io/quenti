import { APP_URL, WEBSITE_URL } from "@quenti/lib/constants/url";

export const getBaseDomain = () => {
  return APP_URL.replace(/https?:\/\//, "");
};

/**
 * Returns a safe callback URL.
 * @param url url or path to redirect to, default to app origin if scheme is not defined
 */
export const getSafeRedirectUrl = (url: string) => {
  let safeUrl = url;

  if (!/^https?:\/\//.test(url)) {
    safeUrl = `${APP_URL}/${url}`.replace(/([^:])(\/\/+)/g, "$1/");
  }
  const parsed = new URL(safeUrl);

  if (
    ![WEBSITE_URL, APP_URL].some((u) => new URL(u).origin === parsed.origin)
  ) {
    return `${APP_URL}/`;
  }

  return safeUrl;
};
