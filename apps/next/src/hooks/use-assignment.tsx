import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { api } from "@quenti/trpc";

export const useAssignment = () => {
  const router = useRouter();
  const session = useSession();
  const id = router.query.id as string;
  const assignmentId = router.query.assignmentId as string;

  return api.assignments.get.useQuery(
    { classId: id, id: assignmentId },
    {
      enabled: !!id && !!assignmentId && !!session.data?.user,
      refetchOnMount: false,
    },
  );
};
