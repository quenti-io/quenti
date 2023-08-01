import { OrganizationLayout } from "../../../modules/organizations/organization-layout";
import { OrganizationBilling } from "../../../modules/organizations/pages/organization-billing"

const Page = () => {
  return <OrganizationBilling />;
}
Page.layout = OrganizationLayout;

export default Page;
