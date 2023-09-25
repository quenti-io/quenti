import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/organization-layout";
import { OrganizationTeachers } from "../../../modules/organizations/pages/organization-teachers";

const Page = () => {
  return <OrganizationTeachers />;
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
