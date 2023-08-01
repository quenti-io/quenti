import React from "react";
import { OrganizationContext } from "../modules/organizations/organization-layout";
import { useSession } from "next-auth/react";

export const useOrganization = () => {
  const session = useSession();
  const org = React.useContext(OrganizationContext);

  if (!session.data?.user) return null;
  return org;
};
