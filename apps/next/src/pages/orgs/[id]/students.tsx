import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/organization-layout";
import { OrganizationStudents } from "../../../modules/organizations/pages/organization-students";

const Page = () => {
  return <OrganizationStudents />;
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
