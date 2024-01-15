import { useRouter } from "next/router";

import { PageWrapper } from "../../../../../common/page-wrapper";
import { ClassLayout } from "../../../../../layouts/class-layout";
import { DescriptionEditorStyles } from "../../../../../modules/classes/assignments/editor/description-editor-styles";
import { Assignment } from "../../../../../modules/classes/pages/assignment";

const Page = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <ClassLayout
      hideNav
      returnTo={{
        name: "Assignments",
        path: `/classes/${id}/assignments`,
      }}
    >
      <DescriptionEditorStyles />
      <Assignment />
    </ClassLayout>
  );
};

Page.PageWrapper = PageWrapper;

export default Page;
