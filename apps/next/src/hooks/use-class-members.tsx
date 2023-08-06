import { api } from "@quenti/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const useClassMembers = () => {
  const router = useRouter();
  const session = useSession();
  const id = router.query.id as string;

  return api.classes.getMembers.useQuery(
    { id },
    {
      enabled: !!id && !!session.data?.user,
      retry: false,
    }
  );
};
