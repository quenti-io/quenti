import { OrganizationLayout } from "../../../modules/organizations/organization-layout";
import { OrganizationMembers } from "../../../modules/organizations/pages/organization-members";

const Page = () => {
  return <OrganizationMembers />;
};
Page.layout = OrganizationLayout;

export default Page;
