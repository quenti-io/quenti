import type { Env } from ".";

interface ResizeOptions {
  width: number;
  height: number;
}

export const resizeToDimension = (
  url: string,
  env: Env,
  opts: ResizeOptions,
): string => {
  const param = url.includes("?") ? "&" : "?";
  const response = `https://${env.TWIC_DOMAIN}/${url}${param}twic=v1/cover=${opts.width}x${opts.height}`;

  return response;
};

export const isCloudinaryRequest = (req: Request) => {
  const userAgent = req.headers.get("User-Agent");
  return userAgent && userAgent.indexOf("Cloudinary") >= 0;
};
