import { useRouter } from "next/router";

import { PageWrapper } from "../../../../common/page-wrapper";
import { ClassLayout } from "../../../../layouts/class-layout";
import { NewAssignment } from "../../../../modules/classes/pages/new-assignment";

const Page = () => {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <ClassLayout
      returnTo={{
        path: `/classes/${id}/assignments`,
        name: "Assignments",
      }}
    >
      <NewAssignment />
    </ClassLayout>
  );
};

Page.PageWrapper = PageWrapper;

export default Page;
