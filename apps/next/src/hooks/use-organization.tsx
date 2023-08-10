import { api } from "@quenti/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const useOrganization = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const session = useSession();

  return api.organizations.get.useQuery(
    { id },
    {
      enabled: !!id && !!session.data?.user,
      retry: false,
      refetchOnMount: false,
    }
  );
};
