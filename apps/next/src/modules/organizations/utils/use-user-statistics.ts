import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { api } from "@quenti/trpc";

export const useUserStatistics = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const session = useSession();

  const { data } = api.organizations.getUserStatistics.useQuery(
    { id },
    {
      enabled: !!id && !!session.data?.user,
    },
  );

  const consolodiate = (input: NonNullable<typeof data>) => {
    let students = 0;
    let teachers = 0;

    input.forEach((r) => {
      if (r.type === "Student") {
        students += r.count;
      } else {
        teachers += r.count;
      }
    });

    return { students, teachers, isLoaded: true };
  };

  return data
    ? consolodiate(data)
    : { students: 0, teachers: 0, isLoaded: false };
};
