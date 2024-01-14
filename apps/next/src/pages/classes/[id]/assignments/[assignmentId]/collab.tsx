import { PageWrapper } from "../../../../../common/page-wrapper";
import { ClassLayout } from "../../../../../layouts/class-layout";
import { AssignmentCollab } from "../../../../../modules/classes/pages/assignment-collab";

const Page = () => {
  return (
    <ClassLayout hideNav>
      <AssignmentCollab />
    </ClassLayout>
  );
};

Page.PageWrapper = PageWrapper;

export default Page;
