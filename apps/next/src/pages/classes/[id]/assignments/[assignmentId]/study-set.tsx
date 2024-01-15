import { PageWrapper } from "../../../../../common/page-wrapper";
import { ClassLayout } from "../../../../../layouts/class-layout";
import { AssignmentStudySet } from "../../../../../modules/classes/pages/assignment-study-set";

const Page = () => {
  return (
    <ClassLayout hideNav>
      <AssignmentStudySet />
    </ClassLayout>
  );
};

Page.PageWrapper = PageWrapper;

export default Page;
