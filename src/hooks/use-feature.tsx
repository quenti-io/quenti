import { useSession } from "next-auth/react";
import type { EnabledFeature } from "../server/api/common/constants";

export const useFeature = (feature: EnabledFeature) => {
  const { data: session } = useSession();
  return (session!.user!.flags & feature) == feature;
};
