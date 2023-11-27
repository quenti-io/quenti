import { env } from "@quenti/env/client";

const transform = (url: string, transform: string) => {
  const v = url.includes("?") ? "&" : "?";
  return `${env.NEXT_PUBLIC_CGI_ENDPOINT}/${url}${v}twic=v1/${transform}`;
};

export const square = ({ src, width }: { src: string; width: number }) => {
  if (!env.NEXT_PUBLIC_CGI_ENDPOINT) return src;
  return transform(src, `cover=${width}x${width}`);
};

export const resize = ({ src, width }: { src: string; width: number }) => {
  if (!env.NEXT_PUBLIC_CGI_ENDPOINT || src.includes("unsplash.com")) return src;
  return transform(src, `resize=${width}`);
};
