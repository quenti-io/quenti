import type { RouterOutputs } from "@quenti/trpc";

export const getBaseDomain = (
  org: RouterOutputs["organizations"]["get"] | undefined
) => {
  return (
    org?.domains.find((domain) => domain.type == "Base")?.requestedDomain || ""
  );
};
