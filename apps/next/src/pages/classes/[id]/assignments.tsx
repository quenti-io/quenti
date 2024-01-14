import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/class-layout";
import { ClassAssignments } from "../../../modules/classes/pages/class-assignments";

const Page = () => {
  return <ClassAssignments />;
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
