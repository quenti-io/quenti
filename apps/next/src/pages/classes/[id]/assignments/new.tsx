import { PageWrapper } from "../../../../common/page-wrapper";
import { ClassLayout } from "../../../../layouts/class-layout";
import { NewAssignment } from "../../../../modules/classes/pages/new-assignment";

const Page = () => {
  return (
    <ClassLayout hideNav>
      <NewAssignment />
    </ClassLayout>
  );
};

Page.PageWrapper = PageWrapper;

export default Page;
