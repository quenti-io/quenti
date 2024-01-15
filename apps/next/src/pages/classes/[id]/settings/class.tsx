import { PageWrapper } from "../../../../common/page-wrapper";
import { getLayout } from "../../../../layouts/class-layout";
import { ClassSettings } from "../../../../modules/classes/pages/class-settings";

const Page = () => {
  return <ClassSettings />;
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
