import { PageWrapper } from "../../../../common/page-wrapper";
import { getLayout } from "../../../../layouts/class-layout";
import { StudentSettings } from "../../../../modules/classes/pages/student-settings";

const Page = () => {
  return <StudentSettings />;
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
