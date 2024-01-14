import { PageWrapper } from "../../../../../common/page-wrapper";
import { ClassLayout } from "../../../../../layouts/class-layout";
import { DescriptionEditorStyles } from "../../../../../modules/classes/assignments/editor/description-editor-styles";
import { AssignmentPublish } from "../../../../../modules/classes/pages/assignment-publish";

const Page = () => {
  return (
    <ClassLayout hideNav>
      <DescriptionEditorStyles />
      <AssignmentPublish />
    </ClassLayout>
  );
};

Page.PageWrapper = PageWrapper;

export default Page;
