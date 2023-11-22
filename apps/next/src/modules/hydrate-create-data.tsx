import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import { useLoading } from "../hooks/use-loading";
import { EditorContextLayer } from "./editor/editor-context-layer";
import { EditorLoading } from "./editor/editor-loading";

export const HydrateCreateData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const id = router.query.id as string | undefined;

  const { data, error } = api.studySets.getAutosave.useQuery(
    { id },
    {
      staleTime: 0,
      cacheTime: 0,
    },
  );

  React.useEffect(() => {
    if (error && error.data?.httpStatus == 404) {
      void router.push("/create");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const { loading } = useLoading();
  if (loading || !data) return <EditorLoading mode="create" />;

  return (
    <EditorContextLayer data={data} mode="create">
      {children}
    </EditorContextLayer>
  );
};
