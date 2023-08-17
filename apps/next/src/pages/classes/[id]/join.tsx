import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import { PageWrapper } from "../../../common/page-wrapper";
import { Loading } from "../../../components/loading";
import { getLayout } from "../../../layouts/main-layout";

export default function JoinClass() {
  const router = useRouter();
  const id = router.query.id as string;

  const join = api.classes.join.useMutation({
    onSuccess: async () => {
      await router.push(`/classes/${id}`);
    },
  });

  React.useEffect(() => {
    if (!router.isReady) return;
    join.mutate({
      id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return <Loading />;
}

JoinClass.PageWrapper = PageWrapper;
JoinClass.getLayout = getLayout;
