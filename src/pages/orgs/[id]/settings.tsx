import { OrganizationLayout } from "../../../modules/organizations/organization-layout";
import { OrganizationSettings } from "../../../modules/organizations/pages/organization-settings";

const Page = () => {
  return <OrganizationSettings />;
};

Page.layout = OrganizationLayout;
export default Page;
