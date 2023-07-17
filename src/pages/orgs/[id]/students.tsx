import { OrganizationLayout } from "../../../modules/organizations/organization-layout";
import { OrganizationStudents } from "../../../modules/organizations/pages/organization-students";

const Page = () => {
  return <OrganizationStudents />;
};
Page.layout = OrganizationLayout;

export default Page;
