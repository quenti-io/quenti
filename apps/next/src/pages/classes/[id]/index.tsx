import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/class-layout";
import { ClassHome } from "../../../modules/classes/pages/class-home";

const Page = () => {
  return <ClassHome />;
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
