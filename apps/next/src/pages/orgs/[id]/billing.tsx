import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/organization-layout";
import { OrganizationBilling } from "../../../modules/organizations/pages/organization-billing";

const Page = () => {
  return <OrganizationBilling />;
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
