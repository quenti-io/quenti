import type { EnabledFeature } from "@quenti/trpc/server/common/constants";
import { useSession } from "next-auth/react";

export const useFeature = (feature: EnabledFeature) => {
  const { data: session, status } = useSession();

  if (status != "authenticated") return false;
  return (session.user!.flags & feature) == feature;
};
