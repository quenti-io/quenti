import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/organization-layout";
import { OrganizationDashboard } from "../../../modules/organizations/pages/organization-dashboard";

const Page = () => {
  return <OrganizationDashboard />;
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
