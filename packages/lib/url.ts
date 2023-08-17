import type { Router } from "next/router";

export const canonicalUrl = ({
  origin,
  path,
}: {
  origin: Location["origin"];
  path: Router["asPath"];
}) => {
  return `${origin}${path === "/" ? "" : path}`.split("?")[0];
};
