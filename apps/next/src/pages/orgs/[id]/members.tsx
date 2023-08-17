import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/organization-layout";
import { OrganizationMembers } from "../../../modules/organizations/pages/organization-members";

const Page = () => {
  return <OrganizationMembers />;
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
