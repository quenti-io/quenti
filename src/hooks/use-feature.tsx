import type { EnabledFeature } from "@prisma/client";
import { useSession } from "next-auth/react";

export const useFeature = (feature: EnabledFeature) => {
  const { data: session } = useSession();
  return session?.user?.features.includes(feature);
};
