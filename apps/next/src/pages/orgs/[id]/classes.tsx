import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/organization-layout";
import { OrganizationClasses } from "../../../modules/organizations/pages/organization-classes";

const Page = () => {
  return <OrganizationClasses />;
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
