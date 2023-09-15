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
  const options = [];
  options.push(`w_${opts.width}`);
  options.push(`h_${opts.height}`);
  options.push(`c_fill`);

  const response = `https://res.cloudinary.com/${
    env.CLOUDINARY_CLOUD
  }/image/fetch/${options.join(",")}/${encodeURIComponent(url)}`;

  return response;
};

export const isCloudinaryRequest = (req: Request) => {
  const userAgent = req.headers.get("User-Agent");
  return userAgent && userAgent.indexOf("Cloudinary") >= 0;
};
