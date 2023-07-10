import React from "react";
import { OrganizationContext } from "../modules/organizations/organization-layout";

export const useOrganization = () => React.useContext(OrganizationContext);
