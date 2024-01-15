import { useRouter } from "next/router";

import { PageWrapper } from "../../../../../common/page-wrapper";
import { ClassLayout } from "../../../../../layouts/class-layout";
import { EditAssignment } from "../../../../../modules/classes/pages/edit-assignment";

const Page = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const assignmentId = router.query.assignmentId as string;

  return (
    <ClassLayout
      hideNav
      returnTo={{
        name: "Back",
        path: `/a/${id}/${assignmentId}`,
      }}
    >
      <EditAssignment />
    </ClassLayout>
  );
};

Page.PageWrapper = PageWrapper;

export default Page;
