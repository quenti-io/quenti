import { orgMembershipMetadata } from "@quenti/prisma/zod-schemas";

import { useOrganizationMember } from "../../../hooks/use-organization-member";

export const useOnboardingStep = () => {
  const me = useOrganizationMember();
  const schema = me?.metadata
    ? orgMembershipMetadata.safeParse(me.metadata)
    : null;
  return schema?.success ? schema.data.onboardingStep : null;
};
