import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/class-layout";
import { ClassMembers } from "../../../modules/classes/pages/class-members";

const Page = () => {
  return <ClassMembers />;
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
