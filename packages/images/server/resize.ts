import { env } from "@quenti/env/server";

export interface ResizeOptions {
  width: number;
  height: number;
  fit: "cover" | "contain" | "fill" | "inside" | "outside";
  dpr: number;
}

export const getResizedUrl = (
  assetUrl: string,
  options: Partial<ResizeOptions>,
) => {
  if (!env.ASSETS_BUCKET_URL) return assetUrl;

  let params = "";
  for (const [key, value] of Object.entries(options)) {
    params += `${key}=${value},`;
  }
  params = params.slice(0, -1);

  return `${env.ASSETS_BUCKET_URL}/cdn-cgi/image/${params}/${assetUrl}`;
};
