import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/organization-layout";
import { OrganizationSettings } from "../../../modules/organizations/pages/organization-settings";

const Page = () => {
  return <OrganizationSettings />;
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
