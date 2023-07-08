import { env } from "../env/client.mjs";

export const getBaseDomain = () => {
  return env.NEXT_PUBLIC_BASE_URL.replace(/https?:\/\//, "");
};
