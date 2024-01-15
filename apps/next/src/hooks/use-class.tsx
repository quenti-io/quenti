import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { api } from "@quenti/trpc";

interface UseClassOptions {
  refetchOnMount?: boolean;
}

export const useClass = (opts?: UseClassOptions) => {
  const router = useRouter();
  const session = useSession();
  const id = router.query.id as string;

  return api.classes.get.useQuery(
    { id },
    {
      enabled: !!id && !!session.data?.user,
      refetchOnMount: opts?.refetchOnMount ?? false,
    },
  );
};
