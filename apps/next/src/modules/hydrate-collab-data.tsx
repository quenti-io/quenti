import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

export const HydrateCollabData = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error } = api.collab.get.useQuery(
    {
      studySetId: id,
    },
    {
      enabled: !!id,
    },
  );

  React.useEffect(() => {
    if (!error) return;

    if (error.data?.code == "NOT_FOUND") {
      void router.push(`/${id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return null;
};
