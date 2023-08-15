import { useSession } from "next-auth/react";

import { useOrganization } from "./use-organization";

export const useOrganizationMember = () => {
  const session = useSession();
  const { data: org } = useOrganization();

  return org
    ? org.members.find((m) => m.user.id === session.data!.user!.id)
    : null;
};
