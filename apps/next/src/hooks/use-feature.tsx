import { useSession } from "next-auth/react";

import type { EnabledFeature } from "@quenti/lib/feature";

export const useFeature = (feature: EnabledFeature) => {
  const { data: session, status } = useSession();

  if (status != "authenticated") return false;
  return (session.user!.flags & (feature as number)) == (feature as number);
};
