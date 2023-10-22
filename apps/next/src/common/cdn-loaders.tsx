import { env } from "@quenti/env/client";

export const squareCdnLoader = ({
  src,
  width,
}: {
  src: string;
  width: number;
}) => {
  return `${env.NEXT_PUBLIC_CDN_WORKER_ENDPOINT}/image/${src}&w=${width}&h=${width}`;
};
